# 🚀 Quick Start - Secure Role-Based Access Control

## ✅ What Was Fixed

### Security Issues Resolved:
1. ❌ **BEFORE:** Users could select "Admin" role during registration (INSECURE)
2. ✅ **AFTER:** All users register as "student", admins created separately (SECURE)

---

## 📋 Setup Steps

### Step 1: Create First Admin User
```bash
cd server
npm run seed:admin
```

**Output:**
```
✅ Admin user created successfully!
📧 Email: admin@college.com
🔑 Password: Admin@123456
```

### Step 2: Start Application
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Step 3: Test Login

#### As Admin:
```
Email: admin@college.com
Password: Admin@123456
→ See "Add Drive" button in sidebar
→ Can create/edit/delete drives
```

#### As Student:
```
Email: student@test.com (or register new)
Password: Test@123
→ Cannot see "Add Drive" button
→ Can only view and register for drives
```

---

## 🔐 Security Changes Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Registration Form** | Had role selector | Role selector REMOVED |
| **Backend Register** | Accepted role parameter | IGNORES role, always sets "student" |
| **Admin Creation** | Via registration | Via seed script only |
| **Route Protection** | Basic auth only | Auth + Role checks |
| **Frontend Routes** | No role check | AdminRoute component checks role |

---

## 📂 Updated Files

### Backend Files:
- ✅ `server/controllers/authController.js` - Register always creates students
- ✅ `server/middleware/authMiddleware.js` - Added isAdmin middleware
- ✅ `server/package.json` - Added seed:admin script
- ✅ `server/scripts/seedAdmin.js` - New admin creation script

### Frontend Files:
- ✅ `client/src/pages/Register.jsx` - Removed role selector UI
- ✅ `client/src/context/AuthContext.jsx` - Removed role parameter

### Documentation Files:
- ✅ `RBAC_SECURITY.md` - Complete security architecture guide
- ✅ `QUICK_START.md` - This file

---

## 🎯 How It Works

### User Registration (UI):
```
User registers → Always role = 'student' → Can view/register for drives
```

### Admin Creation (Seed Script):
```
npm run seed:admin → Creates role = 'admin' user → Can manage drives
```

### Middleware Protection:
```
Request → protect middleware (JWT check) → authorize middleware (role check) → Execute
```

### Frontend Protection:
```
Access /add-drive → AdminRoute checks user.role → If not 'admin', redirect
```

---

## 🧪 Test Cases

### Test 1: Register as Student ✅
```
1. Go to /register
2. Fill name, email, password
3. Select target role (Software Engineer, etc.)
4. Click "Create Account"
5. Verify: role = 'student' in database
6. Verify: Can access /skill-gap but NOT /add-drive
```

### Test 2: Login as Admin ✅
```
1. Go to /login
2. Email: admin@college.com
3. Password: Admin@123456
4. Verify: Can see "Add Drive" button
5. Verify: Can access /add-drive
6. Verify: Can create/edit/delete drives
```

### Test 3: Student Cannot Access Admin Routes ✅
```
1. Login as student
2. Try to manually go to /add-drive
3. Verify: See "Access Denied" message
4. Verify: Button to go back to dashboard
```

### Test 4: Backend Protection ✅
```
1. As student, try to POST /api/drives
2. Verify: Get 403 Forbidden error
3. Verify: Cannot create drives via API
```

---

## ⚠️ Important Notes

1. **Change Admin Password:**
   - After first login, change admin password immediately
   - Default: Admin@123456 (not for production)

2. **Database:**
   - Check admin was created: `db.users.findOne({ role: 'admin' })`
   - Verify password is hashed (not plain text)

3. **Production:**
   - Use strong admin password
   - Setup proper admin onboarding process
   - Enable audit logging for admin actions

4. **Multiple Admins:**
   - Can add more admins via MongoDB directly
   - Or create endpoint for creating admins (with super-admin verification)

---

## 🔧 Troubleshooting

### Issue: Seed script fails
```bash
# Make sure .env is configured
# Check MONGODB_URI is correct
# Verify Node modules installed
npm install
npm run seed:admin
```

### Issue: Admin cannot login
```bash
# Verify admin user exists
# Check password is correct
# Clear browser cache and try again
```

### Issue: Student can access /add-drive
```bash
# Clear browser cache (localStorage)
# Logout and login again
# Refresh page
```

---

## 📞 Support

For issues or questions:
1. Check `RBAC_SECURITY.md` for architecture details
2. Review backend middleware in `authMiddleware.js`
3. Check frontend AdminRoute in `components/AdminRoute.jsx`
4. Verify backend route protection in `routes/driveRoutes.js`

---

**Status:** ✅ Secure RBAC Implemented
**Date:** May 3, 2026
**Version:** 1.0.0
