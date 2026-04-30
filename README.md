# task-manager-api

Built for Backend Intern Assignment 3. Takes the basic task API from Assignment 2 and adds reminders, categories, tags, and webhook notifications.

I went with three separate data stores — PostgreSQL for users since that data is relational and structured, MongoDB for tasks and categories since the schema is more flexible there, and Redis purely for the job queue. Each one is doing what it's actually good at.

---

## Stack

- Node.js + Express
- PostgreSQL — users
- MongoDB — tasks and categories
- Redis + BullMQ — reminder scheduling
- JWT + bcryptjs — auth
- Joi — validation
- Helmet, CORS, express-rate-limit — security basics
- Axios — webhook delivery
- Docker — runs the whole thing in containers

---

## Running locally

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd task-manager-api
npm install
```

### 2. Set up environment variables

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
REDIS_URL=redis://localhost:6379
JWT_SECRET=something_long_and_random
JWT_EXPIRES_IN=7d
WEBHOOK_URL=https://webhook.site/your-unique-url
```

### 3. Start the databases

```bash
# PostgreSQL
brew services start postgresql@14

# MongoDB
brew services start mongodb-community@7.0

# Redis (Docker)
docker start redis-task-manager

# first time only
docker run -d --name redis-task-manager -p 6379:6379 redis:alpine
```

### 4. Create the users table

```bash
node src/config/pg.setup.js
```

### 5. Start the server

```bash
npm run dev    # development with nodemon
npm start      # production
```

---

## Running with Docker

If you don't want to install anything locally, this runs everything in containers.

```bash
docker-compose up --build
```

Then create the PostgreSQL table:

```bash
docker-compose exec api node src/config/pg.setup.js
```

Shut it down:

```bash
docker-compose down
```

---

## Folder structure

```
src/
├── config/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── tasks/
│   └── categories/
├── middleware/
├── queues/
├── services/
└── utils/
```

Each module keeps its own routes, controller, service and model together. Business logic stays in services — controllers only deal with HTTP.

---

## API

Base URL: `http://localhost:3000/api`

Anything marked 🔒 needs `Authorization: Bearer <token>` in the header.

---

### Auth

| Method | Route | What it does |
|--------|-------|-------------|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Login, get a JWT back |

---

### Users

| Method | Route | What it does |
|--------|-------|-------------|
| GET | `/users/me` 🔒 | Get your profile |

---

### Tasks

Users can only see and modify their own tasks. Trying to access someone else's task returns 404 — not 403. This is intentional, it doesn't leak whether the task exists.

| Method | Route | What it does |
|--------|-------|-------------|
| POST | `/tasks` 🔒 | Create a task |
| GET | `/tasks` 🔒 | Get all your tasks |
| GET | `/tasks/:id` 🔒 | Get one task |
| PATCH | `/tasks/:id` 🔒 | Update any fields |
| DELETE | `/tasks/:id` 🔒 | Delete a task |

**Creating a task:**
```json
{
  "title": "Fix login bug",
  "description": "Token not refreshing correctly",
  "priority": "high",
  "status": "pending",
  "dueDate": "2026-05-10T10:00:00.000Z",
  "category": "<category_id>",
  "tags": ["bug", "urgent", "client-a"]
}
```

**Filtering:**
```
GET /tasks?category=<id>
GET /tasks?tags=bug,urgent
GET /tasks?status=pending
GET /tasks?priority=high
GET /tasks?status=pending&priority=high&tags=bug
```

---

### Categories

| Method | Route | What it does |
|--------|-------|-------------|
| POST | `/categories` 🔒 | Create a category |
| GET | `/categories` 🔒 | Get all your categories |
| GET | `/categories/:id` 🔒 | Get one category |
| PUT | `/categories/:id` 🔒 | Rename a category |
| DELETE | `/categories/:id` 🔒 | Delete a category |

---

## How the main features work

### Categories and tags

I went with user-created categories instead of predefined ones — felt more practical. Each category belongs to the user who created it. Tasks hold a reference to a category ID (optional).

Tags are just an array of strings on the task document itself. Didn't need a separate collection for something this simple. Filtering uses MongoDB's `$in` so you can pass multiple tags and it matches any of them.

### Reminder scheduling

When you create or update a task with a due date, BullMQ schedules a job in Redis set to fire 1 hour before. Each job gets a fixed ID based on the task ID — so if you update the due date, the old job gets replaced automatically, not duplicated. If you mark a task completed or delete it, the job gets cancelled. If the due date is less than an hour away by the time the task is created, the reminder is skipped.

When the job fires, it logs the reminder to the console and optionally sends it to a webhook URL if you've configured one.

### Webhook on completion

When a task status changes to `completed`, a POST request goes out to whatever URL you set as `WEBHOOK_URL`. It's fire-and-forget so it doesn't slow down the API response. If the request fails, it retries up to 3 times with exponential backoff — 1 second, then 2, then 4. After that it logs the failure and moves on.

---

## Other notes

- Passwords use bcrypt at cost factor 12
- All SQL queries are parameterized — wrote raw pg queries, no ORM
- Rate limited at 100 requests per 15 minutes globally, 20 on auth routes
- Request bodies capped at 10kb
- One global error handler for the whole API, different behavior in dev vs production

## Things I'd add with more time

- Pagination on task listing
- Refresh token support
- Proper test coverage
- Real email notifications instead of webhook simulation