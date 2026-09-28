# 🚀 Quick Start Guide

## Prerequisites
- Node.js v14 or higher
- npm or yarn
- MongoDB (local or cloud)

## 1️⃣ Backend Setup (5 minutes)

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
nano .env

# Start MongoDB (if using local)
mongod

# Run development server
npm run dev
```

✅ Backend running on http://localhost:5000

## 2️⃣ Frontend Setup (5 minutes)

```bash
# In a new terminal, navigate to client
cd client

# Install dependencies
npm install

# Create .env.local file (optional)
cp .env.example .env.local

# Start development server
npm run dev
```

✅ Frontend running on http://localhost:3000

## 3️⃣ Test the Application

1. Open http://localhost:3000
2. Click "Register" and create an account
3. Fill in details and select target role
4. Explore all features:
   - Dashboard
   - Skill Gap Analysis
   - Resume Builder
   - Mock Interview
   - AI Chatbot
   - Projects

## 📝 Default Test Credentials

After registration, you can login with:
- Email: your registered email
- Password: your registered password

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas: Update MONGODB_URI in .env

### Port Already in Use
```bash
# Change PORT in .env if 5000 is taken
# For frontend, use: npm run dev -- --port 3001
```

### Dependencies Installation Error
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 API Testing

Use Postman or curl to test APIs:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'

# Get Current User (use token from login)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Next Steps

1. ✅ Setup complete!
2. 📖 Read [README.md](./README.md) for detailed documentation
3. 🔌 Integrate OpenAI API for advanced AI features
4. 🎨 Customize Tailwind colors in `client/tailwind.config.js`
5. 📱 Add mobile responsiveness improvements
6. 🔐 Enhance security (rate limiting, input validation, etc.)

## 💡 Tips

- Keep `npm run dev` running in both terminals during development
- Use Redux/Context API for state management as app grows
- Add TypeScript for better type safety
- Setup CI/CD with GitHub Actions
- Use ESLint and Prettier for code quality

## 🆘 Need Help?

- Check [MongoDB Setup Guide](https://docs.mongodb.com/manual/installation/)
- See [Express Documentation](https://expressjs.com/)
- Read [React Docs](https://react.dev)
- Review [Tailwind CSS Docs](https://tailwindcss.com/docs)

Happy coding! 🎉
