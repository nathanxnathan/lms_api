# Architecture and implementation notes

## Request and data flow

The current user creation request flows through these layers:

1. **Route** (`src/modules/user/user.routes.ts`) maps `POST /api/users` to the
   user controller.
2. **Controller** (`src/modules/user/user.controller.ts`) handles the HTTP
   request and response, and forwards errors to Express.
3. **Service** (`src/modules/user/user.service.ts`) contains user creation
   logic, including password hashing.
4. **Repository** (`src/modules/user/user.respository.ts`) uses TypeORM to
   persist users.
5. **Entity** (`src/modules/user/user.entity.ts`) describes the `users` table,
   its columns, and the `UserRole` enum.

`src/main.ts` initializes the database, configures JSON parsing, mounts module
routes, and starts the HTTP server. The enrollment module exposes public
application/status endpoints and admin-only review endpoints.

## Database

The TypeORM data source is configured in `src/config/database.ts`. Schema
changes are managed by migrations in `src/migrations`; automatic schema
synchronization is disabled. Apply new migrations to the configured database
before relying on their schema changes.

The initial users migration creates the role column as `varchar`. Later
migrations make it a PostgreSQL enum and add the `student` role. For new
databases, run all migrations in order.

The enrollment workflow stores applications separately from users. A public
application has a tracking number and a pending/approved/rejected status.
Approving it creates or promotes a student user and creates one enrollment row
per selected course. Courses are associated with one or more departments
through `course_departments`; every application course must be available to
the selected department. An approved student has one department association
stored on the user record. Existing courses can be assigned departments with
the admin course-department endpoint.

New student accounts receive a single-use password-setup link by email. Only
the token hash is stored, and the token expires after 24 hours. Configure
`SENDGRID_API_KEY` and `MAIL_DEFAULT_FROM` to deliver approval email. Configure
`ACCOUNT_SETUP_URL` to point to the frontend password setup page; if omitted,
the API uses `CORS_ORIGIN/set-password`.

## Configuration

Environment values are loaded from `.env` and validated in
`src/config/env.ts`. See `.env.example` for the required database URL and JWT
secret placeholders plus commonly used development defaults. Do not commit
`.env` or real credentials.

## Development conventions

- Keep HTTP-specific behavior in controllers and routes.
- Keep business rules in services.
- Put database access behind repositories.
- Represent persisted table structure with TypeORM entities.
- Make database schema changes through migrations rather than enabling
  `synchronize`.
- Keep enrollment applications distinct from approved course enrollments.

For project setup and currently available commands, see [README.md](./README.md).
For a dated record of completed work and next steps, see [PROGRESS.md](./PROGRESS.md).
