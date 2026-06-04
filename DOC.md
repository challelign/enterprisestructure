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