# CashFlow

CashFlow is a modern personal finance tracker built with Next.js and Spring Boot. It provides secure JWT authentication, transactions, categories, budgets, and analytics dashboards with a premium UI.

## Tech Stack

- Frontend: Next.js App Router + TypeScript + TailwindCSS + shadcn/ui
- Backend: Spring Boot + Spring Security + JPA + Flyway
- Database: PostgreSQL
- Charts: Recharts
- State: Zustand

## Prerequisites

- Node.js 20+
- Java 21
- PostgreSQL 15+

## Local Setup

### 1) Database

Create a local database and user. Default configuration expects:

- Database: `cashflow`
- Username: `postgres`
- Password: `postgres`

Update [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties) if needed.

### 2) Backend

From the repo root:

```bash
cd backend
./mvnw.cmd spring-boot:run
```

Set a JWT secret using the environment variable:

```bash
set JWT_SECRET=replace-with-secure-secret
```

### 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

If your backend runs on a different URL, set:

```bash
set NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Open http://localhost:3000

## Demo Seed Data (Optional)

To load a demo user plus sample transactions and budgets, enable seeding:

```properties
app.seed.enabled=true
app.seed.demo-email=demo@cashflow.app
app.seed.demo-password=Password123!
```

Default demo credentials:

- Email: `demo@cashflow.app`
- Password: `Password123!`

## Scripts

- Backend tests: `./mvnw.cmd test`
- Frontend lint: `npm run lint`