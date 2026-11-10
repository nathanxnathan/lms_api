# Learning Management System API

A REST API for a Learning Management System (LMS). The project is being built
to support students, instructors, and administrators with courses, enrollment,
learning materials, assignments, grading, and related academic workflows.

## Current status

The project is under active development. The current implemented feature is
user creation. Authentication, course management, and the other LMS modules are
planned, not yet available.

## Technology

| Area | Technology |
| --- | --- |
| Runtime | Node.js 24 |
| Language | TypeScript |
| HTTP framework | Express 5 |
| Database | PostgreSQL |
| ORM and migrations | TypeORM |
| Password hashing | bcryptjs |
| Environment validation | Joi |
| Package manager | pnpm |

## Prerequisites

- Node.js 24
- pnpm
- PostgreSQL 17 (or Docker to run it locally)

## Getting started

1. Install dependencies:

   ```powershell
   pnpm install
   ```

2. Start a local PostgreSQL database with Docker:

   ```powershell
   docker run -d `
     --name lms-postgres `
     -e POSTGRES_USER=lms_admin `
     -e POSTGRES_PASSWORD=your_secure_password `
     -e POSTGRES_DB=lms_db `
     -p 5432:5432 `
     -v lms_postgres_data:/var/lib/postgresql `
     postgres:17
   ```

3. Copy `.env.example` to `.env`. Set `DATABASE_URL` to match the database
   credentials above, and replace both JWT secret placeholders with unique,
   random values of at least 32 characters. These secrets are required by the
   current environment configuration, even though authentication endpoints
   have not been implemented yet.

4. Create the UUID extension used by the initial migration, then run migrations:

   ```powershell
   docker exec lms-postgres psql -U lms_admin -d lms_db -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
   pnpm typeorm migration:run -d src/config/database.ts
   ```

5. Start the development server:

   ```powershell
   pnpm dev
   ```

The API listens on port `4000` by default. Change `PORT` in `.env` to use a
different port.

## Current endpoint

Create a user with `POST /api/users`. Send JSON with
`Content-Type: application/json`:

```json
{
  "email": "student@example.com",
  "firstName": "Taylor",
  "lastName": "Student",
  "password": "replace-with-a-strong-password"
}
```

The new user's role defaults to `user`. The API returns the created user with
HTTP status `201`.

## Development commands

```powershell
pnpm dev         # Run the API with automatic reload
pnpm typecheck   # Check TypeScript types
pnpm build       # Compile to dist
pnpm start       # Run the compiled API
```

The `test` script is currently a placeholder; an automated test suite has not
been set up.

## Project notes

- [DOCUMENTATION.md](./DOCUMENTATION.md) describes the code structure and
  architectural responsibilities.
- [PROGRESS.md](./PROGRESS.md) tracks dated development progress and upcoming
  work.
