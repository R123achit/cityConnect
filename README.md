# CitiConnect - Live Bus Tracking System

A comprehensive MERN stack application for real-time bus tracking with separate dashboards for Admin, Driver, and User roles.

## 🚀 Features

### Admin Dashboard
- **Bus Management**: Add, edit, delete buses, assign drivers & routes
- **Route Management**: Define routes with multiple stops
- **Driver Management**: Register and manage drivers
- **Live Tracking**: Monitor all buses moving live on a map
- **Alerts & Notifications**: Send messages to drivers or users
- **Analytics Dashboard**: Visualize usage, delays, and performance
- **Emergency Center**: Handle SOS alerts from drivers
- **Profile Management**: Admin account settings

### User Dashboard
- **Live Bus Tracking**: View buses in real-time on map
- **Route Selection**: Filter buses by specific routes
- **Bus Details**: See bus number, driver, current stop, and status
- **ETA Display**: Estimated arrival time at selected stop
- **My Location**: Show user location on map
- **Stop Information**: View all stops on selected route
- **Notifications**: Receive alerts from admin
- **Trip History**: View previously tracked buses
- **Profile Management**: Update user information

### Driver Dashboard
- **Route Display**: View assigned route with all stops
- **Live Location Sharing**: Automatic GPS updates every few seconds
- **Start/Stop Trip**: Control trip status
- **Route Progress**: Real-time progress with current and next stop
- **Trip Statistics**: Duration and distance tracking
- **Admin Messages**: Receive alerts from admin
- **SOS Button**: Emergency alert with current location
- **Connectivity Status**: Online/offline indicator
- **Profile Management**: View and edit driver details

## 🛠️ Tech Stack

- **Frontend**: React + Vite, TailwindCSS, React Router, Leaflet Maps
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB
- **Real-time**: Socket.IO for live tracking
- **Authentication**: JWT

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd cityconnect
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your configuration
# Set your MongoDB URI, JWT secret, etc.

# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🗄️ Database Setup

The application will automatically connect to MongoDB. Make sure MongoDB is running on your system.

### Create Initial Admin User

After starting the backend, you can register an admin user through the API or update the role in MongoDB:

```javascript
// In MongoDB shell or MongoDB Compass
db.users.updateOne(
  { email: "admin@citiconnect.com" },
  { $set: { role: "admin" } }
)
```

## 🎯 Demo Credentials

After initial setup, you can create these test accounts:

**Admin:**
- Email: admin@citiconnect.com
- Password: admin123

**Driver:**
- Email: driver@citiconnect.com
- Password: driver123

**User:**
- Email: user@citiconnect.com
- Password: user123

## 🌐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/citiconnect
JWT_SECRET=your_jwt_secret_key_change_this_in_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 📱 Features Details

### Real-time Tracking
- Uses Socket.IO for bidirectional communication
- Driver location updates every 5 seconds when trip is active
- Users see buses move in real-time on the map
- Automatic reconnection handling

### Maps Integration
- Uses Leaflet with OpenStreetMap tiles
- Shows bus locations, routes, and stops
- User location tracking
- ETA calculation based on distance

### Notifications
- Admin can broadcast to all users, drivers, or specific groups
- Real-time delivery via Socket.IO
- Persistent storage in database
- Read/unread status tracking

### Emergency System
- Driver SOS button sends immediate alert to admin
- Includes current location and optional description
- Admin can acknowledge and resolve alerts
- Alert history tracking

## 🏗️ Project Structure

```
cityconnect/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express + Socket.IO server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   │   ├── Admin/   # Admin dashboard pages
    │   │   ├── User/    # User dashboard pages
    │   │   ├── Driver/  # Driver dashboard pages
    │   │   └── Auth/    # Login/Register
    │   ├── store/       # State management (Zustand)
    │   ├── utils/       # API client, Socket client
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    └── package.json
```

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables
2. Ensure MongoDB is accessible
3. Update CORS settings for production URL

### Frontend Deployment (e.g., Vercel, Netlify)
1. Update VITE_API_URL and VITE_SOCKET_URL
2. Build: `npm run build`
3. Deploy dist folder

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected API routes with middleware
- Role-based access control
- CORS configuration

## 📝 API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user
- PUT /api/auth/profile - Update profile

### Admin
- GET/POST/PUT/DELETE /api/admin/buses
- GET/POST/PUT/DELETE /api/admin/routes
- GET/POST/PUT/DELETE /api/admin/drivers
- GET /api/admin/sos-alerts
- PUT /api/admin/sos-alerts/:id/acknowledge
- PUT /api/admin/sos-alerts/:id/resolve

### Driver
- GET /api/driver/assigned-bus
- GET /api/driver/assigned-route
- PUT /api/driver/update-location
- PUT /api/driver/start-trip
- PUT /api/driver/stop-trip
- POST /api/driver/sos

### User
- GET /api/user/routes
- GET /api/user/active-buses
- GET /api/user/buses/route/:routeId
- POST /api/user/trip-history
- GET /api/user/trip-history

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@citiconnect.com or create an issue in the repository.

## 🎉 Acknowledgments

- OpenStreetMap for map tiles
- Leaflet for map library
- Socket.IO for real-time communication
- TailwindCSS for styling
