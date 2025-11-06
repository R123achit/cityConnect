# CitiConnect - Detailed Setup Instructions

This guide provides comprehensive setup instructions for the CitiConnect bus tracking system.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [MongoDB Installation](#mongodb-installation)
3. [Project Installation](#project-installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Creating Initial Data](#creating-initial-data)
7. [Testing](#testing)
8. [Common Issues](#common-issues)

## System Requirements

### Software Requirements
- **Node.js**: v16.0.0 or higher
- **MongoDB**: v4.4 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)
- **Git**: Latest version (optional)

### Hardware Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 2GB free space
- **Network**: Internet connection for package installation

### Checking Current Versions

Open PowerShell and run:

```powershell
node --version
npm --version
mongod --version
```

## MongoDB Installation

### Windows Installation

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows platform
   - Download the MSI installer

2. **Install MongoDB**
   ```
   - Run the .msi installer
   - Choose "Complete" installation
   - Select "Install MongoDB as a Service"
   - Use default data directory: C:\Program Files\MongoDB\Server\{version}\data
   - Keep default service name: MongoDB
   ```

3. **Verify Installation**
   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB
   
   # Start MongoDB if not running
   net start MongoDB
   ```

4. **Install MongoDB Compass (Optional but Recommended)**
   - GUI tool for viewing and managing MongoDB data
   - Usually included with MongoDB installation
   - Or download from: https://www.mongodb.com/try/download/compass

## Project Installation

### 1. Clone or Download the Project

**Option A: Using Git**
```powershell
git clone <repository-url>
cd cityconnect
```

**Option B: Download ZIP**
- Download the project ZIP file
- Extract to a folder (e.g., C:\Users\rachi\cityconnect)
- Navigate to the folder in PowerShell

### 2. Install Backend Dependencies

```powershell
cd backend
npm install
```

**Expected packages to be installed:**
- express (v4.18.2)
- mongoose (v8.0.3)
- socket.io (v4.6.1)
- jsonwebtoken (v9.0.2)
- bcryptjs (v2.4.3)
- cors (v2.8.5)
- dotenv (v16.3.1)
- express-validator (v7.0.1)

This should take 1-3 minutes depending on your internet speed.

### 3. Install Frontend Dependencies

```powershell
cd ..\frontend
npm install
```

**Expected packages to be installed:**
- react (v18.2.0)
- vite (v5.0.8)
- react-router-dom (v6.21.1)
- tailwindcss (v3.4.0)
- leaflet (v1.9.4)
- react-leaflet (v4.2.1)
- socket.io-client (v4.6.1)
- axios (v1.6.2)
- zustand (v4.4.7)
- recharts (v2.10.3)
- react-hot-toast (v2.4.1)

This should take 2-4 minutes.

## Configuration

### Backend Configuration

1. **Navigate to backend folder**
   ```powershell
   cd backend
   ```

2. **Copy environment template**
   ```powershell
   Copy-Item .env.example .env
   ```

3. **Edit .env file** (use Notepad or VS Code)
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/citiconnect
   JWT_SECRET=citiconnect_secret_key_2024_change_in_production
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

   **Configuration Explanations:**
   - `PORT`: Backend server port (default: 5000)
   - `MONGODB_URI`: MongoDB connection string
     - Format: `mongodb://[host]:[port]/[database_name]`
     - For local: `mongodb://localhost:27017/citiconnect`
     - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/citiconnect`
   - `JWT_SECRET`: Secret key for JWT token generation (change in production!)
   - `CLIENT_URL`: Frontend URL for CORS (default: http://localhost:5173)
   - `NODE_ENV`: Environment (development/production)

### Frontend Configuration

1. **Navigate to frontend folder**
   ```powershell
   cd ..\frontend
   ```

2. **Copy environment template**
   ```powershell
   Copy-Item .env.example .env
   ```

3. **Edit .env file**
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

   **Configuration Explanations:**
   - `VITE_API_URL`: Backend API endpoint
   - `VITE_SOCKET_URL`: Socket.IO server endpoint

### MongoDB Database Setup

The application will automatically create the database and collections when you first run it.

**Optional: Pre-create database**
```powershell
# Open MongoDB shell
mongosh

# Create database
use citiconnect

# Create collections (optional - will auto-create)
db.createCollection("users")
db.createCollection("buses")
db.createCollection("routes")
db.createCollection("notifications")
db.createCollection("sosalerts")

# Exit
exit
```

## Running the Application

### Start MongoDB (if not running)

```powershell
# Check status
Get-Service MongoDB

# Start service
net start MongoDB
```

### Start Backend Server

1. **Open PowerShell window #1**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Expected output:**
   ```
   > backend@1.0.0 dev
   > nodemon server.js

   [nodemon] starting `node server.js`
   ✅ MongoDB Connected Successfully
   🚀 Server is running on port 5000
   📡 Socket.IO server is ready
   ```

3. **Keep this window open!**

### Start Frontend Server

1. **Open PowerShell window #2**
   ```powershell
   cd frontend
   npm run dev
   ```

2. **Expected output:**
   ```
   VITE v5.0.8  ready in XXX ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ➜  press h to show help
   ```

3. **Keep this window open!**

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

You should see the CitiConnect login page.

## Creating Initial Data

### Step 1: Register Admin User

1. Open http://localhost:5173
2. Click "Register here"
3. Fill in the form:
   - Name: `Admin User`
   - Email: `admin@citiconnect.com`
   - Phone: `+1234567890`
   - Password: `admin123`
   - Confirm Password: `admin123`
4. Click "Register"

### Step 2: Make User an Admin

**Using MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `citiconnect`
4. Select collection: `users`
5. Find the user with email `admin@citiconnect.com`
6. Click edit
7. Change `role` from `"user"` to `"admin"`
8. Click Update

**Using MongoDB Shell:**
```powershell
mongosh

use citiconnect

db.users.updateOne(
  { email: "admin@citiconnect.com" },
  { $set: { role: "admin" } }
)

exit
```

### Step 3: Login as Admin

1. Logout from the application
2. Login with:
   - Email: `admin@citiconnect.com`
   - Password: `admin123`

You should now see the Admin Dashboard.

### Step 4: Create Routes

1. Go to **Route Management**
2. Click **Add New Route**
3. Fill in route details:
   ```
   Route Number: R001
   Route Name: Downtown Express
   Start Point: Central Station
   End Point: Airport Terminal
   Distance: 15 (km)
   Estimated Time: 45 (minutes)
   ```

4. **Add Stops** (click "Add Stop" button):
   
   **Stop 1:**
   - Stop Name: Central Station
   - Latitude: 28.6139
   - Longitude: 77.2090

   **Stop 2:**
   - Stop Name: City Mall
   - Latitude: 28.6250
   - Longitude: 77.2200

   **Stop 3:**
   - Stop Name: Railway Junction
   - Latitude: 28.6350
   - Longitude: 77.2300

   **Stop 4:**
   - Stop Name: Airport Terminal
   - Latitude: 28.6450
   - Longitude: 77.2400

5. Click **Add Route**

Repeat for more routes if needed.

### Step 5: Create Driver Accounts

1. Go to **Driver Management**
2. Click **Add New Driver**
3. Fill in driver details:
   ```
   Name: John Driver
   Email: driver@citiconnect.com
   Phone: +1234567891
   License Number: DL123456789
   Password: driver123
   ```
4. Click **Add Driver**

### Step 6: Create Buses

1. Go to **Bus Management**
2. Click **Add New Bus**
3. Fill in bus details:
   ```
   Bus Number: DL-01-AB-1234
   Registration Number: DL01AB1234
   Type: AC
   Capacity: 50
   Assigned Driver: John Driver (select from dropdown)
   Assigned Route: R001 - Downtown Express (select from dropdown)
   ```
4. Click **Add Bus**

### Step 7: Create Test User

1. Logout
2. Register a new account:
   - Name: `Test User`
   - Email: `user@citiconnect.com`
   - Phone: `+1234567892`
   - Password: `user123`
3. This will be a regular user account

## Testing

### Test 1: Driver Live Location Sharing

1. **Logout and login as driver:**
   - Email: driver@citiconnect.com
   - Password: driver123

2. **You should see:**
   - Assigned bus information
   - Assigned route with stops
   - Map showing route

3. **Start the trip:**
   - Click "Start Trip" button
   - Allow location access when browser asks
   - You should see "Trip Active" status
   - Location should update automatically every 5 seconds

4. **Check location sharing:**
   - Open a new browser tab
   - Login as admin
   - Go to "Live Tracking"
   - You should see the driver's bus on the map with real-time updates

### Test 2: User Tracking Buses

1. **Logout and login as user:**
   - Email: user@citiconnect.com
   - Password: user123

2. **On User Dashboard:**
   - Select route "R001" from dropdown
   - You should see the active bus on the map
   - Select your nearest stop
   - ETA (Estimated Time of Arrival) will be calculated
   - Click "Track This Bus" to save to history

3. **Check trip history:**
   - Go to "Trip History" page
   - You should see previously tracked buses

### Test 3: Admin Notifications

1. **Login as admin**
2. **Go to Alerts & Notifications**
3. **Create notification:**
   - Title: "Service Update"
   - Message: "All buses running on schedule"
   - Recipients: Select "drivers" or "users"
   - Click "Send Notification"

4. **Verify delivery:**
   - Switch to driver or user account
   - Notification should appear in the dashboard

### Test 4: SOS Emergency Alert

1. **Login as driver**
2. **Click the SOS Alert button** (red button on dashboard)
3. **Fill in details:**
   - Alert Type: Select type (e.g., "Breakdown")
   - Description: "Engine overheating"
   - Click "Send SOS Alert"

4. **Verify in admin:**
   - Login as admin
   - Go to "Emergency Center"
   - You should see the SOS alert
   - Click "Acknowledge" to acknowledge
   - Click "Resolve" when done

### Test 5: Analytics Dashboard

1. **Login as admin**
2. **Go to Analytics page**
3. **You should see:**
   - Bus status distribution chart
   - Route usage statistics
   - SOS alerts trend
   - Daily trips chart
   - Route performance table

## Common Issues

### Issue 1: MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB
net start MongoDB

# If service doesn't exist, start manually
mongod
```

### Issue 2: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Issue 3: Frontend Can't Connect to Backend

**Symptoms:** API requests fail, Socket.IO disconnected

**Solution:**
1. Verify backend is running on port 5000
2. Check `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```
3. Restart frontend server after changing .env

### Issue 4: Geolocation Not Working

**Error:** "User denied Geolocation" or location not updating

**Solution:**
1. **Allow location permission in browser:**
   - Chrome: Click lock icon in address bar → Site settings → Location → Allow
   - Firefox: Click lock icon → Permissions → Access Your Location → Allow

2. **Use HTTPS in production** (required for geolocation API)

3. **For localhost testing:** Most browsers allow geolocation on localhost

### Issue 5: Maps Not Loading

**Symptoms:** Blank map area, tiles not loading

**Solution:**
1. Check internet connection (OpenStreetMap tiles require internet)
2. Verify Leaflet CSS is loaded (check browser console)
3. Clear browser cache
4. Check if firewall is blocking map tile requests

### Issue 6: JWT Token Expired

**Error:** "Token expired" or "Unauthorized"

**Solution:**
1. Logout and login again
2. Token expires after 30 days by default
3. Clear browser localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   ```

### Issue 7: npm install Fails

**Error:** Various npm installation errors

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Issue 8: Database Connection Timeout

**Error:** `MongooseServerSelectionError: Server selection timed out`

**Solution:**
1. Check MongoDB URI in `backend/.env`
2. Verify MongoDB is accessible:
   ```powershell
   mongosh mongodb://localhost:27017
   ```
3. Check firewall settings
4. Increase timeout in mongoose connection (optional)

## Production Deployment

For production deployment:

1. **Update environment variables:**
   - Use strong JWT_SECRET (32+ characters)
   - Use MongoDB Atlas or production MongoDB instance
   - Set NODE_ENV=production
   - Update CLIENT_URL to production frontend URL

2. **Security checklist:**
   - [ ] Change all default passwords
   - [ ] Use HTTPS for frontend and backend
   - [ ] Enable MongoDB authentication
   - [ ] Configure proper CORS settings
   - [ ] Use environment variables (don't commit .env)
   - [ ] Enable rate limiting
   - [ ] Add logging and monitoring

3. **Build frontend:**
   ```powershell
   cd frontend
   npm run build
   ```

4. **Deploy backend and frontend** to your hosting provider (Heroku, Vercel, Railway, AWS, etc.)

## Additional Resources

- **MongoDB Documentation:** https://docs.mongodb.com
- **React Documentation:** https://react.dev
- **Socket.IO Documentation:** https://socket.io/docs
- **Leaflet Documentation:** https://leafletjs.com
- **Express.js Documentation:** https://expressjs.com

## Support

If you encounter issues not covered here:
1. Check browser console for errors
2. Check backend server logs
3. Verify all services are running
4. Review this guide step-by-step
5. Check MongoDB logs

---

**You're all set! Happy tracking! 🚍📍**
