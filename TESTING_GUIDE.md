# Testing Guide - Smart Complaint System

## Issue Fixed ✅
- **Problem**: Status update was failing with "TypeError: Cannot read properties of undefined (reading 'status')"
- **Root Cause**: Mock DB wasn't properly parsing complaint IDs as integers and wasn't including images when fetching by ID
- **Solution**: Fixed mock DB query handler to parse ID and include images array

## Features to Test

### Test Setup
**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User Account (Register New):**
- Email: Any email (e.g., `testuser@example.com`)
- Password: Any password (e.g., `test123`)

---

## Test Flow 1: User Complaint Submission & Admin Update

### Step 1: Register as Regular User
1. Go to http://localhost:5173
2. Click "Register"
3. Enter email: `testuser1@example.com`
4. Enter password: `test123`
5. Click "Register"

### Step 2: Submit Complaint as User
1. Click "📝 Submit Complaint"
2. Fill in:
   - **Title**: "Pothole on Main Street"
   - **Category**: "Road Maintenance"
   - **Location**: "Main Street, City Center"
   - **Description**: "Large pothole causing traffic issues"
   - **Attach Image** (optional)
3. Click "Submit Complaint"
4. You should see a success message and complaint appears in "My Complaints"

### Step 3: View Your Complaint Details (as User)
1. Click "📋 My Complaints"
2. You should see your complaint with a "View Details & Timeline →" link
3. Click it to see full complaint details
4. You should see **Status Timeline** section (currently empty since no admin updates yet)

### Step 4: Admin Updates Status
1. Logout (button in top-right)
2. Login as admin: `admin@example.com` / `admin123`
3. You'll see "📊 Admin Dashboard"
4. Find the complaint you just created
5. In the **UPDATE STATUS** section:
   - Change status to "In Progress"
   - Add remark: "Started investigating this issue"
   - Click "Update"
6. You should see "Status updated successfully"

### Step 5: View Updated Timeline (as User)
1. Logout
2. Login as the regular user: `testuser1@example.com` / `test123`
3. Click "📋 My Complaints"
4. Click "View Details & Timeline →"
5. **Expected Result**: Status timeline should show:
   - ✅ Step with "Pending → In Progress" transition
   - ✅ Admin email who made the change
   - ✅ The remark: "Started investigating this issue"
   - ✅ Timestamp of when it was updated

---

## Test Flow 2: Multiple Status Updates & Full Timeline

### Step 1: Create Multiple Updates (as Admin)
1. Login as admin
2. Go to dashboard
3. Find a complaint and update status 3 times with different remarks:
   - Update 1: Change to "In Progress" - Remark: "Team assigned"
   - Update 2: Change to "Resolved" - Remark: "Pothole filled, road repaired"
   - (Optional) Change back to "In Progress" - Remark: "Additional work needed"

### Step 2: View Complete Timeline (as User)
1. Logout and login as the original user
2. Go to complaint details
3. **Expected Result**: Status timeline should show all updates in chronological order:
   - Initial → "In Progress" (Team assigned)
   - "In Progress" → "Resolved" (Pothole filled...)
   - "Resolved" → "In Progress" (Additional work needed) [if done]

---

## Test Flow 3: Admin Can View Full Timeline

### Step 1: View Timeline from Admin Dashboard
1. Login as admin
2. Go to "📊 Admin Dashboard"
3. Find any complaint
4. Click the new "📋 View Full Timeline →" link
5. **Expected Result**: Same timeline view should appear (admin sees same details as user)

---

## Test Flow 4: User Isolation (Security Test)

### Step 1: Verify Users Only See Own Complaints
1. Register and create complaints as User A: `usera@example.com`
2. Create 2 complaints as User A
3. Create different complaint as User B: `userb@example.com`
4. Login as User A
5. Go to "My Complaints"
6. **Expected Result**: User A should ONLY see their 2 complaints, NOT User B's

### Step 2: Verify Users Can't Access Others' Detail Pages
1. While logged in as User A
2. Try to visit: `http://localhost:5173/complaint/999` (or another user's complaint ID)
3. **Expected Result**: Should show error or return no data

---

## Test Flow 5: Image Viewing in Timeline

### Step 1: Submit Complaint with Images
1. Login as regular user
2. Submit complaint with multiple images attached
3. Logout, login as admin
4. Update the complaint status
5. Logout, login as original user

### Step 2: View Images in Timeline
1. Go to complaint details
2. Scroll to see complaint info section with images
3. Click on image thumbnails
4. **Expected Result**: Image modal should appear showing full-size image

---

## API Endpoints Reference

### User Endpoints
```
GET /api/complaints/my
  - Returns user's own complaints
  - Auth: Required (extracts user_id from JWT)
  - Example: Fetch all complaints for logged-in user

GET /api/complaints/:id
  - Returns specific complaint details
  - Auth: Required

GET /api/complaints/:id/history
  - Returns status history/timeline for complaint
  - Auth: Required
  - Response: Array of history records with old_status, new_status, admin_email, remark, timestamp
```

### Admin Endpoints
```
GET /api/complaints
  - Returns ALL complaints (admin view)
  - Auth: Required, Role must be admin

PUT /api/complaints/:id/status
  - Updates complaint status (admin only)
  - Auth: Required, Role must be admin
  - Request body: { status: "...", remark: "..." }
  - Side effect: Automatically creates history record
```

---

## Expected API Response Examples

### Status History Response
```json
{
  "history": [
    {
      "id": 1,
      "complaint_id": 5,
      "old_status": "Pending",
      "new_status": "In Progress",
      "admin_id": 1,
      "admin_email": "admin@example.com",
      "remark": "Started investigating",
      "created_at": "2026-01-31T10:30:00Z"
    },
    {
      "id": 2,
      "complaint_id": 5,
      "old_status": "In Progress",
      "new_status": "Resolved",
      "admin_id": 1,
      "admin_email": "admin@example.com",
      "remark": "Issue resolved",
      "created_at": "2026-01-31T14:45:00Z"
    }
  ]
}
```

---

## Troubleshooting

### Issue: "Failed to update status"
- Check browser console for error details
- Verify you're logged in as admin
- Verify backend is running (`npm run dev` in backend folder)

### Issue: Timeline not showing updates
- Refresh the page (clear any cached data)
- Verify admin made at least one status update
- Check backend logs for `[UPDATE STATUS]` messages

### Issue: Can see other users' complaints
- This shouldn't happen - user_id filtering is enforced at database level
- Check that you're on `/my` endpoint (not `/` endpoint)

### Issue: Status update succeeds but timeline still empty
- Wait a moment for the mock DB to process
- Refresh the complaint details page
- Check backend terminal for any error logs

---

## Success Criteria Checklist

- [ ] User can submit complaints
- [ ] User sees only own complaints in "My Complaints"
- [ ] Admin can update complaint status
- [ ] Admin remark is saved
- [ ] Status update creates history record
- [ ] User can view full timeline on complaint details
- [ ] Timeline shows all status updates in order
- [ ] Each timeline entry shows: old→new status, admin email, remark, timestamp
- [ ] Users cannot access other users' complaint details
- [ ] Admin can view full timeline from dashboard
- [ ] Images display correctly in modals

---

## System Architecture Reminder

```
Frontend (http://localhost:5173)
    ↓ (REST API calls)
Backend (http://localhost:4000)
    ↓ (SQL queries)
Mock DB (in-memory)
    ├── users table
    ├── complaints table
    ├── complaint_images table
    └── status_history table (append-only)
```

**User Journey:**
1. User logs in → JWT token stored in localStorage
2. User submits complaint → Token sent in Authorization header
3. Backend extracts user_id from token → Queries/inserts with user_id
4. Admin updates status → Creates history record atomically
5. User views timeline → Fetches history records → Displays chronologically
