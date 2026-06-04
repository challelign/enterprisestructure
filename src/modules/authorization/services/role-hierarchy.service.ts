import { AuthorizationRepository } from "../repositories/authorization.repository";

export class RoleHierarchyService {
  private repo = new AuthorizationRepository();
  async getInheritedPermissions(roleId: string): Promise<string[]> {
    const permissions = new Set<string>();

    await this.walkRole(roleId, permissions);

    return [...permissions];
  }

  private async walkRole(
    roleId: string,
    permissions: Set<string>,
    visited = new Set<string>(),
  ): Promise<void> {
    if (visited.has(roleId)) {
      return;
    }

    visited.add(roleId);

    const role = await this.repo.findRoleWithHierarchy(roleId);
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
