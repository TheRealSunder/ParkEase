const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your existing frontend files

// Database setup
const db = new sqlite3.Database('./parkease.db');

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: 8080 });

// Broadcast to all connected clients
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ParkEase API is running' });
});

// Authentication
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, userType } = req.body;
    
    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (row) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert user
      db.run(
        'INSERT INTO users (full_name, email, phone, password_hash, user_type) VALUES (?, ?, ?, ?, ?)',
        [fullName, email, phone, hashedPassword, userType],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }
          
          const token = jwt.sign(
            { userId: this.lastID, email, userType },
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: this.lastID, email, fullName, userType }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { userId: user.id, email: user.email, userType: user.user_type },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          userType: user.user_type
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Parking Areas
app.get('/api/parking-areas', (req, res) => {
  const query = `
    SELECT pa.*, 
           COUNT(r.id) as current_reservations,
           (pa.total_slots - COUNT(r.id)) as available_slots
    FROM parking_areas pa
    LEFT JOIN reservations r ON pa.id = r.parking_area_id 
                              AND r.status IN ('reserved', 'active')
    GROUP BY pa.id
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.get('/api/parking-areas/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT pa.*, 
           COUNT(r.id) as current_reservations,
           (pa.total_slots - COUNT(r.id)) as available_slots
    FROM parking_areas pa
    LEFT JOIN reservations r ON pa.id = r.parking_area_id 
                              AND r.status IN ('reserved', 'active')
    WHERE pa.id = ?
    GROUP BY pa.id
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Parking area not found' });
    }
    
    res.json(row);
  });
});

app.post('/api/parking-areas', authenticateToken, (req, res) => {
  if (req.user.userType !== 'owner') {
    return res.status(403).json({ error: 'Only owners can create parking areas' });
  }
  
  const { name, location, totalSlots, hourlyRate, operatingHours } = req.body;
  
  db.run(
    'INSERT INTO parking_areas (owner_id, name, location, total_slots, hourly_rate, operating_hours) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.userId, name, location, totalSlots, hourlyRate, operatingHours],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create parking area' });
      }
      
      res.status(201).json({
        message: 'Parking area created successfully',
        id: this.lastID
      });
    }
  );
});

// Reservations
app.get('/api/reservations', authenticateToken, (req, res) => {
  const query = `
    SELECT r.*, pa.name as parking_name, pa.location, pa.hourly_rate
    FROM reservations r
    JOIN parking_areas pa ON r.parking_area_id = pa.id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `;
  
  db.all(query, [req.user.userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/reservations', authenticateToken, (req, res) => {
  const { parkingAreaId, downpayment } = req.body;
  const qrCode = `PK-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  
  // Check availability first
  db.get(
    'SELECT total_slots, (SELECT COUNT(*) FROM reservations WHERE parking_area_id = ? AND status IN ("reserved", "active")) as occupied FROM parking_areas WHERE id = ?',
    [parkingAreaId, parkingAreaId],
    (err, area) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!area) {
        return res.status(404).json({ error: 'Parking area not found' });
      }
      
      if (area.occupied >= area.total_slots) {
        return res.status(400).json({ error: 'No available slots' });
      }
      
      // Create reservation
      db.run(
        'INSERT INTO reservations (user_id, parking_area_id, qr_code, status, downpayment, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
        [req.user.userId, parkingAreaId, qrCode, 'reserved', downpayment],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create reservation' });
          }
          
          // Broadcast slot update
          broadcast({
            type: 'slot_update',
            parkingAreaId,
            availableSlots: area.total_slots - area.occupied - 1
          });
          
          res.status(201).json({
            message: 'Reservation created successfully',
            reservationId: this.lastID,
            qrCode,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
          });
        }
      );
    }
  );
});

app.put('/api/reservations/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, entryTime, exitTime, totalCost } = req.body;
  
  let updateQuery = 'UPDATE reservations SET status = ?';
  let params = [status];
  
  if (entryTime) {
    updateQuery += ', entry_time = ?';
    params.push(entryTime);
  }
  
  if (exitTime) {
    updateQuery += ', exit_time = ?';
    params.push(exitTime);
  }
  
  if (totalCost) {
    updateQuery += ', total_cost = ?';
    params.push(totalCost);
  }
  
  updateQuery += ' WHERE id = ?';
  params.push(id);
  
  db.run(updateQuery, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update reservation' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    res.json({ message: 'Reservation updated successfully' });
  });
});

// Owner routes for POS system
app.get('/api/owner/reservations', authenticateToken, (req, res) => {
  if (req.user.userType !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' });
  }
  
  const query = `
    SELECT r.*, u.full_name, u.phone, pa.name as parking_name
    FROM reservations r
    JOIN users u ON r.user_id = u.id
    JOIN parking_areas pa ON r.parking_area_id = pa.id
    WHERE pa.owner_id = ? AND r.status = 'reserved'
    ORDER BY r.created_at DESC
  `;
  
  db.all(query, [req.user.userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/owner/entry', authenticateToken, (req, res) => {
  if (req.user.userType !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' });
  }
  
  const { type, qrCode, customerName } = req.body;
  
  if (type === 'walkin') {
    // Create walk-in entry
    const newQrCode = `PK-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // For demo, use first parking area owned by this user
    db.get('SELECT id FROM parking_areas WHERE owner_id = ? LIMIT 1', [req.user.userId], (err, area) => {
      if (err || !area) {
        return res.status(500).json({ error: 'No parking area found' });
      }
      
      db.run(
        'INSERT INTO reservations (parking_area_id, qr_code, status, entry_time, created_at) VALUES (?, ?, ?, datetime("now"), datetime("now"))',
        [area.id, newQrCode, 'active'],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create entry' });
          }
          
          res.json({
            message: 'Walk-in entry created',
            qrCode: newQrCode,
            entryTime: new Date().toISOString()
          });
        }
      );
    });
  } else if (type === 'reserved') {
    // Process reserved entry
    db.run(
      'UPDATE reservations SET status = ?, entry_time = datetime("now") WHERE qr_code = ?',
      ['active', qrCode],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to process entry' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Reservation not found' });
        }
        
        res.json({
          message: 'Reserved entry processed',
          entryTime: new Date().toISOString()
        });
      }
    );
  }
});

app.post('/api/owner/exit', authenticateToken, (req, res) => {
  if (req.user.userType !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' });
  }
  
  const { qrCode, totalCost, paymentMethod } = req.body;
  
  db.run(
    'UPDATE reservations SET status = ?, exit_time = datetime("now"), total_cost = ?, payment_method = ? WHERE qr_code = ?',
    ['completed', totalCost, paymentMethod, qrCode],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to process exit' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Active session not found' });
      }
      
      res.json({
        message: 'Exit processed successfully',
        exitTime: new Date().toISOString()
      });
    }
  );
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`ParkEase API server running on port ${PORT}`);
  console.log(`WebSocket server running on port 8080`);
});