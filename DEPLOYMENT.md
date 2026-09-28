# 🌐 Deployment Guide

This guide covers deploying Placement Hub to production environments.

## Prerequisites
- Git
- Node.js v14+
- npm/yarn
- Production database (MongoDB Atlas recommended)

---

## 🚀 Deployment Options

### Option 1: Heroku (Easiest)

#### Backend Deployment

1. **Create Heroku app:**
   ```bash
   heroku create your-app-name-api
   ```

2. **Add environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_secret
   heroku config:set NODE_ENV=production
   heroku config:set OPENAI_API_KEY=your_key
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

4. **View logs:**
   ```bash
   heroku logs --tail
   ```

#### Frontend Deployment (Netlify)

1. **Build the app:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Update API URL in environment:**
   - Set `VITE_API_URL=https://your-backend-heroku-url/api`

---

### Option 2: Docker & AWS/GCP

#### Create Docker Image

1. **Backend Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY server/package*.json ./
   RUN npm install --production
   COPY server . .
   EXPOSE 5000
   CMD ["node", "server.js"]
   ```

2. **Frontend Dockerfile:**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY client/package*.json ./
   RUN npm install
   COPY client . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Build images:**
   ```bash
   docker build -t placement-hub-api -f Dockerfile.api .
   docker build -t placement-hub-web -f Dockerfile.web .
   ```

---

### Option 3: Traditional VPS (AWS EC2, DigitalOcean, Linode)

1. **SSH into server:**
   ```bash
   ssh root@your_server_ip
   ```

2. **Install dependencies:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install -y nginx
   ```

3. **Setup MongoDB:**
   ```bash
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   ```

4. **Clone repository:**
   ```bash
   git clone https://github.com/yourusername/placement-hub.git
   cd placement-hub/server
   ```

5. **Install and build:**
   ```bash
   npm install --production
   npm run build
   ```

6. **Setup Nginx:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location /api {
           proxy_pass http://localhost:5000;
       }

       location / {
           proxy_pass http://localhost:3000;
       }
   }
   ```

7. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

---

## 📊 Environment Configuration

### Production .env

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement-hub
JWT_SECRET=very_long_secure_random_string_here
NODE_ENV=production
OPENAI_API_KEY=sk_prod_your_key_here
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
```

### Frontend .env.production

```
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 🔒 Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure JWT secret (use random 32+ character string)
- [ ] Enable CORS only for frontend domain
- [ ] Rate limit API endpoints
- [ ] Add request validation
- [ ] Use environment variables for secrets
- [ ] Enable HSTS headers
- [ ] Setup WAF (Web Application Firewall)
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## 🚀 CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install backend dependencies
        run: |
          cd server
          npm install

      - name: Test backend
        run: |
          cd server
          npm test

      - name: Deploy backend
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          npm install -g heroku
          heroku login
          git push heroku main

      - name: Build frontend
        run: |
          cd client
          npm install
          npm run build

      - name: Deploy frontend
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        run: |
          npm install -g netlify-cli
          netlify deploy --prod --dir=client/dist
```

---

## 📈 Monitoring

### Application Monitoring
- Use PM2 Plus for monitoring
- Setup error tracking (Sentry)
- Monitor API performance

```bash
pm2 install pm2-auto-pull
pm2 start server.js --name "placement-hub"
```

### Database Monitoring
- MongoDB Atlas monitoring
- Setup alerts for connection issues

### Performance Monitoring
- Use New Relic or DataDog
- Monitor response times
- Track error rates

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
```bash
# Check connection string
# Verify IP whitelist in MongoDB Atlas
# Test connection locally first
```

### Port Already in Use
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

### CORS Errors
```javascript
// Ensure CORS is configured properly
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## 📝 Deployment Checklist

- [ ] Test all features locally
- [ ] Update environment variables
- [ ] Backup database
- [ ] Configure HTTPS
- [ ] Setup monitoring
- [ ] Configure error tracking
- [ ] Test payment processing (if applicable)
- [ ] Verify email notifications
- [ ] Check mobile responsiveness
- [ ] Create disaster recovery plan

---

## 🆙 Rolling Back

```bash
# Heroku
heroku releases
heroku rollback v123

# Git
git revert HEAD
git push

# Manual servers
git checkout previous-tag
pm2 restart all
```

---

## 📞 Support

For deployment issues:
1. Check logs: `heroku logs --tail` or `/var/log/application.log`
2. Verify environment variables
3. Test database connection
4. Check firewall rules
5. Review error tracking platform

---

**Deployment Tips:**
- Always test staging before production
- Keep backups of database
- Monitor application after deployment
- Have rollback plan ready
- Document deployment process

Good luck with your deployment! 🚀
