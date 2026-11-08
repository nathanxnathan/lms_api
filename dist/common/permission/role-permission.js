"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = void 0;
exports.getPermissionsForRoles = getPermissionsForRoles;
const permission_1 = require("./permission");
const role_1 = require("./role");
exports.ROLE_PERMISSIONS = {
    [role_1.Role.ADMIN]: [
        permission_1.Permission.ADMIN_READ,
        permission_1.Permission.ADMIN_WRITE,
        permission_1.Permission.ADMIN_DELETE
    ],
    [role_1.Role.STUDENT]: [
        permission_1.Permission.STUDENT_READ,
        permission_1.Permission.STUDENT_WRITE,
        permission_1.Permission.STUDENT_DELETE
    ],
    [role_1.Role.INSTRUCTOR]: [
        permission_1.Permission.INSTRUCTOR_READ,
        permission_1.Permission.INSTRUCTOR_WRITE,
        permission_1.Permission.INSTRUCTOR_DELETE
    ]
};
function getPermissionsForRoles(roles) {
    const out = new Set();
    for (const role of roles) {
        for (const permission of exports.ROLE_PERMISSIONS[role] ?? []) {
            out.add(permission);
        }
    }
    return out;
}
//# sourceMappingURL=role-permission.js.map