export enum Role {
    ADMIN = 'ADMIN',
    STUDENT = 'STUDENT',
    INSTRUCTOR = 'INSTRUCTOR'
}

export const ADMIN_ROLES = [Role.ADMIN];
export const STUDENT_ROLES = [Role.STUDENT];
export const INSTRUCTOR_ROLES = [Role.INSTRUCTOR];

export const ALL_ROLES: Role[] = Object.values(Role);