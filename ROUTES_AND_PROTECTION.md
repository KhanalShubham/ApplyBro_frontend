# 🚦 ApplyBro Frontend Routes & Protection

## Overview
Complete routing documentation for ApplyBro frontend application, including route classifications, protection mechanisms, and user experience flows.

---

## 📋 Route Classification

### 1️⃣ PUBLIC ROUTES
Accessible to everyone, no authentication required.

| Route | Component | Description | Auth Required | Redirect if Logged In |
|-------|-----------|-------------|---------------|----------------------|
| `/` | `LandingPage` | Homepage | No | No |
| `/login` | `LoginPage` | User login | No | Yes → `/dashboard` |
| `/signup` | `SignupPage` | User registration | No | Yes → `/dashboard` |
| `/signup/success` | `SuccessScreen` | Registration success | No | No |

**Behavior**:
- Anyone can access these pages
- `/login` and `/signup` redirect authenticated users to dashboard
- Prevents confusion when users try to log in while already logged in

---

### 2️⃣ USER PROTECTED ROUTES
Require authentication (available to both students and admins).

| Route | Component/Section | Description | Auth Required | Admin Required |
|-------|-------------------|-------------|---------------|----------------|
| `/dashboard` | `Dashboard` or `AdminDashboard` | Main dashboard (role-based) | Yes | No |
| `/recommendations` | `RecommendationsPage` | Scholarship recommendations | Yes | No |

**Dashboard Internal Sections** (rendered within Dashboard component):
- **Scholarships** - Browse and search scholarships
- **Documents** - Upload and manage documents
- **Saved Items** - Bookmarked scholarships
- **Guidance** - Educational resources
- **Community** - Discussion forum
- **Calendar** - Personal deadlines and events
- **Settings** - Account preferences

**Behavior**:
- If not authenticated → Redirect to `/login`
- Show toast: "Please log in to continue"
- Store intended destination for post-login redirect
- Admin users see `AdminDashboard`, students see regular `Dashboard`

---

### 3️⃣ ADMIN PROTECTED ROUTES
Require both authentication AND admin role.

| Route | Description | Auth Required | Admin Required |
|-------|-------------|---------------|----------------|
| `/admin` | Admin dashboard | Yes | Yes |
| `/admin/*` | All admin routes | Yes | Yes |

**Admin Dashboard Internal Sections**:
- **Dashboard** - Admin overview
- **Users** - User management
- **Documents** - Document verification
- **Posts** - Post moderation
- **Reports** - Handle user reports
- **Scholarships** - Scholarship management
- **Guidance** - Content management
- **Calendar** - Global events management
- **Analytics** - System analytics

**Behavior**:
- If not authenticated → Redirect to `/login`
- If not admin → Redirect to `/unauthorized`
- Show toast: "Access Denied - Admin only"
- Never expose admin links to non-admin users

---

### 4️⃣ ERROR ROUTES

| Route | Component | Description |
|-------|-----------|-------------|
| `/unauthorized` | `UnauthorizedPage` | 403 Forbidden page |
| `/404` | `NotFoundPage` | 404 Not Found page |
| `*` (catch-all) | Redirect to `/404` | Invalid routes |

---

## 🔐 Route Protection Components

### ProtectedRoute Component
**File**: `src/components/routes/ProtectedRoute.tsx`

**Props**:
```typescript
{
  children: React.ReactNode;
  requireAuth?: boolean;      // Default: true
  requireAdmin?: boolean;     // Default: false
  redirectTo?: string;        // Custom redirect path
}
```

**Features**:
- ✅ Shows loading spinner during auth check
- ✅ Displays toast notifications
- ✅ Stores previous location for redirect after login
- ✅ Prevents route flickering during auth check
- ✅ Handles both authentication and authorization

**Example Usage**:
```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requireAuth={true}>
      <DashboardRoute />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/*"
  element={
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

### PublicRoute Component
**File**: `src/components/routes/PublicRoute.tsx`

**Props**:
```typescript
{
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;  // Default: false
  redirectTo?: string;                // Default: /dashboard
}
```

**Features**:
- ✅ Redirects logged-in users from login/signup pages
- ✅ Prevents accessing auth pages when already authenticated
- ✅ No loading spinner (immediate render)

**Example Usage**:
```tsx
<Route 
  path="/login" 
  element={
    <PublicRoute redirectIfAuthenticated={true}>
      <LoginPage />
    </PublicRoute>
  } 
/>
```

---

## 🔄 Authentication Flow

### Initial Page Load
```
1. App starts → AuthProvider initializes
2. Check localStorage for token
3. If token exists → Validate with backend (/api/auth/me)
4. Show loading screen during validation
5. Set user state OR clear invalid token
6. Render routes based on auth state
```

### Login Flow
```
1. User submits credentials
2. POST /api/auth/login
3. Receive accessToken & refreshToken
4. Store tokens in localStorage
5. Set user in AuthContext
6. Redirect to /dashboard (or previous intended page)
```

### Logout Flow
```
1. User clicks logout
2. Show confirmation dialog
3. POST /api/auth/logout
4. Clear tokens from localStorage
5. Clear user from AuthContext
6. Redirect to /login
7. Show toast: "Logged out successfully"
```

### Token Refresh (Automatic)
```
1. Access token expires (15 min)
2. Axios interceptor catches 401
3. POST /api/auth/refresh-token with refreshToken
4. Receive new accessToken
5. Retry original request
6. If refresh fails → logout user
```

---

## 🎨 User Experience Best Practices

### ✅ Do:
1. **Show Loading States**
   - Display spinner while checking authentication
   - Prevent content flash before redirect

2. **Clear Communication**
   - Show toast when blocking access
   - Explain why access is denied

3. **Smart Redirects**
   - Remember intended destination
   - Redirect to dashboard after login from protected route

4. **Graceful Errors**
   - Show 404 page for invalid routes
   - Show 403 page for unauthorized access
   - Provide navigation options

5. **Role-Based UI**
   - Hide admin links from regular users
   - Show appropriate dashboard based on role

### ❌ Don't:
1. Don't rely on frontend-only protection
2. Don't expose sensitive routes in navbar to non-admins
3. Don't show confusing error messages
4. Don't let route flickering happen
5. Don't forget to handle edge cases (token expired, deleted user, etc.)

---

## 🛡️ Security Considerations

### Frontend Protection (UX Layer)
- Hides UI elements based on role
- Redirects unauthorized users
- Shows appropriate error messages
- **NOT the final security layer**

### Backend Validation (Security Layer)
- Final authority on all permissions
- Validates JWT on every request
- Checks role for admin routes
- **Always enforces security rules**

### Defense in Depth
```
Frontend Route Protection (UX)
         ↓
Backend Route Protection (Security)
         ↓
Database Access Control
         ↓
Resource Ownership Validation
```

---

## 🧪 Testing Routes

### Test Public Access
```tsx
// Visit / without login → Should show LandingPage
// Visit /login while logged in → Should redirect to /dashboard
```

### Test User Protection
```tsx
// Visit /dashboard without login → Should redirect to /login
// Visit /dashboard with login → Should show dashboard
```

### Test Admin Protection
```tsx
// Visit /admin as regular user → Should redirect to /unauthorized
// Visit /admin as admin → Should show AdminDashboard
```

### Test Error Pages
```tsx
// Visit /invalid-route → Should show 404 page
// Access admin route as user → Should show 403 page
```

---

## 📊 Route Summary

| Category | Count | Protection Level |
|----------|-------|-----------------|
| Public | 4 | None |
| User Protected | 2 main + 8 sections | Authentication required |
| Admin Protected | 1 main + 9 sections | Authentication + Admin role |
| Error Pages | 2 | Public |
| **Total** | **26** | - |

---

## 🔗 Related Components

### AuthContext
**File**: `src/contexts/AuthContext.tsx`
- Manages authentication state
- Provides login/logout functions
- Validates tokens
- Stores user data

### useAuth Hook
```tsx
const { user, isLoading, isAdmin, login, logout, refreshUser } = useAuth();
```

**Properties**:
- `user` - Current user object or null
- `isLoading` - true during auth check
- `isAdmin` - true if user.role === 'admin'
- `login()` - Authenticate user
- `logout()` - Clear session
- `refreshUser()` - Reload user data

---

## 🚀 Future Enhancements

### Planned Features
1. **Route Permissions System**
   - Granular permissions beyond role-based
   - Feature flags for beta access

2. **Deep Linking**
   - Support for query parameters in protected routes
   - Better state preservation

3. **Breadcrumb Navigation**
   - Automatic breadcrumb generation
   - Better user orientation

4. **Route Analytics**
   - Track page views
   - Monitor unauthorized access attempts

---

**Last Updated**: 2025-12-19
**Version**: 1.0
**Maintained by**: ApplyBro Development Team
