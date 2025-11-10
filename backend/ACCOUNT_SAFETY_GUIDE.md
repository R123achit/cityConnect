# 🔒 ACCOUNT SAFETY GUIDE

## ⚠️ **THE PROBLEM (NOW FIXED!)**

Your accounts were deleting because of this line in `seedData.js`:

```javascript
await User.deleteMany({}); // ← THIS WAS DELETING ALL USERS!
```

Every time you ran `node seedData.js`, it would:
1. Delete ALL users (including your account)
2. Delete ALL buses
3. Delete ALL routes
4. Then create new test data

## ✅ **THE FIX**

I've commented out the delete lines in `seedData.js`. Now it will:
- ✅ Keep your existing accounts
- ✅ Only add new data if needed
- ✅ Warn you before deleting anything

## 📋 **SAFE COMMANDS**

### **Option 1: Add Sample Data (Safe - No Deletion)**
```bash
cd backend
node addSampleData.js
```
- ✅ Keeps your account
- ✅ Only adds missing data
- ✅ Safe to run anytime

### **Option 2: Full Reset (Dangerous - Deletes Everything)**
```bash
cd backend
# Edit seedData.js first, uncomment the deleteMany lines
node seedData.js
```
- ❌ Deletes ALL accounts
- ❌ You'll lose your registered account
- ⚠️ Only use for fresh start

## 🔧 **HOW TO KEEP YOUR ACCOUNT SAFE**

### **1. Never Run seedData.js After Registration**

❌ **BAD:**
```bash
# After registering your account
node seedData.js  # ← This deletes your account!
```

✅ **GOOD:**
```bash
# After registering your account
node addSampleData.js  # ← This keeps your account safe!
```

### **2. Check Database Before Deleting**

If you MUST reset, first check what you have:

```bash
# Open MongoDB shell
mongosh

# Switch to database
use citiconnect

# Count users
db.users.countDocuments()

# View all emails
db.users.find({}, {email: 1, name: 1})

# Exit
exit
```

### **3. Backup Important Accounts**

Save your credentials somewhere safe:
```
Email: your_email@example.com
Password: your_password
Role: user/driver/admin
```

## 🎯 **WHAT TO DO NOW**

1. **Create your account fresh:**
   ```
   Go to: http://localhost:5173/register
   Register with your email
   Login
   ```

2. **Don't run seedData.js anymore**
   - Use `addSampleData.js` instead
   - It's safe and won't delete your account

3. **If you need test data:**
   ```bash
   cd backend
   node addSampleData.js
   ```

## 🔍 **HOW TO CHECK IF YOUR ACCOUNT EXISTS**

```javascript
// Run this in browser console after login
console.log(localStorage.getItem('user'));
console.log(localStorage.getItem('token'));
```

Or check MongoDB:
```bash
mongosh
use citiconnect
db.users.find({ email: "your_email@example.com" })
```

## 💡 **PREVENTION TIPS**

1. ✅ Always use `addSampleData.js` for testing
2. ✅ Never run `seedData.js` after you have real accounts
3. ✅ Backup important credentials
4. ✅ Use separate email for testing vs production
5. ✅ Comment out `deleteMany()` in any seed scripts

## 🚨 **IF YOU ACCIDENTALLY DELETED YOUR ACCOUNT**

1. **Re-register immediately**:
   ```
   Go to /register
   Use same email and create new password
   ```

2. **Or restore from backup** (if you have one):
   ```bash
   mongorestore --db citiconnect backup/
   ```

3. **Or use default test accounts**:
   ```
   Admin:  admin1@citiconnect.com / admin123
   Driver: driver1@citiconnect.com / driver123
   User:   user1@example.com / user123
   ```

---

## ✅ **SUMMARY**

**Problem:** `seedData.js` was deleting all accounts every time it ran

**Solution:** 
- ✅ Commented out delete lines in `seedData.js`
- ✅ Created safe `addSampleData.js` script
- ✅ Added warnings before any deletion

**Safe Command:** `node addSampleData.js`

**Your accounts are now protected! 🔒**
