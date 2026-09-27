# Marketplace Monorepo

A full-stack e-commerce marketplace where users can buy and sell products. Built as a monorepo with a Next.js frontend and an Express + Prisma backend.

## Live Demo

- Frontend (Vercel): https://marketplace-web-nu-murex.vercel.app
- Backend API (Render): https://marketplace-api-1epq.onrender.com

> Note: The backend is hosted on Render's free tier. It may take around 50 seconds to spin up on the first request if it has been inactive.

## Features

- Authentication: JWT-based signup and login (Buyer / Seller roles).
- Seller Dashboard: Sellers can list new products, edit them, and manage their store.
- Product Catalog: Browse products with variants and pricing.
- Shopping Cart: Add items, update quantities, and remove items.
- Checkout and Orders: Place orders and view order history.
- Responsive UI: Modern, dark-mode-ready design using Tailwind CSS.

## Tech Stack

### Frontend (`marketplace-web`)
- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript

### Backend (`marketplace-api`)
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod (validation)

### Database
- PostgreSQL hosted on Neon (Serverless Postgres, AWS Asia Pacific - Singapore region)
- Connection pooling enabled for serverless compatibility

### Infrastructure
- Frontend Hosting: Vercel
- Backend Hosting: Render
- Database Hosting: Neon

## Project Structure

```
marketplace/
├── marketplace-api/        # Express + Prisma backend
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── src/
│   │   ├── controllers/    # Route handlers (auth, cart, orders, products)
│   │   ├── lib/            # JWT and Prisma client helpers
│   │   ├── middleware/     # Auth and role-based access middleware
│   │   ├── routes/         # Express route definitions
│   │   └── index.ts        # Server entry point
│   ├── .env.example
│   └── package.json
│
└── marketplace-web/         # Next.js frontend
    ├── app/                 # App Router pages
    │   ├── cart/
    │   ├── faq/
    │   ├── login/
    │   ├── orders/
    │   ├── products/
    │   ├── seller/
    │   └── signup/
    ├── lib/                 # API client and auth context
    ├── public/              # Static assets
    ├── .env.example
    └── package.json
```

## Local Development

### Prerequisites
- Node.js 18+
- A PostgreSQL database (local or Neon)

### 1. Clone the repository

```bash
git clone https://github.com/IIGGRRIISS/marketplace.git
cd marketplace
```

### 2. Setup the Backend

```bash
cd marketplace-api
npm install
```

Create a `.env` file in `marketplace-api/`:

```env
DATABASE_URL="your_postgres_connection_string"
JWT_SECRET="your_super_secret_key"
PORT=4000
```

Run migrations and start the dev server:

```bash
npx prisma migrate dev
npm run dev
```

### 3. Setup the Frontend

```bash
cd ../marketplace-web
npm install
```

Create a `.env.local` file in `marketplace-web/`:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

Start the frontend:

```bash
npm run dev
```

The app should now be running at http://localhost:3000.

## Deployment Guide

This project is set up as a monorepo. Here is how each part is deployed.

### Database (Neon)

1. Create a project on Neon (https://neon.tech).
2. Copy the connection string from the dashboard. Enable connection pooling for serverless environments.
3. Use this string as `DATABASE_URL` in the backend environment variables.

### Backend (Render)

1. Create a new Web Service on Render.
2. Connect the GitHub repository.
3. Set **Root Directory** to `marketplace-api`.
4. Build Command: `npm install && npx prisma generate`
5. Start Command: `npm start`
6. Add environment variables: `DATABASE_URL`, `JWT_SECRET`.

### Frontend (Vercel)

1. Import the GitHub repository into Vercel.
2. Set **Framework Preset** to Next.js.
3. Set **Root Directory** to `marketplace-web`.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-render-backend-url.onrender.com`
5. Deploy.

## Environment Variables Reference

| Variable | Location | Description |
|---|---|---|
| `DATABASE_URL` | Backend | PostgreSQL connection string (from Neon) |
| `JWT_SECRET` | Backend | Secret key for signing JWTs |
| `PORT` | Backend | Server port (default 4000) |
| `NEXT_PUBLIC_API_URL` | Frontend | Base URL of the backend API |

## License

MIT
