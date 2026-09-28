# 📁 Placement Hub - Complete Directory Tree

```
placement-hub/
│
├── 📖 Documentation Files
│   ├── README.md                          # Main project documentation
│   ├── QUICKSTART.md                      # 5-minute setup guide
│   ├── API_DOCS.md                        # Complete API documentation
│   ├── CONTRIBUTING.md                    # Contribution guidelines
│   ├── DEPLOYMENT.md                      # Production deployment guide
│   └── PROJECT_SETUP_COMPLETE.md          # Setup completion summary
│
├── 🖥️ server/                             # Backend (Node.js + Express)
│   │
│   ├── ⚙️ Configuration
│   │   ├── config/
│   │   │   └── db.js                      # MongoDB connection setup
│   │   ├── .env                           # Environment variables (prod)
│   │   ├── .env.example                   # Environment variables template
│   │   └── .gitignore
│   │
│   ├── 📦 Data Models
│   │   └── models/
│   │       ├── User.js                    # User schema with password hashing
│   │       ├── Resume.js                  # Resume schema
│   │       ├── Project.js                 # Project schema
│   │       ├── Interview.js               # Mock interview schema
│   │       └── Role.js                    # Job role schema
│   │
│   ├── 🎯 Business Logic
│   │   └── controllers/
│   │       ├── authController.js          # Register, login, profile
│   │       ├── skillController.js         # Skill management
│   │       ├── resumeController.js        # Resume operations
│   │       ├── chatController.js          # Chatbot responses
│   │       ├── interviewController.js     # Interview management
│   │       └── projectController.js       # Project CRUD
│   │
│   ├── 🛣️ API Routes
│   │   └── routes/
│   │       ├── authRoutes.js              # /api/auth endpoints
│   │       ├── skillRoutes.js             # /api/skills endpoints
│   │       ├── resumeRoutes.js            # /api/resume endpoints
│   │       ├── chatRoutes.js              # /api/chat endpoints
│   │       ├── interviewRoutes.js         # /api/interview endpoints
│   │       └── projectRoutes.js           # /api/projects endpoints
│   │
│   ├── 🔒 Security & Error Handling
│   │   └── middleware/
│   │       ├── authMiddleware.js          # JWT verification
│   │       └── errorMiddleware.js         # Error handling
│   │
│   ├── 🛠️ Utilities
│   │   └── utils/
│   │       └── generateToken.js           # JWT token generation
│   │
│   ├── 🚀 Main Server
│   │   └── server.js                      # Express app setup & initialization
│   │
│   └── 📋 Package Management
│       └── package.json                   # Dependencies & scripts
│
├── 🎨 client/                             # Frontend (React + Vite)
│   │
│   ├── 📄 Static Files
│   │   ├── public/                        # Static assets
│   │   ├── index.html                     # HTML entry point
│   │   └── .gitignore
│   │
│   ├── 💻 React Source Code
│   │   └── src/
│   │       │
│   │       ├── 🎯 Main Components
│   │       │   ├── App.jsx                # Main app component with routing
│   │       │   ├── main.jsx               # React DOM entry point
│   │       │   └── index.css              # Global styles
│   │       │
│   │       ├── 🧩 Reusable Components
│   │       │   └── components/
│   │       │       ├── Navbar.jsx         # Top navigation with logout
│   │       │       ├── Sidebar.jsx        # Side navigation menu
│   │       │       └── ProtectedRoute.jsx # Route protection wrapper
│   │       │
│   │       ├── 📄 Page Components
│   │       │   └── pages/
│   │       │       ├── Login.jsx          # User login page
│   │       │       ├── Register.jsx       # User registration page
│   │       │       ├── Dashboard.jsx      # Main dashboard with stats
│   │       │       ├── SkillGap.jsx       # Skill gap analysis page
│   │       │       ├── ResumeBuilder.jsx  # Resume creation & editing
│   │       │       ├── Chatbot.jsx        # AI chatbot interface
│   │       │       ├── MockInterview.jsx  # Interview practice
│   │       │       └── Projects.jsx       # Project portfolio
│   │       │
│   │       ├── 🌐 API Integration
│   │       │   └── services/
│   │       │       └── api.js             # Axios instance & API calls
│   │       │
│   │       ├── 📦 State Management
│   │       │   └── context/
│   │       │       └── AuthContext.jsx    # Authentication context
│   │       │
│   │       ├── 🎨 Assets
│   │       │   └── assets/                # Images, fonts, etc.
│   │       │
│   │       └── .env.example               # Environment variables template
│   │
│   ├── ⚙️ Build & Styling Configuration
│   │   ├── vite.config.js                 # Vite build configuration
│   │   ├── tailwind.config.js             # Tailwind CSS configuration
│   │   ├── postcss.config.js              # PostCSS configuration
│   │   └── package.json                   # Dependencies & scripts
│   │
│   └── 📋 Package Management
│       └── package.json                   # Node dependencies
│
└── 📜 Root Files
    ├── .gitignore                         # Git ignore rules
    ├── README.md                          # Main documentation
    ├── PROJECT_SETUP_COMPLETE.md          # Setup completion summary
    └── DIRECTORY_TREE.md                  # This file
```

---

## 📊 File Statistics

### Backend Files
```
config/               1 file
models/               5 files
controllers/          6 files
routes/               6 files
middleware/           2 files
utils/                1 file
Root server files:    1 file (server.js)
Config files:         3 files (.env, .env.example, .gitignore)
─────────────────────────────
Total Backend:        25 files
```

### Frontend Files
```
components/           3 files
pages/                8 files
services/             1 file
context/              1 file
assets/               (directory)
Root src files:       3 files (App.jsx, main.jsx, index.css)
Config files:         4 files (vite, tailwind, postcss, .env.example)
Index files:          1 file (index.html)
─────────────────────────────
Total Frontend:       21 files
```

### Documentation Files
```
README.md
QUICKSTART.md
API_DOCS.md
CONTRIBUTING.md
DEPLOYMENT.md
PROJECT_SETUP_COMPLETE.md
DIRECTORY_TREE.md
─────────────────────────────
Total Documentation: 7 files
```

### Total Project Files: 53+ files

---

## 🗂️ Directory Purpose Guide

### Backend Structure

| Directory | Purpose |
|-----------|---------|
| `config/` | Database connection & configurations |
| `models/` | Mongoose schemas for MongoDB |
| `controllers/` | Business logic for each feature |
| `routes/` | API endpoint definitions |
| `middleware/` | Request processing (auth, errors) |
| `utils/` | Helper functions & utilities |

### Frontend Structure

| Directory | Purpose |
|-----------|---------|
| `components/` | Reusable UI components |
| `pages/` | Full page components |
| `services/` | API client & HTTP utilities |
| `context/` | React Context for state |
| `assets/` | Images, fonts, static files |

---

## 🔗 Dependency Map

### Backend Dependencies
```
express.js
  ├── mongoose (MongoDB ODM)
  ├── bcrypt (Password hashing)
  ├── jsonwebtoken (JWT)
  ├── cors (Cross-origin)
  ├── dotenv (Env variables)
  └── axios (HTTP client)
```

### Frontend Dependencies
```
react
  ├── react-router-dom (Routing)
  ├── axios (HTTP client)
  └── tailwindcss (Styling)
```

---

## 🔄 Data Flow

```
User Registration/Login
    ↓
authController → User Model → MongoDB
    ↓
JWT Token Generated
    ↓
Token Stored in localStorage
    ↓
Axios Interceptor adds token to requests
    ↓
Protected Routes Verify token
    ↓
Middleware validates and allows access
```

---

## 📡 API Route Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── GET /me
│   └── PUT /profile
├── /skills
│   ├── GET /gap-analysis
│   ├── POST /add
│   └── POST /remove
├── /resume
│   ├── POST /create
│   ├── GET /
│   ├── PUT /update
│   └── POST /analyze
├── /chat
│   ├── POST /message
│   └── GET /history
├── /interview
│   ├── POST /start
│   ├── POST /submit-answer
│   └── GET /history
└── /projects
    ├── POST /create
    ├── GET /
    ├── PUT /:projectId
    └── DELETE /:projectId
```

---

## 🎯 Component Hierarchy

```
App.jsx (Routes)
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   └── User Menu
├── Layout (Pages + Sidebar)
│   ├── Sidebar
│   │   └── Menu Items
│   └── Page Component
│       ├── Auth Pages
│       │   ├── Login
│       │   └── Register
│       ├── Dashboard
│       ├── SkillGap
│       ├── ResumeBuilder
│       ├── Chatbot
│       ├── MockInterview
│       └── Projects
└── ProtectedRoute (Wrapper)
```

---

## 🔐 Authentication Flow

```
1. User Input (Register/Login)
   ↓
2. Frontend Form Submit
   ↓
3. API Call with Credentials
   ↓
4. Backend Receives Request
   ↓
5. Password Hashing (bcrypt)
   ↓
6. JWT Token Generation
   ↓
7. Token Returned to Frontend
   ↓
8. Token Stored in localStorage
   ↓
9. Axios Interceptor Adds Token
   ↓
10. Protected Routes Allow Access
```

---

## 🚀 Development Workflow

```
Start Development Servers
    │
    ├── Terminal 1: cd server && npm run dev
    │   └── nodemon watches changes, auto-restarts
    │
    └── Terminal 2: cd client && npm run dev
        └── Vite dev server with HMR

    ↓

Make Changes in Your Editor
    │
    ├── Frontend: Vite recompiles (fast!)
    ├── Backend: Nodemon restarts server
    │
    ↓

Test at http://localhost:3000
```

---

## 📦 Dependencies List

### Backend (`server/package.json`)
- express
- mongoose
- bcrypt
- jsonwebtoken
- cors
- dotenv
- axios
- nodemon (dev)

### Frontend (`client/package.json`)
- react
- react-dom
- react-router-dom
- axios
- tailwindcss (dev)
- vite (dev)
- @vitejs/plugin-react (dev)

---

## ✅ Pre-configured Features

✓ **JWT Authentication** - Secure user sessions
✓ **Password Hashing** - bcrypt encryption
✓ **CORS** - Cross-origin requests allowed
✓ **Error Handling** - Centralized error middleware
✓ **Tailwind CSS** - Utility-first styling
✓ **React Router** - Client-side navigation
✓ **Axios Interceptors** - Auto token attachment
✓ **Protected Routes** - Route-level authentication
✓ **Context API** - State management
✓ **ES6+ Syntax** - Modern JavaScript

---

## 🔍 Quick File Lookup

### Need to add auth endpoint?
→ Edit `server/routes/authRoutes.js` and `server/controllers/authController.js`

### Need to create new page?
→ Create file in `client/src/pages/` and add route to `client/src/App.jsx`

### Need new database model?
→ Create schema in `server/models/` and use in controller

### Need to style component?
→ Use Tailwind classes or edit `client/src/index.css`

### Need to make API call?
→ Use functions from `client/src/services/api.js`

---

## 📈 Scaling Considerations

- Add TypeScript for type safety
- Implement Redux for complex state
- Add unit & integration tests
- Setup CI/CD pipeline
- Add logging system (Winston/Morgan)
- Implement caching (Redis)
- Add rate limiting
- Setup database indexing
- Use environment-specific configs

---

**This is your complete, production-ready MERN stack project!** 🚀

Start developing and scale based on your needs.

---

Generated: April 23, 2024
Project: Placement Hub - AI-Powered Placement Preparation
Status: ✅ Complete & Ready to Run
