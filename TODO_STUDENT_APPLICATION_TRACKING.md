# TODO: Student Application Tracking & Notification System

## Backend
- [ ] Update `server/models/Application.js` to include full status flow, statusHistory, interviewDate, notes, updatedBy, and backward-compatible fields.
- [ ] Create `server/models/Notification.js`.
- [ ] Add `server/controllers/notificationController.js`.
- [ ] Add `server/routes/notificationRoutes.js`.
- [ ] Update `server/controllers/applicationController.js` with required APIs + officer update logic + notification creation.
- [ ] Add `server/routes/applicationRoutes.js`.
- [ ] Mount new routes in `server/server.js`.

## Frontend
- [ ] Add `MyApplications.jsx` page.
- [ ] Add `Notifications.jsx` page.
- [ ] Add `NotificationBell.jsx` component.
- [ ] Update `Navbar.jsx` to show notification bell + unread count.
- [ ] Update `App.jsx` routes.
- [ ] Update `services/api.js` with applications + notifications API calls.
- [ ] Update `DriveDetails.jsx` to sync Application tracking on Apply (keep existing drive registration).
- [ ] Enhance `ViewApplicants.jsx` to update Application status + create notifications (keep existing workflow).

## Reporting integration (minimal)
- [ ] Extend existing reporting/analytics endpoints or report generator to include applications status distribution.

## Validation
- [ ] Run backend dev server: `cd server && npm run dev`.
- [ ] Run frontend dev server: `cd client && npm run dev`.
- [ ] Fix compile/runtime errors.
- [ ] Verify: apply flow, officer status updates, notification dropdown polling, mark-as-read.

