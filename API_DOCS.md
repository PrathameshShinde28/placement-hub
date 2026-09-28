# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### 1. Register User
**POST** `/auth/register`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "targetRole": "Software Engineer"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "targetRole": "Software Engineer"
  }
}
```

### 2. Login User
**POST** `/auth/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "jwt_token_here",
  "user": { /* user object */ }
}
```

### 3. Get Current User
**GET** `/auth/me` ✅ Protected

Response:
```json
{
  "success": true,
  "user": { /* complete user object */ }
}
```

### 4. Update Profile
**PUT** `/auth/profile` ✅ Protected

Request Body:
```json
{
  "name": "Jane Doe",
  "bio": "Aspiring Software Engineer",
  "skills": ["JavaScript", "React", "Node.js"],
  "targetRole": "Full Stack Developer"
}
```

---

## Skill Endpoints

### 1. Get Skill Gap Analysis
**GET** `/skills/gap-analysis` ✅ Protected

Response:
```json
{
  "success": true,
  "data": {
    "currentSkills": ["JavaScript", "React"],
    "targetRole": "Software Engineer",
    "requiredSkills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "missingSkills": ["Node.js", "MongoDB"],
    "proficiencyGap": { /* score for each skill */ },
    "recommendedCourses": [
      {
        "name": "Node.js Masterclass",
        "provider": "Udemy",
        "duration": "40 hours"
      }
    ],
    "timeline": "3 months"
  }
}
```

### 2. Add Skill
**POST** `/skills/add` ✅ Protected

Request Body:
```json
{
  "skill": "Python"
}
```

### 3. Remove Skill
**POST** `/skills/remove` ✅ Protected

Request Body:
```json
{
  "skill": "Python"
}
```

---

## Resume Endpoints

### 1. Create Resume
**POST** `/resume/create` ✅ Protected

Request Body:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "location": "New York",
  "summary": "Experienced developer...",
  "experience": [
    {
      "jobTitle": "Junior Developer",
      "company": "Tech Corp",
      "startDate": "2023-01-01",
      "endDate": "2024-01-01",
      "description": "Developed web applications"
    }
  ],
  "education": [
    {
      "degree": "B.Tech",
      "institution": "XYZ University",
      "graduationYear": 2023,
      "gpa": "3.8"
    }
  ],
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### 2. Get Resume
**GET** `/resume` ✅ Protected

### 3. Update Resume
**PUT** `/resume/update` ✅ Protected

### 4. Analyze Resume
**POST** `/resume/analyze` ✅ Protected

Response:
```json
{
  "success": true,
  "analysis": {
    "score": 75,
    "feedback": "Good resume structure...",
    "suggestions": [
      "Add more quantifiable achievements",
      "Improve summary section"
    ],
    "strengths": ["Clear formatting"],
    "improvements": ["Add metrics"]
  }
}
```

---

## Chat Endpoints

### 1. Send Message to Chatbot
**POST** `/chat/message` ✅ Protected

Request Body:
```json
{
  "message": "How can I improve my coding skills?"
}
```

Response:
```json
{
  "success": true,
  "message": "How can I improve my coding skills?",
  "botResponse": "To improve your skills, I recommend...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Get Chat History
**GET** `/chat/history` ✅ Protected

---

## Interview Endpoints

### 1. Start Mock Interview
**POST** `/interview/start` ✅ Protected

Request Body:
```json
{
  "interviewType": "technical",
  "questionCategory": "DSA",
  "difficulty": "Medium"
}
```

Response:
```json
{
  "success": true,
  "interview": {
    "id": "interview_id",
    "question": "What is the difference between...",
    "interviewType": "technical"
  }
}
```

### 2. Submit Interview Answer
**POST** `/interview/submit-answer` ✅ Protected

Request Body:
```json
{
  "interviewId": "interview_id",
  "answer": "Your answer here...",
  "duration": 300
}
```

Response:
```json
{
  "success": true,
  "evaluation": {
    "score": 78,
    "feedback": "Good answer!",
    "suggestions": [
      "Add more examples",
      "Explain better"
    ]
  }
}
```

### 3. Get Interview History
**GET** `/interview/history` ✅ Protected

Response:
```json
{
  "success": true,
  "stats": {
    "totalInterviews": 5,
    "averageScore": 72.5,
    "interviews": [ /* array of interviews */ ]
  }
}
```

---

## Project Endpoints

### 1. Create Project
**POST** `/projects/create` ✅ Protected

Request Body:
```json
{
  "title": "E-Commerce Platform",
  "description": "Full-stack e-commerce application",
  "technologies": ["React", "Node.js", "MongoDB"],
  "link": "https://project-link.com",
  "repositoryLink": "https://github.com/user/project",
  "difficulty": "Intermediate"
}
```

### 2. Get User Projects
**GET** `/projects` ✅ Protected

### 3. Update Project
**PUT** `/projects/:projectId` ✅ Protected

### 4. Delete Project
**DELETE** `/projects/:projectId` ✅ Protected

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Testing with cURL

Example requests:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "pass123",
    "targetRole": "Software Engineer"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "pass123"
  }'

# Get User (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## Rate Limiting (Future)
- Coming soon: Rate limiting will be implemented
- Each user: 100 requests per hour per endpoint

## WebSocket Support (Future)
- Real-time chat
- Live interview feedback
- Notifications

