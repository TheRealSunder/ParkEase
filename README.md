# ParkEase - Parking Management System

A comprehensive parking management system with both customer and owner interfaces.

## Features

### For Drivers
- Find available parking spots near universities
- Make reservations with downpayment
- Real-time slot availability updates
- QR code-based parking sessions
- Parking history and receipts

### For Parking Owners
- POS system for managing entries and exits
- Real-time slot monitoring
- Revenue tracking
- Customer reservation management
- Configurable pricing and settings

## Tech Stack

### Frontend
- Pure HTML, CSS, and JavaScript
- Mobile-first responsive design
- Real-time WebSocket updates
- Local storage for offline functionality

### Backend
- Node.js with Express
- SQLite database
- JWT authentication
- WebSocket for real-time updates
- RESTful API design

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database
```bash
npm run init-db
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Frontend
Open `index.html` in your browser or serve the files using a local server.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Parking Areas
- `GET /api/parking-areas` - Get all parking areas
- `GET /api/parking-areas/:id` - Get specific parking area
- `POST /api/parking-areas` - Create parking area (owner only)

### Reservations
- `GET /api/reservations` - Get user's reservations
- `POST /api/reservations` - Create new reservation
- `PUT /api/reservations/:id` - Update reservation

### Owner Operations
- `GET /api/owner/reservations` - Get pending reservations
- `POST /api/owner/entry` - Process customer entry
- `POST /api/owner/exit` - Process customer exit

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
JWT_SECRET=your-secret-key
DATABASE_URL=./parkease.db
WS_PORT=8080
```

## Database Schema

### Users
- id, full_name, email, phone, password_hash, user_type, created_at

### Parking Areas
- id, owner_id, name, location, total_slots, hourly_rate, operating_hours, created_at

### Reservations
- id, user_id, parking_area_id, qr_code, status, downpayment, entry_time, exit_time, total_cost, payment_method, created_at

## Real-time Features

The system uses WebSockets for real-time updates:
- Live slot availability updates
- Instant reservation confirmations
- Real-time POS system updates

## Deployment

### Frontend
Deploy static files to:
- Netlify
- Vercel
- GitHub Pages

### Backend
Deploy to:
- Railway
- Render
- Heroku

## Development

### Adding New Features
1. Update database schema in `scripts/init-db.js`
2. Add API endpoints in `server.js`
3. Update frontend API client in `api-client.js`
4. Modify UI components as needed

### Testing
- Use the sample data created during database initialization
- Test with multiple browser tabs for real-time features
- Verify mobile responsiveness

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details