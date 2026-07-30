# 🦷 Trendy API

Backend API for Trendy Dental Store built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**.

---

## 🚀 Features

- RESTful API
- Products CRUD
- Categories
- Search Products
- Pagination
- MongoDB Database
- Cloudinary Image Upload
- Seed Database
- Environment Variables
- TypeScript Support

---

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Cloudinary
- Slugify
- Dotenv

---

## 📂 Project Structure

```
src
│
├── config
│   ├── db.ts
│   └── cloudinary.ts
│
├── controllers
│
├── model
│
├── routes
│
├── seed
│
├── services
│
├── utils
│
└── server.ts
```

---

## ⚙️ Installation

Clone the project

```bash
git clone https://github.com/your-username/trendy-api.git
```

Go to project folder

```bash
cd trendy-api
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=3000

MONGO_URI=YOUR_MONGO_URI

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run development server

```bash
npm run dev
```

---

## 🌱 Seed Database

```bash
npx tsx src/seed/seedProducts.ts
```

This command will:

- Upload images to Cloudinary
- Create Categories
- Insert Products into MongoDB

---

## 📌 API Endpoints

### Products

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

---

## 🔍 Query Parameters

### Search

```
GET /api/products?search=composite
```

### Pagination

```
GET /api/products?page=1&limit=10
```

### Search + Pagination

```
GET /api/products?search=meta&page=2&limit=5
```

---

## 📦 Response Example

```json
{
  "success": true,
  "products": [],
  "page": 1,
  "totalPages": 5,
  "totalProducts": 142
}
```

---

## 📸 Images

Product images are stored on **Cloudinary** and only the image URL is saved in MongoDB.

---

## 👨‍💻 Author

Abdelrhman