import { Permission } from "./permission";
import { Role } from "./role";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [Role.ADMIN]: [
        Permission.ADMIN_READ,
        Permission.ADMIN_WRITE,
        Permission.ADMIN_DELETE
    ],
    [Role.STUDENT]: [
        Permission.STUDENT_READ,
        Permission.STUDENT_WRITE,
        Permission.STUDENT_DELETE
    ],
    [Role.INSTRUCTOR]: [
        Permission.INSTRUCTOR_READ,
        Permission.INSTRUCTOR_WRITE,
        Permission.INSTRUCTOR_DELETE
    ]
};

export function getPermissionsForRoles(roles: Role[]): Set<Permission> {
  const out = new Set<Permission>();
  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role] ?? []) {
      out.add(permission);
    }
  }
  return out;
}

