Since we're building an enterprise system and already chose:

✓ Shared Database
✓ Global Unique Email
✓ User belongs to one Tenant

organizationRoles
-> role
-> organization

Completed
Module 1 — Core Infrastructure
✓ Prisma
✓ PostgreSQL
✓ Repository Pattern
✓ Unit Of Work (foundation)
✓ Error Handling
✓ API Response Wrapper
✓ Logging

Module 2 — Auth
✓ Login
✓ Refresh Token
✓ Logout
✓ Logout All Devices
✓ Password Hashing
✓ JWT
✓ Session Management
✓ Device Tracking
✓ Geo Tracking

Module 3 — Audit
✓ AuthorizationAudit Table
✓ Audit Repository
✓ Audit Service
✓ SafeAudit Helper
✓ Login Audit
✓ Failed Login Audit
✓ Refresh Audit
✓ Logout Audit
✓ Logout All Audit

STEP 23
Authorization Foundation
User
↓
UserOrganizationRole
↓
Role
↓
RolePermission
↓
Permission
Example:

John

Role:
RegionAdmin

Permissions:
tag.read
tag.create
tag.update

# Create Authorization Context Builder

src/modules/authorization/services/authorization-context.service.ts
For a user:Abebe
{
"userId": "123",
"tenantId": "456",
"email": "abebe@test.com",
"roles": [
"SUPER_ADMIN",
"REGION_ADMIN"
],
"organizations": [
"org1",
"org2"
],
"permissions": [
"tag.read",
"tag.create",
"tag.update",
"user.manage"
]
}

Folder Structure After Step 23.4
src
├── core
│ └── auth
│ └── authenticated-user.ts

├── modules
│ ├── auth
│ │ ├── repositories
│ │ │ └── auth.repository.ts
│ │ └── types
│ │ └── jwt-payload.ts
│ │
│ └── authorization
│ └── services
│ └── authorization-context.service.ts

STEP 23.5 — JWT Authentication Middleware

Incoming Request
↓
Extract JWT
↓
Verify JWT
↓
Load Authorization Context
↓
Attach Current User
↓
Controller

After this step, every protected endpoint can access:

currentUser.userId
currentUser.tenantId
currentUser.roles
currentUser.permissions
currentUser.organizations

Folder Structure

Create:

src
├── core
│ └── auth
│ ├── authenticated-user.ts
│ ├── current-user.ts
│ └── auth-guard.ts
│
├── modules
│ ├── auth
│ │ └── services
│ │ └── jwt.service.ts
│ │
│ └── authorization
│ └── services
│ └── authorization-context.service.ts

┌─────────────────────┐
│ API Routes │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ Auth Guard │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ Authorization │
│ Context Service │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ Auth Repository │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ Prisma │
└─────────────────────┘

Here is a breakdown of the three permission guard functions provided in your code:

### 1. `requirePermission`

This function is used to enforce that the current user has a **single specific permission**.

- **Logging**: It starts by logging the `currentUser.roles` and `currentUser.permissions` to the console, which is helpful for debugging authorization issues.
- **Bypass Role Check**: It calls `hasBypassRole(currentUser)`. If the user has a "bypass role" (e.g., an Admin or Super Admin role that implicitly has all permissions), the function returns immediately, allowing access without checking specific permissions.
- **Permission Check**: It checks if the `permission` string provided is included in the `currentUser.permissions` array.
- **Error Handling**: If the user does not have the required permission (and doesn't have a bypass role), it throws a `ForbiddenError` indicating exactly which permission was missing.

### 2. `requireAnyPermission`

This function is used when you want to allow access if the user has **at least one** of a set of permissions.

- **Bypass Role Check**: Like the previous function, it first checks if the user has a bypass role and returns early if they do.
- **Permission Check**: It takes an array of `permissions`. It uses the `some` array method to check if the user has _any_ of the permissions in the provided array. If `currentUser.permissions` includes at least one of the items in `permissions`, `hasPermission` is true.
- **Error Handling**: If the user has none of the specified permissions, it throws a generic `ForbiddenError` stating "Missing required permissions".

### 3. `requireAllPermissions`

This function ensures the user has **every single permission** in a given list.

- **Bypass Role Check**: It again allows users with a bypass role to skip the explicit permission checks.
- **Permission Check**: It takes an array of `permissions`. It uses the `every` array method to verify that _all_ of the permissions in the provided array are present in `currentUser.permissions`. If even one is missing, `hasAllPermissions` will evaluate to false.
- **Error Handling**: If the user is missing any of the required permissions, it throws a `ForbiddenError` with the message "Missing required permissions".

### Summary

These three functions provide a robust utility for authorization checks throughout your application:

- Use `requirePermission` for simple actions (e.g., "can_edit_post").
- Use `requireAnyPermission` when multiple roles/permissions overlap (e.g., "can_edit_post" OR "can_manage_all_posts").
- Use `requireAllPermissions` for actions that require multiple explicit grants (e.g., "can_edit_post" AND "can_publish_post").

STEP 25 — Role Hierarchy Resolver
SUPER_ADMIN
↑
SYSTEM_ADMIN
↑
REGIONAL_ADMIN
↑
TAG_MANAGER
↑
TAG_OPERATOR

or any hierarchy you create dynamically.

Why We Need This

Suppose:

# TAG_OPERATOR

Permissions:tag.read

# TAG_MANAGER

inherits:TAG_OPERATOR
and has:
tag.create
tag.update
Expected result:

# AG_MANAGER

=
tag.read (from TAG_OPERATOR)
tag.create (from TAG_MANAGER)
tag.update (from TAG_MANAGER)

without duplicating permissions.

# Authorization Flow Super Admin

SUPER_ADMIN
↓
Bypass everything

All Other Roles
↓
Permission-Based Authorization
