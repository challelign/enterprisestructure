import { AuthRepository } from "@/modules/auth/repositories/auth.repository";
import { RoleHierarchyService } from "./role-hierarchy.service";

/*
export class AuthorizationContextService {
  private repo = new AuthRepository();

  async build(userId: string) {
    const user = await this.repo.findUserForAuthorization(userId);

    if (!user) {
      return null;
    }

    const roles = [
      ...new Set(user.organizationRoles.map((x) => x.role.roleKey)),
    ];

    const organizations = [
      ...new Set(user.organizationRoles.map((x) => x.organizationId)),
    ];

    const permissions = [
      ...new Set(
        user.organizationRoles.flatMap((x) =>
          x.role.permissions.map((p) => p.permission.permissionKey),
        ),
      ),
    ];

    return {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      profile: user.profile,
      roles,
      organizations,
      permissions,
    };
  }
}
*/

export class AuthorizationContextService {
  private repo = new AuthRepository();
  private hierarchyService = new RoleHierarchyService();

  async build(userId: string) {
    const user = await this.repo.findUserForAuthorization(userId);

    if (!user) {
      return null;
    }

    const roles = [
      ...new Set(user.organizationRoles.map((x) => x.role.roleKey)),
    ];

    const organizations = [
      ...new Set(user.organizationRoles.map((x) => x.organizationId)),
    ];

    const permissionSet = new Set<string>();
    const permissionGrants = [];

    for (const orgRole of user.organizationRoles) {
      const inheritedPermissions = await this.hierarchyService.getPermissions(
        orgRole.roleId,
      );

      inheritedPermissions.forEach((permission) =>
        permissionSet.add(permission),
      );

      const grants = await this.hierarchyService.getPermissionGrants(
        orgRole.roleId,
      );
      permissionGrants.push(...grants);
    }

    const permissions = [...permissionSet];

    return {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      profile: user.profile,
      roles,
      organizations,
      permissions,
      permissionGrants,
    };
  }
}
