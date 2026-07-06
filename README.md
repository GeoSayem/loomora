# Loomora & Co. — E-Commerce Platform

A full-stack storefront for a handmade luxury carpet & rug brand, built with
Next.js 15 (App Router), TypeScript, Tailwind CSS, MongoDB/Mongoose, and
dual payment gateways (Stripe + Razorpay).

## What's included

- **Storefront**: homepage (hero, categories, featured/best-seller/new-arrival
  rails, testimonials, newsletter), full catalog with filters/search/sort/
  pagination, product detail pages with size & color selection, cart,
  guest + logged-in checkout, custom rug quote builder with instant pricing,
  contact page with WhatsApp/map.
- **Accounts**: register/login (JWT in an httpOnly cookie), order history,
  wishlist.
- **Admin dashboard**: revenue/analytics, product CRUD, order status &
  tracking updates, customer list, coupon management. Protected by
  middleware + a role check on every admin API route.
- **Payments**: Stripe PaymentIntents (card, and other methods via
  automatic_payment_methods) and Razorpay Orders (UPI, cards, net banking),
  with server-side signature verification and a Stripe webhook as the
  source of truth for payment status.
- **SEO**: dynamic metadata per page, JSON-LD organization schema, a
  database-driven `sitemap.xml`, and `robots.txt`.
- **Security**: bcrypt password hashing, JWT auth, Zod input validation on
  every API route, a simple in-memory rate limiter on auth/checkout/contact,
  and security headers in `next.config.js`.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values, see below
npm run seed                 # creates an admin user, categories, sample products
npm run dev
```

Visit `http://localhost:3000` for the storefront and
`http://localhost:3000/admin/login` for the admin dashboard (credentials
printed by the seed script, or from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
in your `.env.local`).

## Environment variables

See `.env.example` for the full list with comments. You'll need:

- A **MongoDB Atlas** cluster (or self-hosted MongoDB) connection string.
- A **Stripe** account: secret key, publishable key, and a webhook secret
  (create a webhook pointing at `/api/webhooks/stripe` listening for
  `payment_intent.succeeded` and `payment_intent.payment_failed`).
- A **Razorpay** account: key ID and key secret.
- A **Cloudinary** account with an *unsigned* upload preset, used for the
  custom-rug reference image upload.
- Optional SMTP credentials if you wire up `nodemailer` for order/contact
  email notifications (see the TODO in `src/app/api/contact/route.ts`).

## Project structure

```
src/
  app/
    (storefront pages)         products, cart, checkout, account, custom-order, contact
    admin/                      admin dashboard pages (protected)
    api/                        all backend routes (see below)
    layout.tsx, globals.css, sitemap.ts, robots.ts
  components/
    layout/                     Header, Footer, StorefrontChrome
    home/                       Hero, CategoryShowcase, ProductRail, Testimonials, Newsletter
    products/                   ProductCard, Filters, Gallery, Options, Reviews, etc.
    cart/, checkout/, admin/, shared/
  context/                      CartContext, AuthContext, CurrencyContext
  lib/                          db, auth, stripe, razorpay, orders, pricing, validators, rateLimit, utils, seed
  models/                       Mongoose schemas: User, Product, Category, Order, Review, Coupon, CustomOrder, ContactMessage, Newsletter
  middleware.ts                 protects /admin/* routes
  types/                        shared TypeScript interfaces
```

### API routes

| Route | Purpose |
|---|---|
| `POST /api/auth/register`, `/login`, `/logout`, `GET /me` | Authentication |
| `GET/POST /api/products`, `GET/PUT/DELETE /api/products/[slug]` | Product catalog + admin CRUD |
| `GET/POST /api/categories` | Categories |
| `GET /api/orders`, `GET/PATCH /api/orders/[id]` | Order history + admin fulfillment |
| `POST /api/checkout/stripe`, `/checkout/razorpay`, `/checkout/razorpay/verify` | Checkout + payment |
| `POST /api/webhooks/stripe` | Stripe webhook (authoritative payment status) |
| `GET/POST /api/coupons`, `POST /api/coupons/validate` | Coupons |
| `GET/POST /api/reviews` | Product reviews & ratings |
| `GET/POST /api/wishlist` | Wishlist |
| `POST/GET /api/custom-order` | Custom rug quote requests |
| `POST /api/contact` | Contact form |
| `POST /api/newsletter` | Newsletter signup |
| `GET /api/admin/stats`, `/api/admin/customers` | Admin dashboard data |

## Deployment

The app is a standard Next.js 15 project and deploys cleanly to **Vercel**:

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import it in Vercel, set all variables from `.env.example` in the
   project's Environment Variables settings.
3. Point your Stripe webhook at
   `https://your-domain.com/api/webhooks/stripe`.
4. Run `npm run seed` once against your production `MONGODB_URI` (locally,
   with `.env.local` pointed at the prod database) to create the admin
   account and starter catalog — then change the admin password immediately
   via your own profile flow, or directly in MongoDB.
5. Set `NEXT_PUBLIC_SITE_URL` to your real domain so the sitemap and canonical
   URLs are correct.

For a non-Vercel deployment (e.g. a VPS or container), build and run:

```bash
npm run build
npm run start
```

and put it behind a reverse proxy (Nginx/Caddy) with HTTPS.

## Known simplifications (read before launch)

This is a complete, working scaffold — not a finished, audited production
system. Before taking real payments, address these:

- **Rate limiting** is in-memory (`rate-limiter-flexible`'s `RateLimiterMemory`),
  which only limits per server instance. On a multi-instance deployment,
  swap in `RateLimiterRedis` against a shared Redis instance.
- **Email notifications** (order confirmations, contact form alerts) are
  stubbed with a TODO — wire up `nodemailer` with your SMTP credentials.
- **Multi-currency** uses static FX rates in `lib/utils.ts` for display only;
  actual charges are still made in the currency the customer selects at
  checkout, converted at that static rate. For real multi-currency commerce,
  use a live FX feed and consider currency-specific Stripe/Razorpay accounts.
- **GST/shipping rates** in `lib/utils.ts` are placeholders — confirm real
  HSN codes, GST rate, and shipping costs with your accountant/carrier.
- **Live chat** isn't included as a separate widget; a WhatsApp button
  covers the "instant contact" need. Add Intercom/Crisp/Tawk.to if you want
  in-page chat too.
- **Product images** in the sample data are Unsplash placeholders — replace
  with real product photography before launch, and consider Cloudinary
  transformations for responsive sizing.
- **Admin product images** are entered as comma-separated URLs in the admin
  UI; wiring a proper Cloudinary upload widget into that form is a natural
  next step.
- No automated test suite is included — for a store handling real payments,
  add integration tests for the checkout and webhook flows before launch.
