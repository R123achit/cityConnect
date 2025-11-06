# Quick Start Guide - CitiConnect

Follow these steps to get CitiConnect running on your local machine in under 5 minutes!

## Prerequisites Check
- [ ] Node.js installed (v16+) - Run `node --version`
- [ ] MongoDB installed and running - Run `mongod --version`
- [ ] Git installed (optional)

## Step-by-Step Setup

### 1. Install Backend Dependencies
Open PowerShell and navigate to the backend folder:

```powershell
cd backend
npm install
```

### 2. Configure Backend Environment
Create a `.env` file in the backend folder:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and update if needed (default values should work):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/citiconnect
JWT_SECRET=citiconnect_secret_key_2024
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Start MongoDB
Make sure MongoDB is running. In a new PowerShell window:

```powershell
# Windows (if MongoDB is installed as a service)
net start MongoDB

# OR start manually
mongod
```

### 4. Start Backend Server
In the backend folder:

```powershell
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server is running on port 5000
```

### 5. Install Frontend Dependencies
Open a NEW PowerShell window and navigate to frontend:

```powershell
cd frontend
npm install
```

### 6. Configure Frontend Environment
Create a `.env` file in the frontend folder:

```powershell
Copy-Item .env.example .env
```

The default values should work:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 7. Start Frontend Server
In the frontend folder:

```powershell
npm run dev
```

You should see:
```
  VITE ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

### 8. Access the Application

Open your browser and go to: `http://localhost:5173`

## Create Your First Admin Account

1. Click "Register here" on the login page
2. Fill in your details:
   - Name: Admin User
   - Email: admin@citiconnect.com
   - Phone: Your phone number
   - Password: admin123
3. Click "Register"

4. Update user role to admin in MongoDB:

```powershell
# Open MongoDB shell
mongosh

# Switch to citiconnect database
use citiconnect

# Update the user role to admin
db.users.updateOne(
  { email: "admin@citiconnect.com" },
  { $set: { role: "admin" } }
)

# Exit
exit
```

5. Logout and login again with admin@citiconnect.com

## Create Test Data

### As Admin, create:

1. **Routes**:
   - Route Number: R001
   - Route Name: Downtown Express
   - Start Point: Central Station
   - End Point: Airport
   - Add at least 3 stops with coordinates (you can use: 28.6139, 77.2090 as sample)

2. **Drivers**:
   - Name: John Driver
   - Email: driver@citiconnect.com
   - Password: driver123
   - License: DL12345

3. **Buses**:
   - Bus Number: DL-01-AB-1234
   - Registration: DL01AB1234
   - Capacity: 50
   - Type: AC
   - Assign the driver and route

4. **Test User**:
   Register a new account with role "user" to test user features.

## Test the System

### Test Driver Features:
1. Logout and login as driver@citiconnect.com
2. You should see your assigned bus and route
3. Click "Start Trip"
4. Allow location access when prompted
5. Your location will be shared in real-time

### Test User Features:
1. Logout and login as user account
2. Select the route you created
3. You should see the driver's bus on the map
4. Your location will show as a blue marker

### Test Admin Features:
1. Login as admin
2. Go to Live Tracking to see all active buses
3. Send notifications from Alerts & Notifications
4. View analytics and SOS alerts

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `net start MongoDB`
- Check if port 27017 is available

### Port Already in Use
Backend:
```powershell
# Change PORT in backend/.env to 5001 or another port
```

Frontend:
```powershell
# Change port in frontend/vite.config.js
```

### Location Not Working
- Use HTTPS in production (required for geolocation)
- For localhost, allow location permission in browser
- Check browser console for errors

### Socket Connection Issues
- Ensure backend is running
- Check VITE_SOCKET_URL in frontend/.env
- Check browser console for connection errors

## Next Steps

1. ✅ Create more routes and buses
2. ✅ Test real-time tracking with multiple browsers
3. ✅ Try the SOS alert feature
4. ✅ Send notifications to users and drivers
5. ✅ Explore the analytics dashboard

## Need Help?

- Check the main README.md for detailed documentation
- Review console logs for error messages
- Ensure all services are running (MongoDB, Backend, Frontend)

---

**Congratulations! 🎉 Your CitiConnect application is now running!**
