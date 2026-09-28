# Applicant Management System - Implementation Plan

## Current State
```
Drive model: registeredStudents = [UserId] (simple)
registerForDrive: pushes userId only
DriveDetails.jsx: "Apply Now" button (no role check)
No approve/reject logic
```

## Plan [1/12]

### ✅ 1. Create TODO_APPLICANTS.md [COMPLETED]

### ✅ 2. Update Drive model [COMPLETED]
```
registeredStudents: [{
  student: { type: ObjectId, ref: 'User' },
  status: { enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: String,
  appliedAt: Date
}]
```
Updated `placement-hub/server/models/Drive.js`

### ✅ 3. Update registerForDrive controller [COMPLETED]
```
✅ drive.registeredStudents.push({ student: userId, status: 'pending', appliedAt: Date.now() })
✅ applicantCount updated
✅ Existing applicant check (subdoc)
```
Updated `driveController.js`

### ✅ 4. Backend APIs [COMPLETED]
```
✅ getDriveApplicants: populate student + transform response
✅ approveApplicant: update status = 'approved'  
✅ rejectApplicant: update status + rejectionReason
```
Updated `driveController.js`

### ✅ 5. Update driveRoutes.js [COMPLETED]
```
✅ GET /drives/:id/applicants
✅ PUT /drives/:id/applicants/:studentId/approve  
✅ PUT /drives/:id/applicants/:studentId/reject
```
Updated `driveRoutes.js`

### ✅ 6. Frontend - Role-based buttons in DriveDetails.jsx [COMPLETED]
```
✅ Student: "Apply Now" button
✅ Admin: "View Applicants ({count})" button → /drives/:id/applicants
```
Updated `DriveDetails.jsx`

### ✅ 7. Create ViewApplicants.jsx [COMPLETED]
```
✅ Applicant table: name/email/skills/CGPA/branch/status
✅ Status badges (pending/yellow, approved/green, rejected/red)
✅ Approve button
✅ Reject + reason input + confirmation
✅ Responsive design + loading states
```
Created `ViewApplicants.jsx`

### ✅ 8. App.jsx routing + api.js methods [COMPLETED]
```
✅ Route: /drives/:id/applicants (AdminRoute)
✅ API: getDriveApplicants, approveApplicant, rejectApplicant
```

### ☐ 9. Test complete flow

### ☐ 3. Update registerForDrive controller
```
drive.registeredStudents.push({
  student: userId,
  status: 'pending',
  appliedAt: Date.now()
});
```

### ☐ 4. Backend APIs
```
GET /drives/:id/applicants (admin)
PUT /drives/:id/applicants/:studentId/approve
PUT /drives/:id/applicants/:studentId/reject
```

### ☐ 5. Frontend
```
DriveDetails.jsx: role-based buttons
ViewApplicants.jsx: admin applicant list + approve/reject
App.jsx: /drives/:id/applicants route (AdminRoute)
```

### ☐ 6. Test flow
```
Student apply → pending status
Admin view applicants → approve/reject buttons
Status updated + reason stored
```

**Next: Update Drive model**
