# 🚀 DEPLOYMENT GUIDE - Vercel + Render + MongoDB Atlas

## 📋 PRE-DEPLOYMENT CHECKLIST

✅ All 5 real-time steps working locally  
✅ Socket.js and api.js URLs fixed  
✅ .env files created  
✅ Code pushed to GitHub  

---

## 🗄️ STEP 1: MongoDB Atlas Setup

### 1.1 Create Cluster
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free tier
3. Create a new cluster (M0 Sandbox - FREE)
4. Choose a cloud provider and region (closest to you)
5. Cluster name: `CitiConnect`
6. Click "Create Cluster" (takes 3-5 minutes)

### 1.2 Create Database User
1. Click "Database Access" in left menu
2. Click "Add New Database User"
3. Username: `citiconnect_user`
4. Password: Generate secure password (SAVE THIS!)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"

### 1.3 Whitelist IP Addresses
1. Click "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for production)
4. IP Address: `0.0.0.0/0`
5. Click "Confirm"

### 1.4 Get Connection String
1. Click "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy connection string:
   ```
   mongodb+srv://citiconnect_user:<password>@cluster0.xxxxx.mongodb.net/
   ```
6. Replace `<password>` with your actual password
7. Add database name at the end: `/citiconnect`
8. Final format:
   ```
   mongodb+srv://citiconnect_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/citiconnect
   ```

### 1.5 Test Connection (Optional)
```powershell
cd backend
node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_MONGODB_ATLAS_URL').then(() => {console.log('✅ Connected'); process.exit(0);}).catch(err => {console.log('❌ Error:', err); process.exit(1);});"
```

---

## 🌐 STEP 2: Deploy Backend to Render

### 2.1 Prepare GitHub Repository
1. Make sure your code is pushed to GitHub
2. Ensure `.env` is in `.gitignore` (it should be)
3. Commit and push all recent changes:
   ```powershell
   git add .
   git commit -m "Fix socket URLs and prepare for deployment"
   git push origin main
   ```

### 2.2 Create Render Account
1. Go to https://render.com
2. Sign up (use GitHub to connect)
3. Authorize Render to access your GitHub repos

### 2.3 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Repository: `cityConnect` or your repo name
4. Click "Connect"

### 2.4 Configure Service
**Basic Settings:**
- Name: `cityconnect-backend`
- Region: Choose closest to you (e.g., Singapore, Oregon)
- Branch: `main`
- Root Directory: `backend`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `node server.js`

**Instance Type:**
- Select "Free" tier

### 2.5 Add Environment Variables
Click "Advanced" → "Add Environment Variable" and add these:

```
PORT = 5000
MONGODB_URI = mongodb+srv://citiconnect_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/citiconnect
JWT_SECRET = (generate strong secret - see below)
CLIENT_URL = https://your-vercel-app.vercel.app
NODE_ENV = production
```

**To generate JWT_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and use as JWT_SECRET.

**Note:** You'll update `CLIENT_URL` after deploying frontend.

### 2.6 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes first time)
3. Watch the logs for:
   - ✅ MongoDB Connected Successfully
   - Server running on port 5000
4. Copy your Render URL: `https://cityconnect-backend.onrender.com`

### 2.7 Test Backend
Open in browser: `https://cityconnect-backend.onrender.com/health`

Should see:
```json
{
  "status": "OK",
  "message": "CitiConnect Server is running"
}
```

---

## ⚡ STEP 3: Deploy Frontend to Vercel

### 3.1 Update Frontend .env.production
Edit `frontend/.env.production`:
```env
VITE_API_URL=https://cityconnect-backend.onrender.com/api
VITE_SOCKET_URL=https://cityconnect-backend.onrender.com
```

Commit and push:
```powershell
git add frontend/.env.production
git commit -m "Update production URLs"
git push origin main
```

### 3.2 Create Vercel Account
1. Go to https://vercel.com/signup
2. Sign up with GitHub
3. Authorize Vercel to access your repos

### 3.3 Import Project
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Click "Import" on your `cityConnect` repo

### 3.4 Configure Project
**Framework Preset:** Vite  
**Root Directory:** `frontend`  
**Build Command:** `npm run build` (default)  
**Output Directory:** `dist` (default)  
**Install Command:** `npm install` (default)

### 3.5 Add Environment Variables
Click "Environment Variables" and add:
```
VITE_API_URL = https://cityconnect-backend.onrender.com/api
VITE_SOCKET_URL = https://cityconnect-backend.onrender.com
```

### 3.6 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app will be live at: `https://cityconnect-xxx.vercel.app`
4. Copy this URL

---

## 🔄 STEP 4: Update Backend with Frontend URL

### 4.1 Update Render Environment Variables
1. Go back to Render dashboard
2. Open your `cityconnect-backend` service
3. Click "Environment" in left menu
4. Update `CLIENT_URL`:
   ```
   CLIENT_URL = https://cityconnect-xxx.vercel.app
   ```
5. Click "Save Changes"
6. Service will automatically redeploy

### 4.2 Update CORS in Code (Optional but Recommended)
Edit `backend/server.js` to explicitly list allowed origins:

```javascript
const io = socketIO(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://cityconnect-xxx.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://cityconnect-xxx.vercel.app'
  ],
  credentials: true
}));
```

Commit and push. Render will auto-deploy.

---

## 🧪 STEP 5: Test Deployed Application

### 5.1 Open Your App
Go to: `https://cityconnect-xxx.vercel.app`

### 5.2 Check Console Logs
Open browser DevTools (F12) → Console

Should see:
```
🌐 API Base URL: https://cityconnect-backend.onrender.com/api
🔌 Connecting to Socket.IO server: https://cityconnect-backend.onrender.com
✅ Socket connected: xxxxx
```

### 5.3 Test Real-Time Tracking

**Browser 1 - Driver:**
1. Login: `driver1@citiconnect.com` / `driver123`
2. Click "Start Trip"
3. Allow location access
4. Check console: Should see "📍 Location updated"

**Browser 2 - User (Incognito):**
1. Login: `user1@example.com` / `user123`
2. Should see bus on map
3. Check console: Should see "📍 Bus location updated"
4. Bus marker should update in real-time!

### 5.4 Test on Mobile
1. Open app on your phone: `https://cityconnect-xxx.vercel.app`
2. Login as driver
3. Click "Start Trip"
4. Walk around outside
5. Open on another device as user
6. Should see your real-time movement!

---

## 🐛 TROUBLESHOOTING

### Issue: Socket Connection Error
**Symptoms:** "❌ Socket connection error"

**Solution:**
1. Check Render logs for errors
2. Verify `VITE_SOCKET_URL` in Vercel matches Render URL
3. Check backend CORS settings
4. Ensure Render service is running

### Issue: MongoDB Connection Failed
**Symptoms:** "❌ MongoDB Connection Error"

**Solution:**
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check connection string format
3. Ensure password doesn't have special characters (or URL-encode them)
4. Test connection string locally first

### Issue: 401 Unauthorized
**Symptoms:** Redirected to login immediately

**Solution:**
1. Check JWT_SECRET is same across environments
2. Clear browser localStorage
3. Login again with valid credentials

### Issue: CORS Error
**Symptoms:** "Access-Control-Allow-Origin" error

**Solution:**
1. Update `CLIENT_URL` in Render environment variables
2. Update CORS settings in `backend/server.js`
3. Redeploy backend

### Issue: Render Service Sleeps (Free Tier)
**Symptoms:** First request takes 30-60 seconds

**Solution:**
This is normal for Render free tier. Service spins down after 15 minutes of inactivity.
- **Workaround:** Use a service like UptimeRobot to ping your backend every 14 minutes
- **Better:** Upgrade to paid tier ($7/month)

---

## 📊 DEPLOYMENT CHECKLIST

### MongoDB Atlas:
- [ ] Cluster created
- [ ] Database user created
- [ ] IP whitelist: 0.0.0.0/0
- [ ] Connection string copied
- [ ] Tested connection

### Render Backend:
- [ ] Web service created
- [ ] Environment variables set
- [ ] Deployed successfully
- [ ] Health check returns OK
- [ ] MongoDB connected
- [ ] Logs show no errors

### Vercel Frontend:
- [ ] Project imported
- [ ] Environment variables set
- [ ] Deployed successfully
- [ ] Opens in browser
- [ ] Socket connects
- [ ] Can login

### Real-Time Testing:
- [ ] Driver can start trip
- [ ] Location updates sent
- [ ] User receives updates
- [ ] Map marker moves
- [ ] Works on mobile
- [ ] Multiple users can track same bus

---

## 🎯 FINAL URLS SUMMARY

**Local Development:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017/citiconnect

**Production:**
- Frontend: https://cityconnect-xxx.vercel.app
- Backend: https://cityconnect-backend.onrender.com
- MongoDB: mongodb+srv://...@cluster.mongodb.net/citiconnect

---

## 🎉 SUCCESS!

Your CitiConnect app is now deployed and fully functional!

**What works:**
✅ Real-time bus tracking across devices  
✅ User authentication  
✅ Driver location updates  
✅ Admin dashboard  
✅ SOS alerts  
✅ Notifications  

**Share your app:**
- Frontend URL: `https://cityconnect-xxx.vercel.app`
- Demo accounts in `FRIEND_CREDENTIALS.md`

---

## 📱 BONUS: Custom Domain (Optional)

### Vercel Custom Domain:
1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., cityconnect.com)
3. Follow DNS instructions
4. Update backend `CLIENT_URL`

### Render Custom Domain:
1. Render Dashboard → Settings
2. Add custom domain
3. Update DNS records
4. Update frontend API URLs

---

## 🔐 SECURITY CHECKLIST

Before going fully public:
- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable MongoDB authentication
- [ ] Restrict MongoDB IP whitelist
- [ ] Add rate limiting
- [ ] Implement HTTPS everywhere
- [ ] Review user permissions
- [ ] Monitor logs regularly

---

## 💰 COST BREAKDOWN

**Free Tier (Recommended for Demo):**
- MongoDB Atlas: Free (512MB storage, 1GB data transfer)
- Render: Free (750 hours/month, sleeps after 15 min inactivity)
- Vercel: Free (unlimited static sites, 100GB bandwidth)
- **Total: $0/month** ✨

**Paid Tier (Recommended for Production):**
- MongoDB Atlas: $9/month (shared cluster, 2GB storage)
- Render: $7/month (always-on instance)
- Vercel: Free (sufficient for most use cases)
- **Total: ~$16/month**

---

## 🎓 YOU'RE READY FOR INTERVIEWS!

With your app deployed online, you can:
- ✅ Demo from anywhere with internet
- ✅ Share link with interviewers beforehand
- ✅ Test on multiple devices simultaneously
- ✅ Show real-world deployment skills

Good luck! 🚀
