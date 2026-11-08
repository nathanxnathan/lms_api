"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_ROLES = exports.INSTRUCTOR_ROLES = exports.STUDENT_ROLES = exports.ADMIN_ROLES = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["STUDENT"] = "STUDENT";
    Role["INSTRUCTOR"] = "INSTRUCTOR";
})(Role || (exports.Role = Role = {}));
exports.ADMIN_ROLES = [Role.ADMIN];
exports.STUDENT_ROLES = [Role.STUDENT];
exports.INSTRUCTOR_ROLES = [Role.INSTRUCTOR];
exports.ALL_ROLES = Object.values(Role);
//# sourceMappingURL=role.js.map