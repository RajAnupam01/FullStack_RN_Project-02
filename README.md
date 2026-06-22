# 🚀 Know Space

> A modern Q&A platform inspired by Quora and Stack Overflow, built with a scalable backend architecture and a mobile-first approach.

Know Space enables users to ask questions, post answers, engage through voting and comments, follow other users, receive notifications, and build reputation within a knowledge-sharing community.

---

## 📌 Project Status

✅ Backend Development Completed
✅ PostgreSQL Database Deployed on Neon
✅ Media Storage Integrated with Cloudinary
✅ Backend API Deployed on Render
✅ Swagger API Documentation Implemented
🚧 React Native Mobile App In Development

---

# ✨ Features

## 🔐 Authentication & Security

* JWT Authentication
* Access & Refresh Tokens
* Token Rotation
* Protected Routes
* Password Validation
* Ownership-based Authorization
* Rate Limiting
* Centralized Error Handling

---

## 👤 User Management

* User Registration & Login
* Profile Management
* Avatar Upload & Deletion
* Follower & Following Statistics
* Reputation Tracking

---

## 🧠 Questions

* Create Questions
* Update Questions
* Delete Questions
* SEO-Friendly Slugs
* Search Questions
* Filter by Tags
* Filter by Status
* Accepted Answers

---

## ✍️ Answers

* Create Answers
* Update Answers
* Delete Answers
* Image Upload Support
* Accepted Answer Workflow
* Reputation Updates

---

## 💬 Comments

* Question Comments
* Answer Comments
* Comment Notifications

---

## 👍 Voting System

* Upvote
* Downvote
* Remove Vote
* Vote Toggle Logic
* Reputation Calculation

---

## 🔖 Bookmarks

* Save Questions
* Remove Bookmarks
* Retrieve Bookmarked Questions
* Composite Key Constraints

---

## 👥 Follow System

* Follow Users
* Unfollow Users
* Followers & Following Lists
* Follow Notifications

---

## 🔔 Notifications

Centralized notification system for:

* Answers
* Comments
* Votes
* Follows
* Accepted Answers

---

## 📊 Reputation System

Dynamic reputation updates based on community interactions.

Examples:

* Answer Upvoted → +5
* Answer Downvoted → -5

---

# 🏗️ Tech Stack

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL
* Prisma ORM
* Neon Database

## Caching

* Redis

## File Storage

* Cloudinary

## Authentication

* JWT (Access & Refresh Tokens)

## Validation

* VineJS

## API Documentation

* Swagger/OpenAPI

## Deployment

* Render

---

# ☁️ System Architecture

```text
                    ┌──────────────────┐
                    │ React Native App │
                    └─────────┬────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Node.js + Express│
                    │  REST API        │
                    │    (Render)      │
                    └──────┬─────┬─────┘
                           │     │
                           │     │
                           ▼     ▼
                    ┌────────┐ ┌───────────┐
                    │ Redis  │ │Cloudinary │
                    │ Cache  │ │  Storage  │
                    └────────┘ └───────────┘
                           │
                           ▼
                ┌────────────────────────┐
                │ PostgreSQL (Neon)      │
                │ Managed via Prisma ORM │
                └────────────────────────┘
```

---

# 📂 Repository Structure

```bash
Know-Space/
│
├── backend/
│
└── frontend/
```

---

# 📂 Backend Structure

```bash
backend/
│
├── config/
│   ├── globalLimiter.js
│   └── queryBuilder.js
│
├── controllers/
│   ├── answer.controller.js
│   ├── auth.controller.js
│   ├── bookmark.controller.js
│   ├── follow.controller.js
│   ├── notification.controller.js
│   ├── question.controller.js
│   ├── user.controller.js
│   └── vote.controller.js
│
├── docs/
│   ├── swagger.js
│   └── endpoint documentation files
│
├── generated/
│
├── helper/
│   └── authHelper.js
│
├── lib/
│   └── prisma.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── multer.js
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── routes/
│   ├── answer.routes.js
│   ├── auth.routes.js
│   ├── bookmark.routes.js
│   ├── follow.routes.js
│   ├── notification.routes.js
│   ├── question.routes.js
│   ├── user.routes.js
│   └── vote.routes.js
│
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── AsyncHandler.js
│   └── cloudinary.js
│
├── validations/
│   ├── auth.validation.js
│   └── profile.validation.js
│
├── app.js
├── package.json
├── package-lock.json
└── prisma.config.ts
```

---

# 🔄 Request Flow

```text
Client
  │
  ▼
Routes
  │
  ▼
Middlewares
(Auth / Validation / Rate Limiting)
  │
  ▼
Controllers
  │
  ▼
Prisma ORM
  │
  ▼
PostgreSQL Database
```

---

# 🗄️ Database Design

The database is designed using PostgreSQL and Prisma ORM.

Core entities include:

* Users
* Questions
* Answers
* Comments
* Votes
* Bookmarks
* Follows
* Notifications
* Tags
* Reputation Tracking

### ER Diagram

> Add ER Diagram Screenshot Here

---

# 🔒 Security Features

* JWT Authentication
* Refresh Token Rotation
* Route Protection
* Ownership Validation
* Input Validation using VineJS
* Rate Limiting
* Secure File Uploads
* Centralized Error Handling
* Prisma Transactions

---

# ⚡ Performance Optimizations

* Redis Caching Layer
* Query Optimization
* Database Indexing
* Efficient Prisma Queries
* Pagination Support
* Selective Data Fetching

---

# 📖 API Documentation

Swagger documentation is included for all major modules.

After running the application:

```bash
http://localhost:PORT/api-docs
```

Documented APIs include:

* Authentication
* Users
* Questions
* Answers
* Comments
* Votes
* Bookmarks
* Follows
* Notifications

---

# 🛠️ Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

REDIS_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# 🚀 Local Setup

### Clone Repository

```bash
git clone https://github.com/yourusername/know-space.git
```

### Navigate to Backend

```bash
cd know-space/backend
```

### Install Dependencies

```bash
npm install
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate deploy
```

### Start Development Server

```bash
npm run dev
```

---

# 🌐 Deployment

### Backend Hosting

* Render

### Database

* Neon PostgreSQL

### Media Storage

* Cloudinary

### Cache Layer

* Redis

---

# 🚧 Future Improvements

* Role Based Access Control (RBAC)
* Admin Dashboard
* Real-Time Notifications
* Trending Questions Feed
* Search Optimization
* Mobile Application Completion
* AI-Powered Question Suggestions

---

# 📸 Screenshots

### Swagger Documentation

> Add Screenshot Here

### ER Diagram

> Add Screenshot Here

### Architecture Diagram

> Add Screenshot Here

---

# 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

If you find an issue or want to improve the project:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

# 👨‍💻 Author

**Anupam Raj**

Crafting modern Web & Mobile Applications with React.js, React Native, Expo, TypeScript, Node.js, Express.js, PostgreSQL, Prisma, and MongoDB.

---

# ⭐ Support

If you found this project useful, consider giving it a star ⭐ and sharing your feedback.
