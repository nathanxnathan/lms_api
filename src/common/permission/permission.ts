export enum Permission {
    ADMIN_READ = 'admin:read',
    ADMIN_WRITE = 'admin:write',
    ADMIN_DELETE = 'admin:delete',

    INSTRUCTOR_READ = 'instructor:read',
    INSTRUCTOR_WRITE = 'instructor:write',
    INSTRUCTOR_DELETE = 'instructor:delete',

    STUDENT_READ = 'student:read',
    STUDENT_WRITE = 'student:write',
    STUDENT_DELETE = 'student:delete'
}

export const ALL_PERMISSIONS: Permission[] = Object.values(Permission);