# Role-Based Access Control (RBAC) Implementation

## 🔐 Security Architecture

### Overview
This document outlines the secure role-based access control implementation in the Placement Hub MERN application.

---

## 1️⃣ FRONTEND - REGISTRATION (Secure)

### Location: `client/src/pages/Register.jsx`

**Key Changes:**
- ✅ Role selection REMOVED from UI
- ✅ All users registering via UI are assigned role = "student"
- ✅ Admin role cannot be selected in frontend

**User Registration Flow:**
```
User fills form:
  ↓
  Name, Email, Password, Target Role (career role)
  ↓
  Submit → No role selection
  ↓
  Backend ALWAYS sets role = "student"
```

---

## 2️⃣ BACKEND - REGISTRATION (Secure)

### Location: `server/controllers/authController.js`

**Key Changes:**
- ✅ Ignores any `role` parameter sent from frontend
- ✅ Always sets `role: "student"` for UI registration
- ✅ Comments explain security reasoning

**Code:**
```javascript
// Register User (Frontend registration - always creates students)
export const register = async (req, res) => {
  // ... validation ...
  
  // Create user - ALWAYS set role as "student" from UI registration
  // Admins are created via separate admin creation endpoint or seed script only
  const user = await User.create({
    name,
    email,
    password,
    targetRole: targetRole || 'Software Engineer',
    role: 'student', // ✅ Always student for UI registration
  });
};
```

---

## 3️⃣ ADMIN CREATION (Separate Process)

### Method: Seed Script

#### Location: `server/scripts/seedAdmin.js`

**How to Create First Admin:**
```bash
cd server
npm run seed:admin
```

**Output:**
```
✅ Admin user created successfully!
📧 Email: admin@college.com
🔑 Password: Admin@123456

⚠️  IMPORTANT: Change this password after first login!
```

**Default Admin Credentials:**
- Email: `admin@college.com`
- Password: `Admin@123456`
- Role: `admin`

**Security Notes:**
- Only run seed script once
- Change password after first admin login
- Keep credentials secure
- Do not commit passwords to git

---

## 4️⃣ AUTHENTICATION MIDDLEWARE

### Location: `server/middleware/authMiddleware.js`

#### A. `protect` Middleware - JWT Verification
```javascript
export const protect = async (req, res, next) => {
  // 1. Extract JWT token from Authorization header
  // 2. Verify token signature with JWT_SECRET
  // 3. Get user from database
  // 4. Set req.userId, req.userRole, req.user
  // 5. Call next()
}
```

**Usage:**
```javascript
router.get('/protected-route', protect, controllerFunction);
```

#### B. `authorize` Middleware - Role Checking
```javascript
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}
```

**Usage:**
```javascript
// Allow only admins
router.post('/admin-action', protect, authorize('admin'), adminFunction);

// Allow multiple roles
router.get('/report', protect, authorize('admin', 'mentor'), reportFunction);
```

#### C. `isAdmin` Middleware - Shorthand for Admin Check
```javascript
export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied. This action requires admin privileges.' 
    });
  }
  next();
}
```

**Usage:**
```javascript
router.delete('/drive/:id', protect, isAdmin, deleteDrive);
```

---

## 5️⃣ PROTECTED ADMIN ROUTES

### Location: `server/routes/driveRoutes.js`

**Pattern:**
```javascript
import { protect, authorize } from '../middleware/authMiddleware.js';

// Public routes (no auth needed)
router.get('/', getAllDrives);

// Student routes (auth required)
router.get('/:id', protect, getDriveById);
router.post('/:id/register', protect, registerForDrive);

// Admin routes (auth + admin role required)
router.post('/', protect, authorize('admin'), createDrive);
router.put('/:id', protect, authorize('admin'), updateDrive);
router.delete('/:id', protect, authorize('admin'), deleteDrive);
```

**Flow for Admin Routes:**
```
Request → Check JWT token (protect) → Check admin role (authorize) → Execute action
```

---

## 6️⃣ FRONTEND ROUTE PROTECTION

### Location: `client/src/components/AdminRoute.jsx`

**What It Does:**
1. Checks if user is authenticated
2. Checks if user.role === 'admin'
3. Redirects non-admins to dashboard
4. Shows access denied message

**Usage in App.jsx:**
```javascript
<Route
  path="/add-drive"
  element={
    <AdminRoute>
      <AddDrive />
    </AdminRoute>
  }
/>
```

**User Experience:**
```
Non-Admin tries to access /add-drive
  ↓
AdminRoute checks user.role
  ↓
role !== 'admin'
  ↓
Shows "Access Denied" message
  ↓
Provides "Back to Dashboard" button
```

---

## 7️⃣ LOGIN RESPONSE

### Location: `server/controllers/authController.js`

**Response Structure:**
```javascript
{
  success: true,
  message: 'User logged in successfully',
  token: 'eyJhbGc...',
  user: {
    id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student', // or 'admin'
    targetRole: 'Software Engineer',
    skills: ['React', 'Node.js']
  }
}
```

**Important:**
- Role is always returned from backend
- Frontend AuthContext stores user.role
- Components check user.role for access control

---

## 8️⃣ SECURITY CHECKLIST

### ✅ Frontend Security
- [x] Role selection REMOVED from registration UI
- [x] All UI registrations always create students
- [x] Admin routes use AdminRoute component
- [x] Non-admin users redirected from admin pages
- [x] Role only read from login response, never modified client-side

### ✅ Backend Security
- [x] Registration endpoint IGNORES role parameter
- [x] Always sets role = 'student' for UI registration
- [x] Admin routes protected with auth + role middleware
- [x] Role fetched from database on each request (not from JWT)
- [x] Proper error responses for unauthorized access

### ✅ Admin Creation
- [x] Admins created via seed script, not UI
- [x] Separate process from user registration
- [x] Secure password generation required
- [x] Documentation provided for admin creation

---

## 9️⃣ API ENDPOINTS PROTECTION

### Public Endpoints (No Auth)
```
GET  /api/drives                    - List all drives
```

### Protected Student Endpoints (Auth Required)
```
GET  /api/drives/:id                - View drive details
POST /api/drives/:id/register       - Register for drive
GET  /api/drives/user/registered    - View my drives
```

### Admin-Only Endpoints (Auth + Admin Role)
```
POST   /api/drives                  - Create drive
PUT    /api/drives/:id              - Update drive
DELETE /api/drives/:id              - Delete drive
GET    /api/drives/:id/applicants   - View applicants
```

---

## 🔟 ERROR RESPONSES

### Unauthorized (No Token)
```json
{
  "message": "Not authorized to access this route"
}
```
**Status:** 401

### Forbidden (Token Valid, Wrong Role)
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```
**Status:** 403

---

## 1️⃣1️⃣ BEST PRACTICES IMPLEMENTED

1. **Never Trust Frontend for Security Decisions**
   - Role always verified on backend
   - Frontend role just for UX

2. **Defense in Depth**
   - Multiple checks: JWT, Role, Database

3. **Clear Separation of Concerns**
   - Registration: Always students
   - Admin creation: Separate process
   - Role verification: Middleware

4. **Fail Secure**
   - If role missing: Defaults to student
   - If token invalid: Deny access
   - If unauthorized: Return 403

5. **Clear Error Messages**
   - Distinguish 401 (auth) vs 403 (authorization)
   - Help developers debug issues

6. **Consistent Patterns**
   - All admin routes: `protect` + `authorize('admin')`
   - All protected routes: `protect`
   - All public routes: no middleware

---

## 1️⃣2️⃣ TESTING ADMIN WORKFLOW

### Step 1: Create Admin
```bash
cd server
npm run seed:admin
```

### Step 2: Login as Admin
```
Email: admin@college.com
Password: Admin@123456
```

### Step 3: Access Admin Panel
```
Go to /add-drive
```

### Step 4: Create Placement Drive
```
Fill form → Submit → Stored in database
```

### Step 5: Test Student Cannot Access
```
Login as student
Try to access /add-drive
→ Should see "Access Denied"
```

---

## 1️⃣3️⃣ FUTURE ENHANCEMENTS

- [ ] Password reset functionality
- [ ] Admin email verification
- [ ] Two-factor authentication for admins
- [ ] Admin activity logging
- [ ] Role-based API documentation
- [ ] Rate limiting for sensitive endpoints

---

**Last Updated:** May 3, 2026
**Version:** 1.0.0 - Secure RBAC Implementation
