export const userTypes = `

  enum UserRole {
    ADMIN = "admin",
    USER = "user",
    INSTRUCTOR = "instructor",
    STUDENT = "student",
  }

  type UserSignUp = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }
`;
