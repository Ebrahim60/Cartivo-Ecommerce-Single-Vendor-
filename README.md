# 🛒 Cartivo — Single-Vendor E-commerce Backend

Cartivo is a **MERN stack single-vendor e-commerce backend** built with Node.js, Express.js, MongoDB, and Mongoose.

It provides REST APIs for authentication, product management, order management, reviews, admin analytics, Cloudinary image uploads, and SSLCOMMERZ payment integration.

### 🔗 Live API Documentation

**[Swagger API Docs](https://cartivo-backend-t4gb.onrender.com/api-docs/)** — Explore and test the live Cartivo API.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* HTTP-only cookie support
* Role-based authorization
* User and Admin roles
* Protected routes
* Password hashing with bcrypt
* Authentication rate limiting

### 📦 Product Management

* Create products — Admin
* Update products — Admin
* Delete products — Admin
* Get all products
* Get single product
* Product stock management
* Product validation
* Image upload with Cloudinary
* Multer file handling

### 🛍️ Order Management

* Create orders
* View logged-in user's orders
* Admin can view all orders
* Server-side price calculation
* Stock availability validation
* Duplicate product merging
* Order status management
* Pending, shipped, delivered and cancelled statuses

### ⭐ Reviews & Ratings

* Users can review purchased products
* 1–5 star ratings
* One review per user per product
* Update own review
* Delete own review
* Admin can delete reviews
* Automatic product rating calculation

### 💳 Payment

* SSLCOMMERZ payment gateway
* Sandbox payment support
* Payment initiation
* Success, fail and cancel callbacks
* IPN verification
* Transaction validation
* Payment amount verification
* Automatic stock update after successful payment

### 📊 Admin Analytics

* Total users
* Total orders
* Total products
* Total revenue
* Revenue calculated from paid orders only

### 📚 API Documentation

* Swagger / OpenAPI documentation
* Bearer token authentication
* Interactive API testing
* API schemas and endpoint documentation

### 🛡️ Security & Performance

* Helmet
* CORS
* Express Rate Limit
* Cookie Parser
* Compression
* Morgan request logging
* Centralized error handling
* Joi input validation
* JWT authentication

---

## 🛠️ Tech Stack

| Technology  | Purpose              |
| ----------- | -------------------- |
| Node.js     | Runtime              |
| Express.js  | Backend framework    |
| MongoDB     | Database             |
| Mongoose    | MongoDB ODM          |
| JWT         | Authentication       |
| bcryptjs    | Password hashing     |
| Joi         | Request validation   |
| Cloudinary  | Image storage        |
| Multer      | File upload          |
| SSLCOMMERZ  | Payment gateway      |
| Swagger     | API documentation    |
| Helmet      | Security             |
| Morgan      | HTTP logging         |
| Compression | Response compression |

---

## 📁 Project Structure

```text
Cartivo-Backend/
│
├── config/
│   ├── cloudinary.js
│   ├── db.js
│   └── swagger.js
│
├── controllers/
│   ├── analyticsController.js
│   ├── authControllers.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── productController.js
│   └── reviewController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── rateLimiter.js
│
├── models/
│   ├── orderModel.js
│   ├── productModel.js
│   ├── reviewModel.js
│   └── userModel.js
│
├── routes/
│   ├── analyticsRoutes.js
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── productRoutes.js
│   └── reviewRoutes.js
│
├── services/
│   ├── emailTemplates.js
│   └── sendMail.js
│
├── validation/
│   └── validation.js
│
├── app.js
├── server.js
├── seed.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Ebrahim60/Cartivo-Ecommerce-Single-Vendor-.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false

```

> ⚠️ Never commit your `.env` file or expose your secret credentials.

---

## ▶️ Run the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will run on:

```text
http://localhost:3000
```

Local Swagger documentation:

```text
http://localhost:3000/api-docs
```

For the deployed version:

**[Live Swagger API Docs](https://cartivo-backend-t4gb.onrender.com/api-docs/)**

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint             | Access |
| ------ | -------------------- | ------ |
| POST   | `/api/auth/register` | Public |
| POST   | `/api/auth/login`    | Public |
| GET    | `/api/auth/users`    | Admin  |

### Products

| Method | Endpoint            | Access |
| ------ | ------------------- | ------ |
| GET    | `/api/products`     | Public |
| GET    | `/api/products/:id` | Public |
| POST   | `/api/products`     | Admin  |
| PUT    | `/api/products/:id` | Admin  |
| DELETE | `/api/products/:id` | Admin  |

### Orders

| Method | Endpoint                 | Access |
| ------ | ------------------------ | ------ |
| POST   | `/api/orders`            | User   |
| GET    | `/api/orders/myorders`   | User   |
| GET    | `/api/orders`            | Admin  |
| PUT    | `/api/orders/:id/status` | Admin  |

### Reviews

| Method | Endpoint                          | Access       |
| ------ | --------------------------------- | ------------ |
| POST   | `/api/reviews`                    | User         |
| GET    | `/api/reviews/product/:productId` | Public       |
| PUT    | `/api/reviews/:id`                | Review Owner |
| DELETE | `/api/reviews/:id`                | Owner/Admin  |

### Payment

| Method | Endpoint                | Access           |
| ------ | ----------------------- | ---------------- |
| POST   | `/api/payment/initiate` | User             |
| POST   | `/api/payment/success`  | Payment Callback |
| POST   | `/api/payment/fail`     | Payment Callback |
| POST   | `/api/payment/cancel`   | Payment Callback |
| POST   | `/api/payment/ipn`      | SSLCOMMERZ       |

### Analytics

| Method | Endpoint         | Access |
| ------ | ---------------- | ------ |
| GET    | `/api/analytics` | Admin  |

---

## 🔑 Authentication

Protected endpoints use JWT authentication.

Add the token to the request:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The API also supports an HTTP-only authentication cookie.

---

## 💳 Payment Flow

Cartivo uses **SSLCOMMERZ** for online payments.

```text
Create Order
     ↓
Payment Status: Pending
     ↓
Initiate Payment
     ↓
SSLCOMMERZ Payment Page
     ↓
Customer Completes Payment
     ↓
IPN Verification
     ↓
Transaction Validation
     ↓
Payment Status: Paid
     ↓
Stock Updated
```

For development and testing:

```env
SSLCOMMERZ_IS_LIVE=false
```

---

## ☁️ Cloudinary Image Upload

Product images are handled using:

```text
Multer → Cloudinary → MongoDB
```

The Cloudinary secure URL is stored with the product.

### Upload Details

```text
Field name: image
Maximum file size: 5 MB
Allowed files: Images only
```

---

## 📧 Email System

Cartivo includes an email notification system using **Nodemailer**.

Email functionality is currently **disabled/commented out** in the deployed version because SMTP configuration is not enabled.

The existing email-related code can be enabled in the future by:

1. Uncommenting the email-related code.
2. Configuring the required SMTP credentials.
3. Enabling the corresponding email functionality.

The email system is designed for notifications such as:

* Order creation
* Order shipped
* Order delivered
* Order cancelled
* Email verification / OTP

---

## 🧪 Testing

The API can be tested using:

* Postman
* Swagger UI

Recommended testing flow:

```text
Health Check
   ↓
Authentication
   ↓
Products
   ↓
Orders
   ↓
Payment
   ↓
Reviews
   ↓
Admin Analytics
   ↓
Security Tests
```

### Live API Documentation

**[Open Cartivo Swagger Docs](https://cartivo-backend-t4gb.onrender.com/api-docs/)**

---

## 🌐 Deployment

The backend is deployed on **Render**.

Live API documentation:

**https://cartivo-backend-t4gb.onrender.com/api-docs/**

Production environment variables should be configured through the hosting platform instead of committing them to GitHub.

---

## 🔒 Environment Variables

The project requires the following environment variables:

```text
MONGO_URI
JWT_SECRET
JWT_EXPIRE
COOKIE_EXPIRE

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

SSLCOMMERZ_STORE_ID
SSLCOMMERZ_STORE_PASSWORD
SSLCOMMERZ_IS_LIVE

```

> Email-related environment variables are not currently required because the email system is disabled.

---

## 👨‍💻 Author

### Md Ebrahim Ali

CSE Student & Backend Developer

**Portfolio:** [ebrahimdev](https://ebrahimdev-mu.vercel.app)

**GitHub:** [Ebrahim60](https://github.com/Ebrahim60)

**LinkedIn:** [Md Ebrahim Ali](www.linkedin.com/in/mdebrahimdev)

---

## 📄 License

This project is created for learning, portfolio, and development purposes.
