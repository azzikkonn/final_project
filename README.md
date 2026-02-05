# Photography Portfolio Website API

A RESTful API for a Photography Portfolio Website built with Node.js, Express.js, and MongoDB.

## 📋 Project Overview

This API allows photographers to:
- Register and authenticate users
- Manage their photo portfolios (CRUD operations)
- Organize photos by categories and tags
- Update their user profiles

## 🛠 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Environment Variables**: dotenv

## 📁 Project Structure

```
photography-portfolio-api/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── userController.js   # User profile logic
│   └── photoController.js  # Photo CRUD logic
├── middleware/
│   ├── authMiddleware.js   # JWT verification
│   ├── errorMiddleware.js  # Global error handler
│   └── validateMiddleware.js # Request validation
├── models/
│   ├── User.js             # User schema
│   └── Photo.js            # Photo schema
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   ├── userRoutes.js       # User endpoints
│   └── photoRoutes.js      # Photo endpoints
├── validators/
│   ├── authValidator.js    # Auth validation schemas
│   ├── userValidator.js    # User validation schemas
│   └── photoValidator.js   # Photo validation schemas
├── .env                    # Environment variables
├── .env.example            # Example env file
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── server.js               # Entry point
└── README.md               # Documentation
```

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd photography-portfolio-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/photography_portfolio
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   ```

4. **Start MongoDB** (if using locally)
   ```bash
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Server will be running at**: `http://localhost:5000`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

---

### 🔐 Authentication Routes (Public)

#### Register a New User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "photographer1",
  "email": "photo@example.com",
  "password": "mypassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "username": "photographer1",
    "email": "photo@example.com",
    "bio": "",
    "avatar": "",
    "createdAt": "..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "photo@example.com",
  "password": "mypassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "...",
    "username": "photographer1",
    "email": "photo@example.com",
    "bio": "",
    "avatar": ""
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 👤 User Routes (Private - Requires Token)

> **Note**: Include token in header: `Authorization: Bearer <token>`

#### Get User Profile
```http
GET /api/users/profile
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "photographer1",
    "email": "photo@example.com",
    "bio": "Professional photographer",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### Update User Profile
```http
PUT /api/users/profile
```

**Request Body:**
```json
{
  "username": "newusername",
  "bio": "Updated bio text",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "...",
    "username": "newusername",
    "email": "photo@example.com",
    "bio": "Updated bio text",
    "avatar": "https://example.com/new-avatar.jpg"
  }
}
```

---

### 📷 Photo Routes (Private - Requires Token)

> **Note**: Include token in header: `Authorization: Bearer <token>`

#### Create a New Photo
```http
POST /api/photos
```

**Request Body:**
```json
{
  "title": "Sunset Over Mountains",
  "description": "Beautiful sunset captured at Rocky Mountains",
  "imageUrl": "https://example.com/photos/sunset.jpg",
  "category": "landscape",
  "tags": ["sunset", "mountains", "nature"]
}
```

**Categories Available:**
- `landscape`, `portrait`, `street`, `nature`, `architecture`, `wildlife`, `macro`, `abstract`, `other`

**Response (201):**
```json
{
  "success": true,
  "message": "Photo created successfully",
  "data": {
    "_id": "...",
    "title": "Sunset Over Mountains",
    "description": "Beautiful sunset captured at Rocky Mountains",
    "imageUrl": "https://example.com/photos/sunset.jpg",
    "category": "landscape",
    "tags": ["sunset", "mountains", "nature"],
    "user": "...",
    "likes": 0,
    "createdAt": "..."
  }
}
```

---

#### Get All User Photos
```http
GET /api/photos
```

**Query Parameters:**
- `category` (optional): Filter by category
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page

**Example:**
```http
GET /api/photos?category=landscape&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "total": 15,
  "totalPages": 2,
  "currentPage": 1,
  "data": [
    {
      "_id": "...",
      "title": "Sunset Over Mountains",
      "category": "landscape",
      ...
    }
  ]
}
```

---

#### Get Single Photo
```http
GET /api/photos/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Sunset Over Mountains",
    "description": "...",
    "imageUrl": "...",
    "category": "landscape",
    "tags": ["sunset", "mountains"],
    "user": {
      "_id": "...",
      "username": "photographer1",
      "avatar": "..."
    },
    "likes": 0,
    "createdAt": "..."
  }
}
```

---

#### Update Photo
```http
PUT /api/photos/:id
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "nature"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Photo updated successfully",
  "data": { ... }
}
```

---

#### Delete Photo
```http
DELETE /api/photos/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Photo deleted successfully"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Photo not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Private endpoints require valid JWT token
- **Input Validation**: All requests validated using Joi
- **Global Error Handling**: Centralized error management

---

## 👨‍💻 Author

**Aziz**

---

## 📄 License

This project is licensed under the MIT License.
