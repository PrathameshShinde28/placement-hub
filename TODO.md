# Project TODO - Student Application Tracking & Notification System

## Backend
- [x] Update `server/models/Application.js` schema (statusHistory, notes, interviewDate, updatedBy, backward compatible fields)

- [x] Add `server/models/Notification.js`

- [x] Add `server/controllers/notificationController.js`

- [x] Add `server/routes/notificationRoutes.js`

- [x] Expand `server/controllers/applicationController.js` with required APIs (apply, get mine, officer get by drive, status update, bulk update)


- [x] Ensure status mapping from Drive workflow and create notifications on officer updates

- [x] Add `server/routes/applicationRoutes.js`


- [x] Mount `/api/applications` and `/api/notifications` in `server/server.js`


## Frontend
- [x] Add `client/src/pages/MyApplications.jsx`

- [x] Add `client/src/pages/Notifications.jsx`

- [x] Add `client/src/components/NotificationBell.jsx`

- [x] Update `client/src/components/Navbar.jsx` to include notification bell

- [x] Update `client/src/App.jsx` routes for MyApplications + Notifications

- [x] Update `client/src/services/api.js` with applications/notifications API calls

- [ ] Update `client/src/pages/DriveDetails.jsx` Apply flow to sync Application tracking (keep existing drive registration untouched)
- [ ] Enhance `client/src/pages/ViewApplicants.jsx` to add notes + interview date + status mapping + Application + Notification sync (keep existing workflow)

## Reporting integration (minimal)
- [ ] Update analytics/report endpoints if needed to include application status analytics

## Validation
- [ ] Run backend dev server
- [ ] Run frontend dev server
- [ ] Fix any compile/runtime errors
- [ ] Smoke test: apply -> track -> officer updates -> notifications bell updates

