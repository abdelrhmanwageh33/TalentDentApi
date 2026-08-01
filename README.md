# 🦷 TalentDent API

A RESTful API built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **Mongoose** for managing dental products and orders.

---

## 🚀 Live Demo

Base URL

```
https://talent-dent-api.vercel.app/api
```

---

# ✨ Features

- 📦 Products CRUD
- 📂 Categories CRUD
- 🛒 Orders CRUD
- 🔍 Search Products
- 📄 Pagination
- 🎯 Filter by Category
- 💰 Filter by Price Range
- ⭐ Featured Products
- 🔥 Best Seller Products
- 🆕 New Arrival Products
- ↕️ Sorting
- ☁️ Cloudinary Image Hosting
- 🌐 RESTful API
- 📱 Frontend Ready

---

# 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Cloudinary
- Slugify
- Dotenv

---

# 📦 Installation

```bash
git clone https://github.com/abdelrhmanwageh33/TalentDentApi.git

cd TalentDentApi

npm install
```

Create a `.env` file

```env
PORT=3000

MONGO_URI=your_mongodb_uri

CLOUDINARY_CLOUD_NAME=xxxxx

CLOUDINARY_API_KEY=xxxxx

CLOUDINARY_API_SECRET=xxxxx
```

Run development server

```bash
npm run dev
```

Seed Database

```bash
npx tsx src/seed/seedProducts.ts
```

---

# 📚 API Endpoints

## Products

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /products | Get all products |
| GET | /products/:slug | Get single product |
| POST | /products | Create product |
| PUT | /products/:id | Update product |
| DELETE | /products/:id | Delete product |

---

## Categories

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /categories | Get all categories |
| GET | /categories/:slug | Get category |
| POST | /categories | Create category |
| PUT | /categories/:id | Update category |
| DELETE | /categories/:id | Delete category |

---

## Orders

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /orders | Create order |
| GET | /orders | Get all orders |
| GET | /orders/:id | Get single order |
| PATCH | /orders/:id | Update order status |
| DELETE | /orders/:id | Delete order |

---

# 🔍 Query Parameters

### Search

```
GET /products?keyword=meta
```

### Pagination

```
GET /products?page=2&limit=8
```

### Category

```
GET /products?category=bond
```

### Price Range

```
GET /products?minPrice=100&maxPrice=500
```

### Featured

```
GET /products?featured=true
```

### Best Seller

```
GET /products?isBestSeller=true
```

### New Arrival

```
GET /products?isNewArrival=true
```

### Sorting

```
GET /products?sort=price
```

```
GET /products?sort=-price
```

```
GET /products?sort=name
```

```
GET /products?sort=newest
```

---

# 📁 Project Structure

```
src
│
├── config
├── controllers
├── model
├── routes
├── seed
├── interfaces
├── utils
└── app.ts
```

---

# 👨‍💻 Author

**Abdelrhman Wageh**

GitHub

https://github.com/abdelrhmanwageh33

LinkedIn

https://www.linkedin.com/in/abdelrhman-wageh/

---

## ⭐ If you like this project, don't forget to give it a Star!