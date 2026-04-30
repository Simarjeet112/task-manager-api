# task-manager-api

A REST API for managing tasks. Built as part of a backend internship assignment.

Uses two databases intentionally — PostgreSQL for users (relational, structured) and MongoDB for tasks (flexible schema). JWT for auth, bcrypt for password hashing.

---

## Stack

- Node.js + Express
- PostgreSQL — user accounts
- MongoDB — task data
- JWT + bcryptjs — authentication
- Joi — request validation
- Helmet + CORS + express-rate-limit — security

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd task-manager-api
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in your values:

```env
PORT=3000
NODE_ENV=development

PG_HOST=localhost
PG_PORT=5432
PG_USER=your_pg_user
PG_PASSWORD=your_pg_password
PG_DATABASE=task_manager

MONGO_URI=mongodb://localhost:27017/task_manager

JWT_SECRET=pick_something_long_and_random
JWT_EXPIRES_IN=7d
```

### 3. Create the PostgreSQL table

Make sure PostgreSQL is running, then:

```bash
node src/config/pg.setup.js
```

### 4. Start the server

```bash
npm run dev      # development (nodemon)
npm start        # production
```

---

## Project structure

```
src/
├── config/
│   ├── db.postgres.js
│   └── db.mongo.js
├── modules/
│   ├── auth/
│   ├── users/
│   └── tasks/
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.middleware.js
├── utils/
│   ├── AppError.js
│   └── catchAsync.js
└── app.js
```

Each module owns its routes, controller, service, and model. Business logic lives in services — controllers just handle the HTTP layer.

---

## API

Base URL: `http://localhost:3000/api`

Protected routes need an `Authorization: Bearer <token>` header.

---

### Auth

**POST** `/auth/register`
```json
{
  "name": "Gurpreet Sodi",
  "email": "gurpreet@example.com",
  "password": "securepass123"
}
```

**POST** `/auth/login`
```json
{
  "email": "gurpreet@example.com",
  "password": "securepass123"
}
```

Both return a JWT token on success.

---

### Users

**GET** `/users/me` 🔒

Returns the authenticated user's profile. No password in response.

---

### Tasks

All task routes are protected. Users can only see and modify their own tasks.

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/tasks` | Create a task |
| GET | `/tasks` | Get all my tasks |
| GET | `/tasks/:id` | Get one task |
| PATCH | `/tasks/:id` | Partially update a task |
| DELETE | `/tasks/:id` | Delete a task |

**Task fields:**
- `title` — required
- `description` — optional
- `status` — `pending` / `in-progress` / `completed` (default: pending)
- `priority` — `low` / `medium` / `high` (default: medium)
- `dueDate` — ISO date, optional

Trying to access another user's task returns 404, not 403 — intentional, doesn't leak existence.

---

## Notes

- Passwords hashed with bcrypt at cost factor 12
- SQL queries are parameterized — no ORM, no injection risk
- Rate limited: 100 req/15min globally, 20 req/15min on auth routes
- Body size capped at 10kb
- Error responses are consistent across the whole API — one global handler

## Potential improvements
- Docker support for containerized deployment
- Pagination on GET /tasks
- Refresh token flow
- Unit and integration tests