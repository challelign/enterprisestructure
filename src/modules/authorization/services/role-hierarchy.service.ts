import { AuthorizationRepository } from "../repositories/authorization.repository";
import { PermissionGrant } from "../types/permission-grant";

export class RoleHierarchyService {
  private repo = new AuthorizationRepository();

  async getPermissions(roleId: string): Promise<string[]> {
    const permissions = new Set<string>();

    const visited = new Set<string>();

    await this.walkRole(roleId, permissions, visited);

    return [...permissions];
  }

  async getPermissionGrants(roleId: string): Promise<PermissionGrant[]> {
    const grants: PermissionGrant[] = [];
    const visited = new Set<string>();
    await this.walkRoleGrants(roleId, grants, visited);
    return grants;
  }


  private async walkRole(
    roleId: string,
    permissions: Set<string>,
    visited: Set<string>,
  ) {
    if (visited.has(roleId)) {
      return;
    }

    visited.add(roleId);

    const role = await this.repo.findRoleWithPermissions(roleId);

    if (!role) {
      return;
    }

    for (const rp of role.permissions) {
      permissions.add(rp.permission.permissionKey);
    }

    if (role.inheritsFromId) {
      await this.walkRole(role.inheritsFromId, permissions, visited);
    }
  }

  private async walkRoleGrants(
    roleId: string,
    grants: PermissionGrant[],
    visited: Set<string>,
  ) {
    if (visited.has(roleId)) {
      return;
    }

    visited.add(roleId);

    const role = await this.repo.findRoleWithPermissions(roleId);

    if (!role) {
      return;
    }

    for (const rp of role.permissions) {
      grants.push({
        permissionKey: rp.permission.permissionKey,
        effect: rp.effect,
        roleId: role.id,
        roleKey: role.roleKey,
        conditions: rp.conditions,
      });
    }

    if (role.inheritsFromId) {
      await this.walkRoleGrants(role.inheritsFromId, grants, visited);
    }
  }
}
