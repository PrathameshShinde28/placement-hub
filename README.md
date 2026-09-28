# 🎯 Placement Hub - AI-Powered Placement Preparation Platform

**Placement Hub** is a comprehensive MERN stack application designed to help students prepare for placements with AI-powered features, resume building, mock interviews, skill gap analysis, and project portfolio management.

## 📋 Features

### ✅ Authentication System
- User Registration & Login with JWT
- Secure password hashing with bcrypt
- Protected routes for authenticated users
- Token-based authorization

### 📊 Dashboard
- User profile overview
- Quick stats (skills, resume score, interviews, projects)
- Quick action buttons for all features

### 📈 Skill Gap Analysis
- Analyze missing skills for target role
- View current vs required skills
- Get AI-recommended courses
- Timeline for skill development

### 📄 Resume Builder
- Create and edit resume sections (experience, education, skills)
- AI-powered resume analysis
- Resume scoring and feedback
- Export-ready format

### 🎤 Mock Interview
- Practice technical, behavioral, and HR interviews
- AI-generated questions and evaluation
- Performance scoring (0-100)
- Detailed feedback and suggestions
- Interview history tracking

### 🤖 AI Chatbot
- Chat with AI assistant for placement guidance
- Get tips on interview preparation
- Learning path recommendations
- 24/7 availability

### 🛠️ Project Portfolio
- Create and manage projects
- Add project details (technologies, links, description)
- Showcase on portfolio
- Full CRUD operations

## 🏗️ Tech Stack

### Frontend
- **React.js** (Vite) - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

### Tools & Libraries
- **Nodemon** - Auto-restart development server
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
placement-hub/
├── client/                          # Frontend (React + Vite)
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── assets/                  # Images, fonts, etc.
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   ├── Sidebar.jsx         # Sidebar navigation
│   │   │   └── ProtectedRoute.jsx  # Route protection wrapper
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SkillGap.jsx
│   │   │   ├── ResumeBuilder.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── MockInterview.jsx
│   │   │   └── Projects.jsx
│   │   ├── services/
│   │   │   └── api.js              # Axios API instance & endpoints
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
│
├── server/                          # Backend (Node + Express)
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── Project.js
│   │   ├── Interview.js
│   │   └── Role.js
│   ├── controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── skillController.js
│   │   ├── resumeController.js
│   │   ├── chatController.js
│   │   ├── interviewController.js
│   │   └── projectController.js
│   ├── routes/                      # API endpoints
│   │   ├── authRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── projectRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT protection
│   │   └── errorMiddleware.js      # Error handling
│   ├── utils/
│   │   └── generateToken.js        # JWT token generation
│   ├── server.js                    # Main server file
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (.env):**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/placement-hub
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   OPENAI_API_KEY=sk_your_openai_key_here
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Run the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   App runs on `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Skills
- `GET /api/skills/gap-analysis` - Get skill gap analysis (protected)
- `POST /api/skills/add` - Add skill (protected)
- `POST /api/skills/remove` - Remove skill (protected)

### Resume
- `POST /api/resume/create` - Create resume (protected)
- `GET /api/resume` - Get user resume (protected)
- `PUT /api/resume/update` - Update resume (protected)
- `POST /api/resume/analyze` - Analyze resume with AI (protected)

### Chat
- `POST /api/chat/message` - Send message to chatbot (protected)
- `GET /api/chat/history` - Get chat history (protected)

### Interview
- `POST /api/interview/start` - Start mock interview (protected)
- `POST /api/interview/submit-answer` - Submit interview answer (protected)
- `GET /api/interview/history` - Get interview history (protected)

### Projects
- `POST /api/projects/create` - Create project (protected)
- `GET /api/projects` - Get user projects (protected)
- `PUT /api/projects/:projectId` - Update project (protected)
- `DELETE /api/projects/:projectId` - Delete project (protected)

## 🔐 Authentication Flow

1. User registers/logs in with email and password
2. Password is hashed using bcrypt
3. JWT token is generated and returned
4. Token is stored in localStorage
5. All subsequent requests include the token in Authorization header
6. Token is verified by `authMiddleware` on protected routes

## 🎯 Key Features Implementation

### Protected Routes
Routes are protected using `ProtectedRoute` component that checks authentication status and redirects to login if needed.

### API Interceptor
Axios interceptor automatically adds JWT token to all API requests from localStorage.

### Error Handling
Centralized error handling middleware processes all errors and returns consistent response format.

### Responsive Design
Tailwind CSS ensures the app works perfectly on desktop, tablet, and mobile devices.

## 🔮 Future Enhancements

- [ ] OpenAI API integration for actual AI-powered features
- [ ] Resume PDF export
- [ ] Video recording for interview practice
- [ ] Real-time notifications
- [ ] Social media sharing
- [ ] Placement statistics dashboard
- [ ] Mentor/student matching
- [ ] Payment integration for premium features
- [ ] Mobile app (React Native)
- [ ] Real-time chat with mentors

## 📝 Sample User Flow

1. **User Registration** → Create account with email and target role
2. **Dashboard** → View profile and quick stats
3. **Skill Gap Analysis** → Identify missing skills and get course recommendations
4. **Resume Building** → Create resume and get AI feedback
5. **Mock Interview** → Practice interviews and get evaluated
6. **Projects Showcase** → Add projects to portfolio
7. **AI Chat** → Get personalized guidance anytime

## 🛠️ Development

### Running Both Frontend & Backend Simultaneously

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

Then visit `http://localhost:3000`

## 📚 Learning Resources

- [React.js Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [JWT Guide](https://jwt.io)
- [Mongoose ODM](https://mongoosejs.com)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## ✨ Acknowledgments

- Inspired by placement preparation needs
- Built with modern web technologies
- Community-driven development

## 📞 Support

For issues, bugs, or feature requests, please create an issue in the repository.

---

**Happy Coding! 🚀**

Made with ❤️ for students preparing for placements.
