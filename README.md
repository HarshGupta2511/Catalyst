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
✅ Database connected successfully
[Nest] LOG [NestApplication] Nest application successfully started

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

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Create new account |
| POST | `/auth/login` | Public | Login, get JWT tokens |
| POST | `/auth/refresh` | Public | Get new access token |
| GET | `/auth/me` | JWT required | Get logged in user info |

### Users (coming soon)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Admin | List all users |
| POST | `/users` | Admin | Create user with role |
| PATCH | `/users/:id` | Admin | Update user role/designation |
| DELETE | `/users/:id` | Admin | Delete user |

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
Authorization: Bearer YOUR_ACCESS_TOKEN

### How to get a token:
1. Register or Login
2. Copy the `accessToken` from response
3. Add it to every request header

### Token expiry:
- Access token: **15 minutes**
- Refresh token: **7 days**

### Refresh expired token:
```bash
POST /auth/refresh
{
  "refreshToken": "your_refresh_token"
}
```

---

## 📁 Project Structure
catalyst-backend/
├── prisma/
│   ├── schema.prisma        # Database blueprint
│   └── migrations/          # Tracked DB changes
├── src/
│   ├── prisma/
│   │   ├── prisma.module.ts # Global DB module
│   │   └── prisma.service.ts # DB connection
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   ├── roles.guard.ts
│   │   └── roles.decorator.ts
│   ├── users/               # (in progress)
│   ├── pr/                  # (coming soon)
│   ├── app.module.ts        # Root module
│   └── main.ts              # Entry point
├── .env                     # Secret config (never commit!)
├── .env.example             # Template for .env
├── .gitignore
└── package.json

---

## 🧪 Testing APIs

We use **Thunder Client** (VS Code extension) to test APIs.

Install: `Ctrl + Shift + X` → search **Thunder Client** → Install

### Test Register:
POST http://localhost:3000/auth/register
Body (JSON):
{
"name": "Your Name",
"email": "you@company.com",
"password": "Test@1234",
"designation": "Software",
"department": "Software",
"phone": "9999999999"
}

### Test Login:
POST http://localhost:3000/auth/login
Body (JSON):
{
"email": "you@company.com",
"password": "Test@1234"
}

### Test Protected Route:
GET http://localhost:3000/auth/me
Headers:
Authorization: Bearer YOUR_ACCESS_TOKEN

---

## 🚀 Useful Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:prod         # Start production build
npm run build              # Build for production

# Database
npx prisma migrate dev     # Run new migrations
npx prisma migrate reset   # Reset database (careful!)
npx prisma studio          # Visual database viewer
npx prisma generate        # Regenerate Prisma client

# Code generation
nest generate module <name>
nest generate service <name>
nest generate controller <name>

# Git workflow
git add .
git commit -m "feat: your message"
git push origin main

# Check server logs
npm run start:dev          # Shows all logs in terminal
```

---

## 📝 Git Commit Convention

We follow this format for commit messages:
feat: add new feature
fix: fix a bug
docs: update documentation
refactor: restructure code
test: add tests
chore: update dependencies

Examples:
```bash
git commit -m "feat: add auth module with JWT"
git commit -m "fix: resolve token expiry issue"
git commit -m "docs: update README with API endpoints"
```

---

## 🔮 Roadmap

- [x] Database setup with Prisma
- [x] Auth module (register, login, JWT)
- [ ] Users module (CRUD, role management)
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
Now also create .env.example file (so others know what variables are needed without seeing real values):
bashtouch .env.example
Open it and add:
env# Database
DATABASE_URL="postgresql://username:password@localhost:5432/catalyst_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets
JWT_SECRET="your_super_secret_jwt_key"
JWT_REFRESH_SECRET="your_refresh_secret_key"

# Server
PORT=3000

