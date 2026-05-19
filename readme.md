# Product Store API

A RESTful API + React frontend for managing products. Built with Node.js, Express, MongoDB, and React 18.

---

## Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
- **Frontend:** React 18, React Router v6, Axios
- **Docs:** Swagger UI (OpenAPI 3.0)

---

## Getting Started

### With Docker (easiest)

```bash
cp backend/.env.example backend/.env
# Set JWT_SECRET in .env

```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |
| Swagger  | http://localhost:5000/api-docs |

---

### Without Docker

**Requirements:** Node.js 18+, MongoDB running locally

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm run dev            # runs on port 5000

# Frontend (separate terminal)
cd frontend
npm install
npm start              # runs on port 3000
```

---

## Environment Variables

Create `backend/.env` from `.env.example`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/productstore
JWT_SECRET=secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

To generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## API Endpoints

All product routes require `Authorization: Bearer <token>`.

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/products                  # paginated, supports search/filter
POST   /api/products
GET    /api/products/categories
GET    /api/products/:id
PUT    /api/products/:id              # creator or admin only
DELETE /api/products/:id              # creator or admin only
```

**GET /api/products query params:**
`page`, `limit`, `search`, `category`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`

---

## Running Tests

```bash
# Backend
cd backend
MONGODB_URI_TEST=mongodb://localhost:27017/productstore_test npm test

# Frontend
cd frontend
npm test
```

---

## Project Structure

```
product-store/
├── backend/
│   ├── src/
│   │   ├── config/       # db.js, swagger.js
│   │   ├── controllers/  # authController.js, productController.js
│   │   ├── middleware/   # auth.js, errorHandler.js
│   │   ├── models/       # User.js, Product.js
│   │   ├── routes/       # auth.js, products.js
│   │   ├── tests/        # api.test.js
│   │   └── index.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/          # axios client
│   │   ├── components/   # ProductCard, ProductForm
│   │   ├── context/      # AuthContext
│   │   ├── hooks/        # useProducts, useDebounce
│   │   ├── pages/        # AuthPage, ProductsPage
│   │   └── tests/
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── docs/
│   └── DESIGN.md
└── docker-compose.yml
```

---

## Notes

- Only the product creator or an admin can edit/delete a product
- Full-text search uses MongoDB's `$text` index across name, description, and category
- Search input on the frontend is debounced (400ms) to avoid hammering the API
- Swagger docs are auto-generated from JSDoc annotations in the controllers