import { CurrentUser } from "../auth/current-user";
import { ADMIN_BYPASS_ROLES } from "../authorization/roles.constants";

function hasBypassRole(currentUser: CurrentUser) {
  return currentUser.roles.some((role) =>
    ADMIN_BYPASS_ROLES.includes(role as (typeof ADMIN_BYPASS_ROLES)[number]),
  );
}
