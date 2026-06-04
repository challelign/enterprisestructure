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
│   └── auth
│       └── authenticated-user.ts

├── modules
│   ├── auth
│   │   ├── repositories
│   │   │   └── auth.repository.ts
│   │   └── types
│   │       └── jwt-payload.ts
│   │
│   └── authorization
│       └── services
│           └── authorization-context.service.ts

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
│   └── auth
│       ├── authenticated-user.ts
│       ├── current-user.ts
│       └── auth-guard.ts
│
├── modules
│   ├── auth
│   │   └── services
│   │       └── jwt.service.ts
│   │
│   └── authorization
│       └── services
│           └── authorization-context.service.ts