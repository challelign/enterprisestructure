Here is an expanded and more detailed breakdown of your Prisma schema tables, including deeper descriptions, relationship mappings, and concrete examples to help visualize how they work together in practice.

### 1. Tenant

**Description**: The absolute top-level container (root entity) in a multi-tenant system. Every distinct client, company, or isolated workspace using your platform gets its own Tenant record. By associating almost all other records (users, roles, organizations) with a `tenantId`, you ensure complete data isolation so one client cannot see another client's data.
**Relations**:

```text
Tenant (e.g., "Acme Corp")
│ └── Organization (Acme Headquarters, Acme Europe)
│ └── User (Alice, Bob)
│ └── Role (Admin, Employee)
│ └── Permission (view_reports)
│ └── TenantModule (HR Module Enabled)
│ └── AuthorizationPolicy (Global Access Rules)
```

**Example**: If you sell your software to "Acme Corp" and "Globex Inc", you create two tenants. When an Acme Corp user logs in, the system filters all queries by `tenantId = "acme-123"`.

---

### 2. FeatureModule

**Description**: Represents a standalone feature, product, or module within your software platform that you might want to toggle on or off.
**Relations**:

```text
FeatureModule (e.g., "Payroll Module")
│ └── TenantModule (Link to Acme Corp)
```

**Example**: You have modules for "HR", "Payroll", and "Inventory". You define these three features here.

---

### 3. TenantModule

**Description**: A junction (mapping) table that connects a `Tenant` to a `FeatureModule`. If a record exists here, it means the tenant has subscribed to or enabled that specific module.
**Relations**:

```text
TenantModule
│ ├── tenant (Tenant: "Acme Corp")
│ └── module (FeatureModule: "Payroll Module")
```

**Example**: "Acme Corp" pays for the "HR" and "Payroll" modules, but not "Inventory". There will be two records in this table for Acme Corp linking them to HR and Payroll.

---

### 4. ResourceClaim

**Description**: Represents highly specific, dynamic access rights or metadata attached to a generic resource in your system. It doesn't rely on strict database foreign keys (like Prisma relations) for the resource, allowing it to tag anything by its string ID.
**Relations**: _Tracks IDs manually without strict database constraints._

```text
ResourceClaim
```

**Example**: A specific document (resourceType: "Document", resourceId: "doc-999") has a claim (claimType: "Confidentiality", claimValue: "Top Secret").

---

### 5. Organization

**Description**: Represents the structural, hierarchical units within a single tenant. It uses a self-referencing relationship (parent/child) to build infinite trees of departments, branches, or regions.
**Relations**:

```text
Organization (e.g., "Acme Europe")
│ ├── tenant (Tenant: "Acme Corp")
│ ├── parent (Organization: "Acme Global HQ")
│ └── children (Organization: "Acme UK", "Acme France")
│ └── userOrganizationRoles (Alice is Admin here)
```

**Example**:

- Tenant: "Ministry of Health"
  - Organization 1: "Headquarters"
  - Organization 2: "Northern Region" (Parent: Headquarters)
    - Organization 3: "District Hospital A" (Parent: Northern Region)

---

### 6. User

**Description**: The core account entity. Represents a person (or system API) that can log in. It holds authentication secrets (password hash) and account statuses (active, locked, suspended).
**Relations**:

```text
User (e.g., "abebe@test.com")
│ ├── tenant (Tenant: "Ministry of Health")
│ └── profile (UserProfile: First Name, Last Name)
│ └── sessions (UserSession: Active logins)
│ └── mfaMethods (UserMfaMethod: Google Authenticator)
│ └── organizationRoles (UserOrganizationRole: Admin in HQ)
```

**Example**: "Abebe" is a User. He belongs to the "Ministry of Health" tenant, his account is `ACTIVE`, and his `UserType` is `INTERNAL`.

---

### 7. UserProfile

**Description**: An extension of the `User` table (1-to-1 relationship). It keeps the `User` table lightweight for authentication, while this table stores all personal, demographic, and display information.
**Relations**:

```text
UserProfile
│ ├── user (User: "Abebe")
```

**Example**: Stores Abebe's `firstName` ("Abebe"), `dateOfBirth`, `profilePhotoUrl`, and `jobTitle` ("Senior Inspector").

---

### 8. UserSession

**Description**: Tracks every active login session. Useful for security features like "Force logout on all devices" or showing the user their recent login activity.
**Relations**:

```text
UserSession
│ ├── user (User: "Abebe")
```

**Example**: Abebe logs in from his laptop (Session 1: Chrome on Windows, IP: 192.168.1.1) and later from his phone (Session 2: Safari on iOS).

---

### 9. UserMfaMethod

**Description**: Stores the configuration for Multi-Factor Authentication (MFA). A user can have multiple backup methods.
**Relations**:

```text
UserMfaMethod
│ ├── user (User: "Abebe")
```

**Example**: Abebe has two records here: one for his TOTP App (e.g., Google Authenticator secret hash) and one for SMS backup codes.

---

### 10. Role

**Description**: A reusable grouping of permissions, or a job title designation. Roles can inherit from other roles to easily build complex permission structures without duplication.
**Relations**:

```text
Role (e.g., "Regional Admin")
│ ├── tenant (Tenant)
│ ├── inheritsFrom (Role: "Basic User")
│ └── permissions (RolePermission: Can create users, edit reports)
│ └── userOrganizationRoles (Assigned to Abebe)
```

**Example**: A "Manager" role inherits from the "Employee" role. The Employee role has `read` permissions, and the Manager role adds `approve` permissions.

---

### 11. Permission

**Description**: The smallest, most granular unit of access control. It defines exactly what action can be performed on what resource.
**Relations**:

```text
Permission (e.g., "user.create")
│ ├── tenant (Tenant)
│ └── rolePermissions (Linked to "Admin" role)
```

**Example**: `resource` = "report", `action` = "delete". `permissionKey` = "report.delete".

---

### 12. RolePermission

**Description**: The junction table connecting a `Role` to a `Permission`. It defines if the role is explicitly `ALLOW`ed or `DENY`ed that action.
**Relations**:

```text
RolePermission
│ ├── role (Role: "Manager")
│ ├── permission (Permission: "report.delete")
```

**Example**: A record here links the "Manager" role to the "report.delete" permission with an `effect` of `ALLOW`.

---

### 13. UserOrganizationRole

**Description**: The most critical table for contextual authorization. It links a `User` to a `Role`, but specifically _within_ an `Organization`. This allows dynamic access based on where the user is working.
**Relations**:

```text
UserOrganizationRole
│ ├── user (User: "Abebe")
│ ├── organization (Organization: "Northern Region")
│ ├── role (Role: "Regional Admin")
```

**Example**: Abebe works for the Ministry of Health. He is assigned the "Regional Admin" role in the "Northern Region" organization. He can manage users there. However, in the "Southern Region" organization, he might only have a "Guest" role, or no role at all.

---

### 14. UserClaim

**Description**: Allows assigning custom, dynamic key-value pairs (attributes) directly to a user, which can optionally be scoped to a specific organization.
**Relations**:

```text
UserClaim
│ ├── user (User: "Abebe")
│ ├── organization (Organization: "Northern Region" - optional)
```

**Example**: Abebe is assigned a claim `claimType = "SecurityClearance"`, `claimValue = "Level_3"`. Authorization policies can check this claim before allowing access to highly sensitive documents.

---

### 15. AuthorizationPolicy

**Description**: Defines complex, global, or tenant-wide rules that go beyond simple roles. These are Attribute-Based Access Control (ABAC) policies.
**Relations**:

```text
AuthorizationPolicy
│ ├── tenant (Tenant)
```

**Example**: A policy named "Lockdown After Hours": `resource = "*", action = "*", effect = "DENY", conditions = { "time": "after 6 PM" }`. Even if Abebe is an Admin, this policy might block his actions after hours.

---

### 16. AuthorizationAudit

**Description**: A security log table that permanently records when users interact with the authorization system. Crucial for compliance (e.g., SOC2).
**Relations**:

```text
AuthorizationAudit
│ ├── user (User: "Abebe")
│ ├── organization (Organization: "Northern Region")
```

**Example**: When Abebe tries to delete a report, the system logs a record: `actionType = "PERMISSION_CHECK", granted = false, reason = "Missing report.delete permission"`. When another Admin assigns Abebe a new role, an audit log records `actionType = "ROLE_ASSIGNED"`.
