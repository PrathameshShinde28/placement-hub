# 🚀 Placement Management System - Setup & Testing Guide

## Quick Start Guide

### Step 1: Backend Server Setup

```bash
# Navigate to server directory
cd server

# Start the backend server
npm run dev
# Server runs on http://localhost:5001
```

**Verify Backend is Running:**
- Visit http://localhost:5001/api/health
- Should return: `{ "message": "Server is running" }`

### Step 2: Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173 (or shown in terminal)
```

### Step 3: Login to System

1. Open http://localhost:5173
2. **For Testing Admin/Placement Officer:**
   - Email: `admin@test.com`
   - Password: `password123`
   
   OR register a new account and manually set role in MongoDB to `admin` or `placementOfficer`

3. **For Testing Student:**
   - Email: `student@test.com`
   - Password: `password123`

---

## 🧪 Testing the System

### Test 1: Create a Placement Record

1. **Login as Admin** (admin@test.com)
2. Navigate to **Placement Management → Placement Records**
3. Click **"Add Placement Record"**
4. Fill in the form:
   - **Student Name:** John Doe
   - **Email:** john@example.com
   - **Department:** CSE
   - **Passing Year:** 2024
   - **Company Name:** Google
   - **Company Type:** MNC
   - **Job Role:** Software Engineer
   - **Package (LPA):** 25
   - **Placement Type:** Full-Time
   - **Date:** Select today's date
   - **Location:** Bangalore
   - **Work Mode:** Hybrid
   - **Status:** Selected
5. Click **"Create Record"**
6. ✅ Record should appear in the table

### Test 2: View Placement Dashboard

1. Click on **"Placement Dashboard"** in sidebar
2. Verify you see:
   - Total Students count
   - Total Placed count
   - Placement percentage
   - Highest, Average, Lowest package
   - Number of companies
   - Active drives count

### Test 3: Add a Company

1. Go to **Placement Management → Company Management**
2. Click **"Add Company"**
3. Fill in:
   - **Company Name:** Microsoft
   - **Type:** Product
   - **Website:** microsoft.com
   - **Industry:** Technology
   - **Location:** Hyderabad
   - **CTC:** 30
   - **Job Profiles:** Full Stack Developer, Cloud Engineer
   - **Required Skills:** Java, Azure, Docker
4. Click **"Create Company"**
5. ✅ Company appears in the list

### Test 4: View Analytics

1. Navigate to **Placement Management → Analytics**
2. Verify you can see:
   - Company-wise placement charts
   - Department-wise distribution
   - Year-wise trends
   - Placement status breakdown
3. Scroll down to see monthly statistics table

### Test 5: Generate Reports

1. Go to **Placement Management → Reports**
2. **Test Company-wise Report:**
   - Select "Company-wise Report"
   - Enter company name: "Google"
   - Click "Generate Report"
   - View generated report
   - Click "Download PDF" or "Print"

3. **Test Department-wise Report:**
   - Select "Department-wise Report"
   - Choose Department: "CSE"
   - Click "Generate Report"

4. **Test Year-wise Report:**
   - Select "Year-wise Report"
   - Year will auto-fill with current year
   - Click "Generate Report"

5. **Test Salary Stats:**
   - Select "Salary Statistics"
   - Click "Generate Report"
   - View salary analysis

### Test 6: Search & Filter

1. Go to **Placement Records**
2. Test search:
   - Type "Google" in search box
   - Records should filter to show Google placements only
3. Test filter by department:
   - Select "CSE" from department dropdown
   - Only CSE department records show
4. Test filter by status:
   - Select "Selected" from status dropdown
   - Only selected students show

### Test 7: Edit & Delete

1. In **Placement Records**, click ✏️ icon on a record
2. Change some fields (e.g., Package to 26)
3. Click "Update Record"
4. ✅ Record updates in table
5. Click 🗑️ icon to delete
6. Confirm deletion
7. ✅ Record disappears

### Test 8: Role-Based Access

**Test Admin Access:**
- Login as admin
- Should see all placement features
- Can create, edit, delete records

**Test Student Access:**
- Login as student
- Navigate to /placement-records
- Should see redirect to student dashboard
- Students cannot access placement features

**Test PlacementOfficer Access:**
- Create user with role = "placementOfficer" in MongoDB
- Login with that user
- Should see all placement features
- Same as admin access

---

## 📊 Sample Data Creation

To quickly populate the system with sample data:

### Using MongoDB Compass or CLI:

```javascript
// Insert sample placements
db.placements.insertMany([
  {
    studentName: "Raj Kumar",
    studentEmail: "raj@example.com",
    department: "CSE",
    passingYear: 2024,
    companyName: "Google",
    companyType: "MNC",
    jobRole: "Software Engineer",
    package: 25,
    placementType: "Full-Time",
    placementDate: new Date(),
    jobLocation: "Bangalore",
    workMode: "Hybrid",
    placementStatus: "Selected",
    createdAt: new Date()
  },
  {
    studentName: "Priya Singh",
    studentEmail: "priya@example.com",
    department: "ECE",
    passingYear: 2024,
    companyName: "Microsoft",
    companyType: "Product",
    jobRole: "Cloud Engineer",
    package: 22,
    placementType: "Full-Time",
    placementDate: new Date(),
    jobLocation: "Hyderabad",
    workMode: "Hybrid",
    placementStatus: "Offer Accepted",
    createdAt: new Date()
  }
])

// Insert sample companies
db.companies.insertMany([
  {
    name: "Google",
    type: "MNC",
    website: "google.com",
    industry: "Technology",
    location: "Bangalore",
    ctc: 25,
    jobProfiles: ["Software Engineer", "Product Manager"],
    requiredSkills: ["Java", "Python", "System Design"],
    createdAt: new Date()
  },
  {
    name: "Microsoft",
    type: "Product",
    website: "microsoft.com",
    industry: "Technology",
    location: "Hyderabad",
    ctc: 22,
    jobProfiles: ["Cloud Engineer", "Data Engineer"],
    requiredSkills: ["Azure", "Java", "Python"],
    createdAt: new Date()
  }
])
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend server running on :5001
- [ ] Frontend accessible on :5173
- [ ] Can login with admin account
- [ ] Can view Placement Dashboard
- [ ] Can create placement record
- [ ] Can create company
- [ ] Can view analytics
- [ ] Can generate reports
- [ ] Search and filters work
- [ ] Can edit records
- [ ] Can delete records
- [ ] Student cannot access placement features
- [ ] API endpoints respond correctly

---

## 🔗 API Testing with cURL

### Create Placement Record

```bash
curl -X POST http://localhost:5001/api/placements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "studentName": "Test User",
    "studentEmail": "test@example.com",
    "department": "CSE",
    "passingYear": 2024,
    "companyName": "Amazon",
    "companyType": "MNC",
    "jobRole": "SDE",
    "package": 20,
    "placementType": "Full-Time",
    "placementDate": "2024-05-16",
    "jobLocation": "Delhi",
    "workMode": "OnSite",
    "placementStatus": "Selected"
  }'
```

### Get All Placements

```bash
curl -X GET http://localhost:5001/api/placements \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Analytics

```bash
curl -X GET http://localhost:5001/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Generate Report

```bash
curl -X POST http://localhost:5001/api/reports/company-wise \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "company": "Google"
  }'
```

---

## 📱 Browser Console Testing

Open browser DevTools (F12) → Console and test:

```javascript
// Check API base URL
console.log(import.meta.env.VITE_API_URL)

// Check JWT token
console.log(localStorage.getItem('token'))

// Check current user
console.log(localStorage.getItem('user'))
```

---

## 🐛 Common Issues & Solutions

### Issue: API endpoints returning 404

**Solution:**
- Verify backend server is running on :5001
- Check if routes are imported in server.js
- Verify MongoDB connection

### Issue: Unauthorized (401) errors

**Solution:**
- Login again to get fresh JWT token
- Clear localStorage and login
- Check token expiration

### Issue: CORS errors

**Solution:**
- Backend already has CORS configured
- Try clearing browser cache
- Restart both frontend and backend

### Issue: Data not appearing in tables

**Solution:**
- Refresh page (F5)
- Check MongoDB for data
- Verify user role has access

### Issue: Chart not loading

**Solution:**
- Charts are built-in (no recharts needed)
- Try installing recharts: `npm install recharts`
- Check browser console for errors

---

## 🎓 Next Steps

1. **Test all features** using the checklist above
2. **Add sample data** for realistic testing
3. **Customize styling** if needed
4. **Add more features** (see Advanced Features section)
5. **Deploy** to production

---

## 📞 Quick Reference

| Feature | URL | Role Required |
|---------|-----|----------------|
| Placement Dashboard | `/placement-dashboard` | Admin/PlacementOfficer |
| Placement Records | `/placement-records` | Admin/PlacementOfficer |
| Company Management | `/company-management` | Admin/PlacementOfficer |
| Analytics | `/placement-analytics` | Admin/PlacementOfficer |
| Reports | `/report-generator` | Admin/PlacementOfficer |

---

**Happy Testing! 🎉**
