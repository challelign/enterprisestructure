import { PermissionGrant } from "../types/permission-grant";

export class PolicyEngineService {
  evaluate(grants: PermissionGrant[], permissionKey: string): boolean {
    const matching = grants.filter((x) => x.permissionKey === permissionKey);

    if (matching.length === 0) {
      return false;
    }

    const denied = matching.some((x) => x.effect === "DENY");

    if (denied) {
      return false;
    }

    return matching.some((x) => x.effect === "ALLOW");
  }
}
