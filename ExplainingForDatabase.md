Here is a clear description of each table in your Prisma schema along with their relationships mapped out:

### 1. Tenant

**Description**: The root entity of the system. Represents an isolated workspace, client, or company. Almost all other data is scoped to a specific tenant to ensure data isolation in a multi-tenant architecture.

```text
Tenant
│ └── Organization
│ └── User
│ └── Role
│ └── Permission
│ └── TenantModule
│ └── AuthorizationPolicy
```

### 2. FeatureModule

**Description**: Represents an application feature or module (e.g., HR, Payroll, CRM). These can be toggled on or off for different tenants.

```text
FeatureModule
│ └── TenantModule
```

### 3. TenantModule

**Description**: A junction table mapping which `FeatureModule`s are enabled for which `Tenant`. It also stores tenant-specific settings for that module.

```text
TenantModule
│ ├── tenant (Tenant)
│ └── module (FeatureModule)
```

### 4. ResourceClaim

**Description**: Represents fine-grained, dynamic access rights or tags for specific external resources (identified by a generic string ID). _Note: This table tracks IDs natively without explicit Prisma relation links to other tables._

```text
ResourceClaim
```

### 5. Organization

**Description**: Represents structural/hierarchical units within a tenant (e.g., Headquarters, Region, Branch, Department). It supports a tree-like hierarchy (parent/children).

```text
Organization
│ ├── tenant (Tenant)
│ ├── parent (Organization)
│ └── children (Organization)
│ └── userOrganizationRoles (UserOrganizationRole)
│ └── userClaims (UserClaim)
│ └── authorizationAudits (AuthorizationAudit)
```

### 6. User

**Description**: The core account entity for a person or system logging in. Handles authentication data, login tracking, and account status.

```text
User
│ ├── tenant (Tenant)
│ └── profile (UserProfile)
│ └── sessions (UserSession)
│ └── mfaMethods (UserMfaMethod)
│ └── organizationRoles (UserOrganizationRole)
│ └── claims (UserClaim)
│ └── authorizationAudits (AuthorizationAudit)
```

### 7. UserProfile

**Description**: Stores detailed personal, demographic, and employee information for a user. It has a strict 1-to-1 relationship with `User`.

```text
UserProfile
│ ├── user (User)
```

### 8. UserSession

**Description**: Tracks an active authentication session, including tokens, device fingerprints, and IP data for security and auditing.

```text
UserSession
│ ├── user (User)
```

### 9. UserMfaMethod

**Description**: Stores Multi-Factor Authentication setups for a user (e.g., Authenticator App, SMS, Email). A user can have multiple MFA methods.

```text
UserMfaMethod
│ ├── user (User)
```

### 10. Role

**Description**: Defines a job function or a grouping of permissions (e.g., "Admin", "Manager"). Roles can inherit permissions from other roles to build a hierarchy.

```text
Role
│ ├── tenant (Tenant)
│ ├── inheritsFrom (Role)
│ └── inheritedRoles (Role)
│ └── permissions (RolePermission)
│ └── userOrganizationRoles (UserOrganizationRole)
```

### 11. Permission

**Description**: The most granular level of access control. Defines a specific action that can be performed on a specific resource (e.g., "user.create", "report.view").

```text
Permission
│ ├── tenant (Tenant)
│ └── rolePermissions (RolePermission)
```

### 12. RolePermission

**Description**: A junction table linking `Role`s to `Permission`s. It defines whether a role is ALLOWED or DENIED a specific permission, and can hold dynamic conditions.

```text
RolePermission
│ ├── role (Role)
│ ├── permission (Permission)
```

### 13. UserOrganizationRole

**Description**: A ternary junction table that assigns a `User` to a specific `Role` _within_ the context of a specific `Organization`. This allows a user to be an "Admin" in Branch A, but only a "Viewer" in Branch B.

```text
UserOrganizationRole
│ ├── user (User)
│ ├── organization (Organization)
│ ├── role (Role)
```

### 14. UserClaim

**Description**: Stores arbitrary, custom key-value attributes for a user (e.g., `clearance_level: top_secret`). These can optionally be scoped to a specific organization.

```text
UserClaim
│ ├── user (User)
│ ├── organization (Organization)
```

### 15. AuthorizationPolicy

**Description**: Defines advanced, Attribute-Based Access Control (ABAC) rules. These are global or tenant-level rules that are evaluated alongside standard role-based permissions.

```text
AuthorizationPolicy
│ ├── tenant (Tenant)
```

### 16. AuthorizationAudit

**Description**: An audit log table that records important security events (like logging in, permission checks, role assignments) for compliance and tracking.

```text
AuthorizationAudit
│ ├── user (User)
│ ├── organization (Organization)
```
