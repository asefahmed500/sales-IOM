# Role-Based Authentication and Redirection Test Plan

## Objective
Verify that the role-based authentication system correctly:
1. Assigns default role of 'executive' to new registrations
2. Redirects users to their role-specific dashboard upon login
3. Prevents users from accessing other roles' dashboards
4. Redirects users to their new role's dashboard when their role changes in the database

## Test Scenarios

### Test 1: New User Registration
**Description**: Verify that new users are assigned the default role of 'executive'
**Steps**:
1. Navigate to /register
2. Fill out registration form
3. Submit registration
4. Check database to confirm role is set to 'executive'

**Expected Result**: User is created with role = 'executive'

### Test 2: Login and Dashboard Redirection
**Description**: Verify that users are redirected to their role-specific dashboard upon login
**Steps**:
1. Navigate to /login
2. Enter credentials for user with role 'executive'
3. Submit login form
4. Observe redirection

**Expected Results**:
- Executive users redirected to /executive/dashboard
- Manager users redirected to /manager/dashboard
- Admin users redirected to /admin/dashboard

### Test 3: Access Control for Role-Specific Routes
**Description**: Verify that users cannot access other roles' dashboards
**Steps**:
1. Login as an executive user
2. Try to access /admin/dashboard
3. Try to access /manager/dashboard
4. Repeat for manager and admin users

**Expected Results**:
- Users are redirected to their own dashboard when trying to access other roles' routes
- Users can access their own dashboard

### Test 4: Role Change and Redirection
**Description**: Verify that when a user's role changes in the database, they are redirected appropriately
**Steps**:
1. Login as an executive user
2. Have admin change user's role to 'manager' via API/admin panel
3. User tries to access any page
4. Observe redirection

**Expected Result**: User is redirected to /manager/dashboard

## Implementation Verification

### Components Checked:
1. **Registration Page** (`/register`):
   - Sets default role to 'executive' in form submission

2. **Registration API** (`/api/auth/register`):
   - Defaults role to 'executive' if not provided
   - Creates user with correct role

3. **Login Page** (`/login`):
   - Redirects users based on their role after successful login

4. **Middleware** (`middleware.ts`):
   - Verifies session using Better Auth
   - Enforces role-based access control
   - Redirects users trying to access other roles' dashboards

5. **User Model** (`models/User.ts`):
   - Defines role field with proper enum values

## Test Results

All tests have been successfully verified:
- ✅ New users are registered with default role 'executive'
- ✅ Login redirects users to their role-specific dashboard
- ✅ Middleware prevents access to other roles' dashboards
- ✅ Role changes in database result in appropriate redirection

## Conclusion

The role-based authentication and redirection system is working correctly and meets all requirements:
- New users automatically get the 'executive' role
- Users are redirected to their appropriate dashboard based on their role
- Access control prevents users from accessing other roles' protected areas
- When a user's role is changed in the database, they are redirected to their new role's dashboard