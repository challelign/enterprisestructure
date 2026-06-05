import { AuthorizationRepository } from "../repositories/authorization.repository";

export class RoleHierarchyService {
  private repo = new AuthorizationRepository();

  async getPermissions(roleId: string): Promise<string[]> {
    const permissions = new Set<string>();

    const visited = new Set<string>();

    await this.walkRole(roleId, permissions, visited);

    return [...permissions];
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
}
