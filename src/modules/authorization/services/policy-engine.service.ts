import { PermissionGrant } from "../types/permission-grant";
import { PolicyContext } from "../types/policy-context";

export class PolicyEngineService {
  evaluate(
    grants: PermissionGrant[],
    permissionKey: string,
    context?: PolicyContext,
  ): boolean {
    const matchingGrants = grants.filter(
      (grant) => grant.permissionKey === permissionKey,
    );

    if (matchingGrants.length === 0) {
      return false;
    }

    // DENY always wins
    const hasDeny = matchingGrants.some(
      (grant) =>
        grant.effect === "DENY" &&
        this.evaluateConditions(grant.conditions, context),
    );

    if (hasDeny) {
      return false;
    }

    // At least one valid ALLOW
    const hasAllow = matchingGrants.some(
      (grant) =>
        grant.effect === "ALLOW" &&
        this.evaluateConditions(grant.conditions, context),
    );

    return hasAllow;
  }

  private evaluateConditions(
    conditions: unknown,
    context?: PolicyContext,
  ): boolean {
    if (!conditions) {
      return true;
    }

    const policy = conditions as Record<string, any>;

    // Organization restriction
    if (
      policy.organizationId &&
      policy.organizationId !== context?.organizationId
    ) {
      return false;
    }

    // Region restriction
    if (policy.regionId && policy.regionId !== context?.regionId) {
      return false;
    }

    // Zone restriction
    if (policy.zoneId && policy.zoneId !== context?.zoneId) {
      return false;
    }

    // Woreda restriction
    if (policy.woredaId && policy.woredaId !== context?.woredaId) {
      return false;
    }

    // Resource owner restriction
    if (policy.ownerOnly && context?.resourceOwnerId !== context?.userId) {
      return false;
    }

    return true;
  }
}
