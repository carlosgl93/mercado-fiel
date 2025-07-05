# Prompt Context - Mercado Fiel Web App

## General Overview

Mercado Fiel is a multi-user B2B/B2C marketplace platform that connects users (buyers / compradores) with providers (sellers / proveedores), allowing for product browsing, purchases, subscriptions, reviews, real-time chat, and advanced features such as collective purchasing and co-ownership of products.

The app is built using:

- **Frontend**: React.js (not Next.js), TanStack Query, Material UI (MUI), and TypeScript, All text the user will see MUST BE IN SPANISH CHILE including currency format.
- **State Management**: TanStack Query for data fetching and caching, Recoil for local state
- **Backend/API**: Node.js with Express, deployed on Google Cloud Run
- **Database/Auth/Storage**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
- **Payments**: Transbank Webpay Plus (Chile)
- **Analytics**: Google Analytics 4 + Google Tag Manager
- **DevOps**: GCP

---

## User Roles

1. **User (Buyer)**: Can browse products, join collective purchases, invest in co-ownership, write reviews, and communicate with providers.
2. **Provider (Seller)**: Can manage their profile, list products, view analytics (via embedded PowerBI), and receive payments.
3. **Admin**: Can moderate users, providers, products, collective purchases, and co-ownership projects.

---

## Modules & Features

### 1. Authentication

- Email/password + OAuth via Supabase Auth
- Session handling via TanStack Query
- Route protection on client-side

### 2. Static Pages

- Home, Contact, About
- Contact form will be sent via email through a firebase function

### 3. Product Management

- Products with volume-based pricing
- Reviews
- Role-based permissions (user vs. provider)

### 4. Catalog & Search

- Filterable product catalog
- Pagination or infinite scroll via TanStack Query

### 5. User Module

- Profile view/edit
- Dashboard with recent/frequent purchases
- Public profile with review history

### 6. Provider Module

- Profile management
- Product management
- Embedded PowerBI analytics
- Review display

### 7. Real-Time Chat

- Role-based access
- Supabase Realtime or Socket.io (WebSocket fallback)
- Read receipts, notifications

### 8. Payments

- Webpay Plus for subscriptions and one-time payments
- Manual workaround for recurring payments using scheduler
- Webhook + verification logic

### 9. Collective Purchases

- Providers publish bulk purchase campaigns
- Users contribute towards a goal
- Real-time progress tracking and campaign closing logic

### 10. Product Co-Ownership

- Providers publish investment opportunities
- Users invest and receive proportional benefits
- UI for viewing investments, history, and alerts

### 11. Admin & Backoffice

- Dashboard with moderation tools
- Management of users, providers, products, campaigns, and co-ownership
- Access control via Supabase Roles or Claims
- Custom views for analytics and control

---

## API Notes

- All backend is built on Express with tRPC for typed communication
- Auth handled via Supabase JWTs
- Deployed on Google Cloud Run
- REST or tRPC queries exposed to TanStack Query

---

## Important Constraints

- Static frontend hosted on AWS S3, behind CloudFront
- Files/media uploads go to Supabase Storage
- The project follows a clean modular structure with emphasis on scalability and separation of concerns

---

## Suggestions for Copilot

- Prioritize code completions for React components, form logic, data fetching with TanStack Query, Supabase client usage, and Express route handling.
- For backend, assume tRPC or REST handlers connected to Supabase queries/mutations.
- For UI, use MUI or minimalist custom styling as needed.
