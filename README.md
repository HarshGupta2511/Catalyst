# Catalyst Backend 🚀

A company procurement and project management dashboard backend built with NestJS, TypeScript, and PostgreSQL.

---

## 🏢 About the Project

Catalyst is an internal company tool for managing:
- Purchase Requests (PR) with Amazon-style tracking
- Transfer Orders (TO)
- Task Management
- Project Timelines
- Team Management

Built for companies with departments: Software, Design, Engineering, Procurement, Flight Ops, Production, Store, Finance.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 11 | Backend framework |
| TypeScript | 5.7 | Programming language |
| Prisma | 5 | ORM - database tool |
| PostgreSQL | 14 | Primary database |
| Redis | 6 | Cache + job queues |
| BullMQ | - | Email job scheduler |
| JWT | - | Authentication tokens |
| bcrypt | - | Password hashing |
| Passport | - | Auth middleware |

---

## 📋 Prerequisites

Make sure you have these installed before running the project:

- Node.js v20+
- npm v10+
- PostgreSQL 14+
- Redis 6+
- Git

### Check if installed:
```bash
node -v
npm -v
psql --version
redis-cli --version
git --version
```

---

## ⚙️ Environment Setup

### 1. Clone the repository
```bash
git clone git@github.com:HarshGupta2511/catalyst-backend.git
cd catalyst-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
Create a `.env` file in the root folder:
```bash
cp .env.example .env
```

Or create it manually and add:
```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/catalyst_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets (change these in production!)
JWT_SECRET="your_super_secret_jwt_key"
JWT_REFRESH_SECRET="your_refresh_secret_key"

# Server
PORT=3000
```

> ⚠️ Never commit your `.env` file to GitHub. It is already in `.gitignore`.

### 4. Create the database
```bash
sudo -u postgres psql -c "CREATE DATABASE catalyst_db;"
```

### 5. Run database migrations
```bash
npx prisma migrate dev
```

This creates all tables in your database.

### 6. Start the server
```bash
npm run start:dev
```

You should see:
```
✅ Database connected successfully
[Nest] LOG [NestApplication] Nest application successfully started
```

Server runs at: `http://localhost:3000`

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `User` | All company employees |
| `PurchaseRequest` | Every PR raised in the system |
| `PurchaseRequestStage` | Each step in the PR approval flow |
| `EscalationJob` | Auto email reminder tracking |
| `Invoice` | Payment records |
| `GRN` | Goods Received Notes |
| `AuditLog` | Every action tracked |

### View database visually:
```bash
npx prisma studio
```
Opens at `http://localhost:5555`

---

## 👥 Roles & Departments

### Departments
- Software
- Design
- Engineering
- Procurement
- Flight Ops
- Production
- Store
- Finance

### Roles
- `Employee` — default role on register
- `Product Lead` — assigned by Admin
- `Department Head` — head of a department
- `CEO` — approves Purchase Requests
- `Admin` — manages users and system

---

## 📁 Project Structure

```
catalyst-backend/
├── prisma/
│   ├── schema.prisma               # Database blueprint (all models)
│   └── migrations/                 # Auto-generated tracked DB changes
│
├── src/
│   ├── main.ts                     # Entry point — bootstraps NestJS app, sets up ValidationPipe
│   ├── app.module.ts               # Root module — imports all feature modules
│   ├── app.controller.ts           # Root controller — GET / health check
│   ├── app.service.ts              # Root service
│   │
│   ├── prisma/                     # Database connection module (global)
│   │   ├── prisma.module.ts        # Exports PrismaService globally so all modules can use it
│   │   └── prisma.service.ts       # Extends PrismaClient, handles connect/disconnect
│   │
│   ├── auth/                       # Authentication module
│   │   ├── auth.module.ts          # Registers PassportModule, JwtModule, guards, strategy
│   │   ├── auth.controller.ts      # Routes: POST /auth/register, /login, /refresh  GET /auth/me
│   │   ├── auth.service.ts         # Business logic: register, login, getMe, generateTokens, refreshTokens
│   │   ├── jwt.strategy.ts         # Passport JWT strategy — validates Bearer token, extracts payload
│   │   ├── jwt-auth.guard.ts       # Guard that protects routes — throws 401 if no valid token
│   │   ├── roles.guard.ts          # Guard that checks user role against @Roles() decorator
│   │   └── roles.decorator.ts      # @Roles('Admin') custom decorator — sets metadata on routes
│   │
│   ├── users/                      # Users management module (Admin only)
│   │   ├── users.module.ts         # Registers UsersController and UsersService
│   │   ├── users.controller.ts     # Routes: GET/POST /users  GET/PATCH/DELETE /users/:id
│   │   ├── users.service.ts        # Business logic: findAll, findOne, create, update, remove
│   │   └── dto/
│   │       ├── create-user.dto.ts  # Validation schema for creating a user (name, email, password, etc.)
│   │       └── update-user.dto.ts  # Validation schema for updating a user (all fields optional)
│   │
│   └── pr/                         # Purchase Requests module (coming soon)
│
├── test/
│   └── app.e2e-spec.ts             # End-to-end test for root route
│
├── .env                            # Secret config — never commit this!
├── .env.example                    # Template showing required env variables
├── .gitignore
├── nest-cli.json                   # NestJS CLI config
├── tsconfig.json                   # TypeScript config
├── tsconfig.build.json             # TypeScript config for production build (excludes tests)
└── package.json
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Create new account |
| POST | `/auth/login` | Public | Login, get JWT tokens |
| POST | `/auth/refresh` | Public | Get new access token using refresh token |
| GET | `/auth/me` | JWT required | Get currently logged in user info |

### Users
> ⚠️ All `/users` routes require a valid JWT token AND the `Admin` role.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Admin | List all users (filter by `?department=` or `?role=`) |
| GET | `/users/:id` | Admin | Get a single user by ID |
| POST | `/users` | Admin | Create a new user with any role |
| PATCH | `/users/:id` | Admin | Update user details (role, designation, etc.) |
| DELETE | `/users/:id` | Admin | Delete a user by ID |

### Purchase Requests (coming soon)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/pr` | Product Lead | Create new PR |
| GET | `/pr` | All | List PRs with filters |
| GET | `/pr/:id` | All | Full PR detail + timeline |
| POST | `/pr/:id/approve` | Stage owner | Approve current stage |
| POST | `/pr/:id/reject` | Stage owner | Reject with reason |
| GET | `/pr/stats` | All | Dashboard statistics |

---

## 🔐 Authentication

All protected routes require a JWT token in the header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### How to get a token:
1. Register or Login
2. Copy the `accessToken` from the response
3. Add it to every request header

### Token expiry:
- Access token: **1 day**
- Refresh token: **7 days**

### Refresh expired token:
```json
POST /auth/refresh
{
  "refreshToken": "your_refresh_token"
}
```

---

## 🧪 Testing APIs

We use **Thunder Client** (VS Code extension) to test APIs.

Install: `Ctrl + Shift + X` → search **Thunder Client** → Install

### Register a new user:
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "Your Name",
  "email": "you@company.com",
  "password": "Test@1234",
  "designation": "Software Engineer",
  "department": "Software",
  "phone": "9999999999"
}
```

### Login:
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "you@company.com",
  "password": "Test@1234"
}
```

### Get current user (protected):
```
GET http://localhost:3000/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### List all users (Admin only):
```
GET http://localhost:3000/users
Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
```

### List users filtered by department:
```
GET http://localhost:3000/users?department=Software
Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
```

### List users filtered by role:
```
GET http://localhost:3000/users?role=Employee
Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
```

### Get single user by ID:
```
GET http://localhost:3000/users/USER_UUID_HERE
Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
```

### Create a user (Admin only):
```
POST http://localhost:3000/users
Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "Test@1234",
  "designation": "Designer",
  "department": "Design",
  "role": "Employee",
  "phone": "8888888888"
}
```

### Update a user (Admin only):
```
PATCH http://localhost:3000/users/USER_UUID_HERE
Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "role": "Department Head",
  "isProjectLead": true
}
```

### Delete a user (Admin only):
```
DELETE http://localhost:3000/users/USER_UUID_HERE
Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
```

---

## 📦 Users Module — Field Reference

### `CreateUserDto` — used in `POST /users` and `POST /auth/register`

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `name` | string | ✅ | Not empty | Full name |
| `email` | string | ✅ | Valid email format | Must be unique |
| `password` | string | ✅ | Min 6 characters | Hashed before saving |
| `designation` | string | ✅ | Not empty | Job title e.g. "Software Engineer" |
| `department` | enum | ✅ | Must be valid Department | See departments list above |
| `role` | enum | ❌ | Must be valid Role if provided | Defaults to `Employee` |
| `phone` | string | ❌ | Optional string | Mobile number |

### `UpdateUserDto` — used in `PATCH /users/:id`

All fields are optional. Only send what you want to change.

| Field | Type | Validation |
|-------|------|------------|
| `name` | string | Optional |
| `email` | string | Valid email format |
| `password` | string | Min 6 characters |
| `designation` | string | Optional |
| `department` | enum | Must be valid Department |
| `role` | enum | Must be valid Role |
| `phone` | string | Optional |
| `isProjectLead` | boolean | true or false |

### Valid `department` values:
`Software` · `Design` · `Engineering` · `Procurement` · `Flight Ops` · `Production` · `Store` · `Finance`

### Valid `role` values:
`Employee` · `Product Lead` · `Department Head` · `CEO` · `Admin`

---

## 🚀 Useful Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:prod         # Start production build
npm run build              # Build for production

# Testing
npm run test               # Run all unit tests
npm run test:cov           # Run tests with coverage report
npm run test:e2e           # Run end-to-end tests

# Database
npx prisma migrate dev     # Run new migrations
npx prisma migrate reset   # Reset database (careful — deletes all data!)
npx prisma studio          # Visual database viewer at localhost:5555
npx prisma generate        # Regenerate Prisma client after schema changes

# Code generation
nest generate module <name>
nest generate service <name>
nest generate controller <name>

# Git workflow
git add .
git commit -m "feat: your message"
git push origin main
```

---

## 📝 Git Commit Convention

We follow this format for commit messages:

```
feat: add new feature
fix: fix a bug
docs: update documentation
refactor: restructure code
test: add tests
chore: update dependencies
```

Examples:
```bash
git commit -m "feat: add users module with CRUD"
git commit -m "fix: resolve token expiry issue"
git commit -m "docs: update README with users endpoints"
```

---

## 🔮 Roadmap

- [x] Database setup with Prisma
- [x] Auth module (register, login, JWT, refresh token)
- [x] Users module (CRUD, role management, filters)
- [ ] PR module (create, approve, reject, timeline)
- [ ] Email escalation system (BullMQ + Redis)
- [ ] Admin panel APIs
- [ ] Switch to Azure PostgreSQL
- [ ] Switch to Azure Redis
- [ ] Azure Communication Services for emails
- [ ] Deploy to Azure App Service

---

## 👨‍💻 Development Team

Built by the Catalyst team. For questions contact the project lead.

---

## 📄 License

Private and confidential. Not for public distribution.