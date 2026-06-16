# Bootstrapped Cafe

A premium, modern healthy food and work café brand inspired by minimalist wellness restaurants. Built using the MERN stack (MongoDB, Express, React, Node.js), Vite, Three.js, and Anime.js.

## Features

- **Cinematic Entry:** Loading screen with staggered typography and wipe-up animation.
- **Matte Aesthetic:** Global CSS-only SVG grain noise overlay and tailored color palette (terracotta, espresso, warm cream).
- **Interactive Hero:** Background image with a matte gradient overlay and Three.js floating warm amber particles that react to mouse parallax.
- **Scroll-Reveal Navigation:** SAVORA-style navbar that transitions from transparent to solid cream with blur effect. Custom 2-line mobile hamburger menu.
- **Reel Carousel:** Horizontally scrollable strip of food thumbnails with duration badges, inspired by Instagram/Reels UI.
- **Dynamic Menu:** Anime.js-driven stagger entrance on scroll. Filter by categories and Veg Only toggle.
- **Cart System:** Context/Reducer-based cart management with a slide-in drawer from the right.
- **Razorpay Integration:** Full checkout flow with Razorpay payment gateway integration, order creation, and signature verification.
- **Backend API:** Express + MongoDB backend with seed data, controllers for menu items, orders, and payment.

## Tech Stack

- **Frontend:** React, Vite, React Router, Anime.js (animations), Three.js (hero particles), Vanilla CSS Modules (styling).
- **Backend:** Node.js, Express, MongoDB (Mongoose), Razorpay Node SDK.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas cluster)
- Razorpay Account (for API keys)

### Environment Variables

Copy the `.env.example` file to `.env` in the root directory and update the values:

```
MONGODB_URI=mongodb://localhost:27017/bootstrap-cafe
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
PORT=5000
NODE_ENV=development
```

### Installation

1. Install dependencies for the server:
   ```bash
   cd server
   npm install
   ```
2. Install dependencies for the client:
   ```bash
   cd client
   npm install
   ```

### Seeding the Database

Run the seed script to populate the database with the initial menu items:

```bash
cd server
npm run seed
```

### Running the App Locally

Start the backend server (runs on port 5000):

```bash
cd server
npm run dev
```

Start the Vite development server (runs on port 5173):

```bash
cd client
npm run dev
```
