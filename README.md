# Class-Roomed — Automated Classroom Assignment & Facility Reservation System

Class-Roomed is a generic browser-based prototype for academic institutions. It demonstrates a centralized way to register classrooms and facilities, review availability, submit reservations for automatic room assignment, send weekly assignment notifications for one month, flag scheduling conflicts, record temporary occupancy confirmation, and review utilization reports. The login page uses the graduation photograph supplied with this project.

## Project files
- `index.html` — login, dashboard, weekly room calendar, reservations, classroom/facility inventory, automated assignment notifications, reports, and modals.
- `style.css` — responsive layout, navigation, calendar, status labels, dashboard, forms, and photo-backed login panel.
- `script.js` — demo role permissions, browser persistence, capacity/equipment/time conflict checks, automatic room assignment, four-week weekly notification schedule, manual faculty cancellation, temporary occupancy confirmation, automatic release of unconfirmed bookings, and CSV reporting.
- `database.sql` — MySQL schema for roles, buildings, rooms, equipment, reservations, notification schedules, maintenance logs, and audit logs.
- `graduation-background.png` — the user-provided login background image.

## Run the prototype
1. Extract `ClassRoomed_Project.zip`.
2. Open `index.html` in a modern browser. A local web server can also be used.
3. Sign in with a demo account (username / password): `admin` / `admin123`, `maintenance` / `maint123`, `msantos` / `faculty123`, `student` / `student123`. Passwords are stored as plain text in the browser for this prototype only; a real system needs hashed passwords and server-side authentication.
4. Roles:
   - **Administrator** — create and deactivate faculty and student accounts, approve/reject reservation requests, add/edit classroom details, and export reports.
   - **Maintenance** — same staff level as Administrator, but for facilities only: closes and reopens rooms for maintenance and has no Accounts page. Closing a room cancels its upcoming reservations and notifies the requesters.
   - **Faculty / Professor** — reserve rooms (including weekly repeats), cancel their own upcoming requests, and receive notifications when a request is rejected or cancelled by staff.
   - **Student (View Only)** — view the dashboard, calendar, room schedules, and reservations.
5. The prototype saves demo data in the current browser using `localStorage`. Data does not automatically synchronize between different users or devices.

## Features mapped to the study objectives
- **Scheduling requirements and constraints:** room capacity, room type, required equipment, and maintenance status are checked before submission or approval.
- **Conflict detection:** overlapping reservations for the same room, capacity mismatches, incompatible equipment, and maintenance conflicts are flagged.
- **Role-based interface:** administrator, faculty/professor, and student (view-only) experiences have different actions available.
- **Reservation management:** faculty can reserve a room directly when it passes validation; faculty manually cancel their own upcoming reservations, while administrators manage classroom records.
- **Availability calendar:** weekly calendar with filters and Available, Occupied, Reserved, and Maintenance statuses.
- **Temporary occupancy confirmation:** a faculty member or administrator may confirm occupancy during the first 20 minutes of an approved reservation. An unconfirmed approved reservation is marked Cancelled after that grace period; this is based only on missing confirmation, not physical sensing.
- **Utilization reports:** summary measures, reservation status distribution, room booking counts, and CSV export for administrators.
- **Database design:** the provided MySQL schema models users, roles, buildings, rooms, equipment, reservations, weekly notification schedules, maintenance, occupancy confirmation, and audit logging.

## Suggested functional and integration test checklist
1. Sign in as each role and verify the correct actions appear.
2. As a Student, confirm that availability and reservation information can be viewed but reservation and editing actions are unavailable.
3. As Faculty / Professor, submit a reservation that fits room capacity/equipment and does not overlap another active request; verify it appears as **Pending Approval**, and that approving it as Administrator creates the four-week weekly notification schedule.
4. Try the same room and overlapping time; verify the system flags the conflict and prevents the duplicate request.
5. Request more attendees than room capacity, incompatible equipment, or a room marked Maintenance; verify validation blocks submission.
6. Verify that conflicting requests are blocked with an explanatory message, and that valid ones wait in the Reservations page for administrator approval.
7. Verify approved reservations appear in the calendar, and room statuses distinguish Available, Reserved, Occupied (when confirmed during the scheduled time), and Maintenance.
8. For a reservation occurring now, confirm occupancy within 20 minutes of its start and verify the temporary confirmation is displayed.
9. Verify the automatic release rule for an approved but unconfirmed reservation by setting a demo reservation start time more than 20 minutes in the past.
10. Add/edit a classroom as Administrator and verify the inventory and reservation room list update.
11. Export a CSV report as Administrator and check that reservation, room, schedule, status, and conflict fields are included.
12. When the MySQL backend is implemented, test API/database integration, authentication and server-side role checks, simultaneous booking attempts, transaction-based conflict protection, audit records, and report queries.

## Important implementation note
This deliverable is a **front-end prototype**. The browser files currently use `localStorage`; they are not connected to MySQL and are not a secure multi-user service. UI role restrictions are for demonstration and must not be treated as production authorization. To deploy the system, implement a server-side API, secure authentication and authorization, database transactions or equivalent locking for concurrent reservations, occupancy-confirmation records, automatic-release jobs, and audit logging. The SQL file is a starting point for that implementation.

The classroom/building names, reservations, and reports shown in the prototype are generic illustrative sample data, not official records for any specific institution.

## Workflow notes (current)
- Faculty submit requests from the Reservations page or a room schedule. Requests are checked for time overlap, capacity, equipment, maintenance, and past dates, then wait as **Pending Approval**.
- **One Reservations page** replaces the separate approvals page: pending requests (Approve / Reject for administrators, Cancel for the requesting faculty), approved assignments, and cancellations share one table and one status filter.
- **Repeat weekly:** choose days of the week and a "Repeat until" date (up to 18 weeks). Each date becomes its own reservation sharing a series; a pending series is approved or rejected together, while individual sessions can be cancelled, or the whole remaining series.
- **Room schedule:** clicking a room card, a room name in the calendar, or a booking in the calendar opens a side panel with that day's bookings and free times. The reservation form shows the same panel beside it; tap a free time to fill the start and end.
- On approval the prototype stores four weekly notification entries over the following month (browser data only; real delivery needs a backend scheduler).
- **Accounts:** no self-signup. Only Administrators create Faculty and Student accounts (one at a time or in bulk) and can deactivate or reactivate them (not deleted). The Administrator and Maintenance demo accounts are seeded, not created in the app.
- **Notifications:** a faculty member sees a dashboard notification (and a count badge on the Dashboard menu item) when an administrator approves, rejects, or cancels their request, when a room is closed for maintenance, or when an unconfirmed booking is automatically released. Each notification can be dismissed.
- **Bulk accounts:** on the Accounts page, **Add many** accepts pasted lines or a CSV (full name, username, role, password). Only the full name is required; usernames and temporary passwords are generated when blank. Invalid lines are flagged and skipped, and the login details of everything created can be downloaded once as a CSV.
- **Room status:** the Maintenance role is the only one that sets a room to Maintenance; the room form no longer has a status field.

## Alignment with the paper's functional requirements (section 3.3.3)
- **Availability search** (Classrooms & Facilities): filter by date, start/end time, minimum capacity, and equipment; matching rooms show their status for that slot and prefill the reservation form.
- **Editing:** administrators can edit any upcoming pending or approved reservation; faculty can edit their own (an edited approved booking returns to Pending Approval). A session of a weekly series is edited individually.
- **Fixed schedules:** an administrator can mark a reservation as a fixed schedule (e.g., an examination). It is approved immediately, exempt from auto-release, and cannot be cancelled or edited by faculty.
- **Usage confirmation:** the requesting faculty member or an administrator uses **Confirm usage** in the first 20 minutes (`CONFIRM_GRACE_MINUTES` in `script.js`). Unconfirmed approved bookings become **Unconfirmed** and the room is released.
- **Housekeeping (administrators):** Delete beside Edit on each room card (upcoming reservations are cancelled and requesters notified; past records keep showing "Room removed"), Delete beside Deactivate on each faculty/student account (their upcoming reservations are cancelled), and a Name A–Z / Z–A sort on Classrooms & Facilities.
