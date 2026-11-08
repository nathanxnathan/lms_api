"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_PERMISSIONS = exports.Permission = void 0;
var Permission;
(function (Permission) {
    Permission["ADMIN_READ"] = "admin:read";
    Permission["ADMIN_WRITE"] = "admin:write";
    Permission["ADMIN_DELETE"] = "admin:delete";
    Permission["INSTRUCTOR_READ"] = "instructor:read";
    Permission["INSTRUCTOR_WRITE"] = "instructor:write";
    Permission["INSTRUCTOR_DELETE"] = "instructor:delete";
    Permission["STUDENT_READ"] = "student:read";
    Permission["STUDENT_WRITE"] = "student:write";
    Permission["STUDENT_DELETE"] = "student:delete";
})(Permission || (exports.Permission = Permission = {}));
exports.ALL_PERMISSIONS = Object.values(Permission);
//# sourceMappingURL=permission.js.map