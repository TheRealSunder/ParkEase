const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./parkease.db');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      user_type TEXT NOT NULL CHECK (user_type IN ('driver', 'owner')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Parking areas table
  db.run(`
    CREATE TABLE IF NOT EXISTS parking_areas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      total_slots INTEGER NOT NULL,
      hourly_rate DECIMAL(10,2) NOT NULL,
      operating_hours TEXT DEFAULT '24/7',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    )
  `);

  // Reservations table
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      parking_area_id INTEGER NOT NULL,
      qr_code TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('reserved', 'active', 'completed', 'cancelled')),
      downpayment DECIMAL(10,2) DEFAULT 0,
      entry_time DATETIME,
      exit_time DATETIME,
      total_cost DECIMAL(10,2),
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (parking_area_id) REFERENCES parking_areas(id)
    )
  `);

  // Insert sample data
  console.log('Creating sample data...');

  // Sample parking areas
  db.run(`
    INSERT OR IGNORE INTO parking_areas (id, owner_id, name, location, total_slots, hourly_rate, operating_hours)
    VALUES 
      (1, 1, 'EGI Taft Parking', 'Taft Avenue, Manila', 50, 25.00, '24/7'),
      (2, 1, 'DLSU Razon Parking', 'DLSU Campus, Manila', 30, 15.00, '6AM-10PM'),
      (3, 1, 'One Archer''s Place', 'Taft Avenue, Manila', 40, 30.00, '24/7'),
      (4, 1, 'NU Main Parking', 'NU Campus, Manila', 35, 20.00, '6AM-10PM')
  `);

  // Sample owner user (for testing)
  db.run(`
    INSERT OR IGNORE INTO users (id, full_name, email, phone, password_hash, user_type)
    VALUES (1, 'Parking Owner', 'owner@parkease.com', '0917-123-4567', '$2a$10$example.hash.here', 'owner')
  `);

  console.log('Database initialized successfully!');
});

db.close();