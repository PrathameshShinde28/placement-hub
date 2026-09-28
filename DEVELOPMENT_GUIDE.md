# 💡 Development Tips & Best Practices

## 🚀 Getting the Most Out of Placement Hub

### Development Server Setup

**Start both servers at once:**
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2  
cd client && npm run dev

# Open browser to http://localhost:3000
```

**Pro Tip:** Create a script file to start both:

**start-all.sh** (Mac/Linux)
```bash
#!/bin/bash
cd server && npm run dev &
cd ../client && npm run dev &
wait
```

**start-all.bat** (Windows)
```batch
@echo off
cd server
start npm run dev
cd ../client
start npm run dev
```

---

## 🔧 Common Development Tasks

### Adding a New Feature

1. **Create controller action:**
   ```javascript
   // server/controllers/newController.js
   export const newFeature = async (req, res) => {
     try {
       // Your logic here
       res.status(200).json({ success: true, data });
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };
   ```

2. **Add route:**
   ```javascript
   // server/routes/newRoutes.js
   import { newFeature } from '../controllers/newController.js';
   
   router.post('/feature', protect, newFeature);
   ```

3. **Create API client:**
   ```javascript
   // client/src/services/api.js
   export const newAPI = {
     getFeature: () => api.get('/new/feature'),
     createFeature: (data) => api.post('/new/feature', data),
   };
   ```

4. **Create page component:**
   ```jsx
   // client/src/pages/NewFeature.jsx
   import { newAPI } from '../services/api';
   
   export default function NewFeature() {
     const [data, setData] = useState([]);
     
     useEffect(() => {
       newAPI.getFeature().then(res => setData(res.data));
     }, []);
     
     return <div>{/* Your JSX */}</div>;
   }
   ```

5. **Add route to App.jsx:**
   ```jsx
   <Route path="/feature" element={<ProtectedRoute><NewFeature /></ProtectedRoute>} />
   ```

### Adding a New Database Model

```javascript
// server/models/NewModel.js
import mongoose from 'mongoose';

const newSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Add more fields
}, { timestamps: true });

export default mongoose.model('NewModel', newSchema);
```

### Styling New Components

```jsx
// Use Tailwind classes
<div className="flex justify-between items-center p-6 bg-white rounded-lg shadow">
  <h2 className="text-xl font-bold">Title</h2>
  <button className="btn-primary">Action</button>
</div>

// Or create custom CSS class in index.css
.custom-card {
  @apply bg-white rounded-lg shadow p-6;
}
```

---

## 🐛 Debugging Tips

### Backend Debugging

```javascript
// Add console logs
console.log('🚀', data); // Use emoji for quick spotting
console.error('❌ Error:', error);

// Use MongoDB Compass to view data directly
// Download: https://www.mongodb.com/products/tools/compass
```

### Frontend Debugging

```javascript
// React DevTools Chrome Extension
// Redux DevTools for state management

// Console logging
console.log('Component mounted:', props);

// Use debugger
debugger; // Execution pauses here in DevTools
```

### API Testing

```bash
# Using curl
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Using Postman
# 1. Paste URL
# 2. Set Authorization header
# 3. Send request
```

---

## ⚡ Performance Optimization

### Frontend Optimization
```javascript
// Lazy load routes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

// In routes
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>

// Memoize components
import { memo } from 'react';

const MyComponent = memo(function MyComponent(props) {
  return <div>{props.children}</div>;
});
```

### Backend Optimization
```javascript
// Add database indexes
userSchema.index({ email: 1 });

// Implement caching
const cachedData = await redis.get('key');

// Pagination for large queries
.limit(10).skip(page * 10)

// Select only needed fields
User.find().select('name email');
```

---

## 🔐 Security Best Practices

### Frontend Security
```javascript
// Never store sensitive data in localStorage
localStorage.setItem('token', token); // ✅ OK
localStorage.setItem('password', password); // ❌ Never!

// Sanitize user input
const sanitized = input.trim().slice(0, 100);

// Use environment variables for URLs
const apiUrl = import.meta.env.VITE_API_URL;
```

### Backend Security
```javascript
// Validate input
if (!email || !password) {
  return res.status(400).json({ message: 'Invalid input' });
}

// Hash passwords
const hashedPassword = await bcrypt.hash(password, 10);

// Rate limit endpoints
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);
```

---

## 📝 Testing

### Manual Testing Checklist
- [ ] Registration works
- [ ] Login works
- [ ] Protected routes redirect to login
- [ ] Can create/edit/delete projects
- [ ] Resume saves correctly
- [ ] Skills can be added/removed
- [ ] Chatbot responds
- [ ] Interview scoring works
- [ ] Mobile view responsive
- [ ] No console errors

### Unit Testing (Future)
```javascript
import { expect } from 'chai';

describe('User Model', () => {
  it('should hash password', async () => {
    const user = new User({ password: 'test123' });
    await user.save();
    expect(user.password).not.equal('test123');
  });
});
```

---

## 🎨 Tailwind CSS Quick Reference

### Common Classes
```jsx
// Display
<div className="flex justify-center items-center">

// Sizing
<div className="w-full h-screen max-w-4xl">

// Spacing
<div className="p-6 m-4 gap-2">

// Colors
<div className="bg-blue-600 text-white">

// Rounded
<div className="rounded-lg border-2 border-gray-300">

// Hover effects
<button className="hover:bg-blue-700 transition">

// Responsive
<div className="hidden md:block lg:flex">
```

---

## 📦 Environment Variables

### Backend .env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement-hub
JWT_SECRET=your_32_character_random_string_here
NODE_ENV=development
OPENAI_API_KEY=sk_test_xxx
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

### Frontend .env.local
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Placement Hub
```

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub

# After review, merge to main
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main

# Delete feature branch
git branch -d feature/new-feature
```

---

## 🚨 Troubleshooting

### MongoDB Connection Issues
```javascript
// Error: connect ECONNREFUSED
// Solution: Ensure MongoDB is running
// $ mongod  (Mac/Linux)
// or use MongoDB Atlas cloud database
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### CORS Errors
```javascript
// Check backend CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

### Frontend Not Connecting to Backend
```javascript
// Check API URL in .env
VITE_API_URL=http://localhost:5000/api

// Check if backend is running
curl http://localhost:5000/api/health
```

---

## 💾 Database Backup

### Backup MongoDB
```bash
# Local backup
mongodump --db placement-hub --out ./backup

# Restore
mongorestore --db placement-hub ./backup/placement-hub

# Cloud backup (MongoDB Atlas)
# Settings → Backup → Enable Backup
```

---

## 🚀 Deployment Checklist

Before deploying to production:
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Environment variables set
- [ ] Database connection working
- [ ] HTTPS enabled
- [ ] Security headers added
- [ ] Error logging setup
- [ ] Performance monitoring enabled
- [ ] Database indexed
- [ ] Backups configured

---

## 📚 Useful Commands

### Backend
```bash
cd server

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Run tests (when added)
npm test
```

### Frontend
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎯 Code Quality

### ESLint Setup (Optional)
```bash
npm install --save-dev eslint eslint-config-airbnb

# Create .eslintrc.js
# Run: npx eslint .
```

### Prettier Setup (Optional)
```bash
npm install --save-dev prettier

# Format code
npx prettier --write .
```

---

## 📱 Testing on Mobile

```bash
# Get your machine IP
ifconfig (Mac/Linux)
ipconfig (Windows)

# Visit from phone
http://<YOUR_IP>:3000
```

---

## 🔗 Useful Links

- [React Docs](https://react.dev)
- [Express Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [JWT.io](https://jwt.io)
- [MDN Web Docs](https://developer.mozilla.org)
- [DevTools](https://developer.chrome.com/docs/devtools/)

---

## 🎓 Learning Path

1. **Week 1**: Understand project structure, setup locally
2. **Week 2**: Make small UI changes, get comfortable
3. **Week 3**: Add a simple feature (add skill button, etc.)
4. **Week 4**: Create new page with API integration
5. **Week 5+**: Build major features, practice deployment

---

## 💪 Best Practices Summary

✅ **Do:**
- Use meaningful variable names
- Keep functions small and focused
- Add comments for complex logic
- Test thoroughly before pushing
- Use git branches for features
- Follow project structure
- Handle errors gracefully

❌ **Don't:**
- Store secrets in code
- Commit sensitive files
- Write long functions
- Ignore error messages
- Skip input validation
- Use var instead of const/let
- Force refresh for changes

---

## 🎉 Pro Tips

1. **Keyboard Shortcuts**
   - VSCode: `Ctrl+Shift+F` search all files
   - Browser DevTools: `F12` open console
   - Git: Create aliases for common commands

2. **Productivity**
   - Use Emmet abbreviations in VSCode
   - Use snippets for common patterns
   - Format code with Prettier on save

3. **Debugging**
   - Use browser DevTools regularly
   - Add strategic console logs
   - Use error tracking services

4. **Collaboration**
   - Write clear commit messages
   - Create meaningful PR descriptions
   - Review others' code

---

Happy developing! 🚀

Remember: Small, consistent improvements lead to great results.

---

**Last Updated:** April 23, 2024  
**Project:** Placement Hub  
**Status:** Production Ready
