# ConvoHub Backend - Deployment & Configuration Guide

## Environment Configuration

### Development Environment (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/convohub

# JWT
JWT_SECRET=dev_secret_key_12345_change_in_production
JWT_EXPIRE=7d

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

# Frontend
FRONTEND_URL=http://localhost:3000

# Invite
INVITE_EXPIRY=24
```

### Production Environment

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/convohub?retryWrites=true&w=majority

# JWT - Use a strong random string
JWT_SECRET=generate_strong_random_string_here_minimum_32_chars
JWT_EXPIRE=7d

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@convohub.app
EMAIL_PASS=your_app_specific_password

# Frontend
FRONTEND_URL=https://convohub.app

# Invite
INVITE_EXPIRY=24
```

## Gmail App Password Setup

For Gmail SMTP authentication:

1. Enable 2-Factor Authentication on your Google Account
2. Go to [Google Account Security](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer" (or your device)
4. Google will generate a 16-character password
5. Use this in EMAIL_PASS (format: `xxxx xxxx xxxx xxxx`)

## MongoDB Atlas Setup

1. Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string from "Connect" button
4. Replace username and password
5. Use in MONGODB_URI

Example Atlas URI:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/convohub?retryWrites=true&w=majority
```

## Deployment Guides

### Heroku Deployment

**Prerequisites**
- Heroku CLI installed
- GitHub repository created

**Steps**

1. Install Heroku CLI
```bash
# Windows
choco install heroku-cli

# macOS
brew tap heroku/brew && brew install heroku
```

2. Login to Heroku
```bash
heroku login
```

3. Create Heroku app
```bash
heroku create convohub-api
```

4. Set environment variables
```bash
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your_mongodb_uri>
heroku config:set JWT_SECRET=<your_jwt_secret>
heroku config:set EMAIL_USER=<your_email>
heroku config:set EMAIL_PASS=<your_app_password>
heroku config:set FRONTEND_URL=<your_frontend_url>
```

5. Deploy
```bash
git push heroku main
```

6. View logs
```bash
heroku logs --tail
```

### Railway.app Deployment

**Prerequisites**
- Railway.app account
- GitHub repository

**Steps**

1. Connect GitHub repository at [Railway Dashboard](https://railway.app)
2. Select the repository
3. Configure environment variables in Railway dashboard
4. Set NODE_ENV to production
5. Add PORT=5000
6. Railway auto-detects Node.js app
7. Deployment happens on push to main

### AWS EC2 Deployment

**Prerequisites**
- AWS account
- EC2 instance (Ubuntu 20.04)
- Domain with DNS configured

**Steps**

1. SSH into EC2 instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

2. Install dependencies
```bash
sudo apt update
sudo apt install -y nodejs npm mongodb
```

3. Clone repository
```bash
git clone https://github.com/your-username/convohub.git
cd convohub/backend
```

4. Install npm packages
```bash
npm install --production
```

5. Create .env file with production values
```bash
nano .env
```

6. Install PM2 for process management
```bash
sudo npm install -g pm2
pm2 start server.js --name "convohub-api"
pm2 startup
pm2 save
```

7. Setup Nginx as reverse proxy
```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/default
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. Restart Nginx
```bash
sudo systemctl restart nginx
```

9. Setup SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/convohub
      - JWT_SECRET=${JWT_SECRET}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASS=${EMAIL_PASS}
      - FRONTEND_URL=${FRONTEND_URL}
    depends_on:
      - mongo
    networks:
      - convohub-network

  mongo:
    image: mongo:5
    volumes:
      - mongo-data:/data/db
    networks:
      - convohub-network

volumes:
  mongo-data:

networks:
  convohub-network:
```

Build and run:
```bash
docker-compose up -d
```

## Production Security Checklist

### Application Security
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS only
- [ ] Set secure CORS origin
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Use helmet.js for HTTP headers
- [ ] Sanitize user inputs
- [ ] Implement proper error handling

### Database Security
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Create dedicated database user
- [ ] Use strong password for DB user
- [ ] Enable MongoDB encryption at rest
- [ ] Regular backups enabled
- [ ] Monitor database access

### Email Security
- [ ] Use OAuth2 or App Passwords (not plain password)
- [ ] Use TLS/SSL for SMTP
- [ ] Rotate email credentials periodically

### Infrastructure
- [ ] Use HTTPS/SSL certificate
- [ ] Enable firewall rules
- [ ] Setup intrusion detection
- [ ] Regular security patching
- [ ] Monitor server logs
- [ ] Setup uptime monitoring
- [ ] Enable DDOS protection

## Monitoring & Logging

### Cloud Logging Services

**Sentry (Error Tracking)**
```bash
npm install @sentry/node
```

Setup in server.js:
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**LogRocket (Session Replay & Monitoring)**
```bash
npm install logrocket
```

**Datadog (APM & Monitoring)**
Sign up at [Datadog](https://www.datadoghq.com)

### Health Checks

Monitor the health endpoint:
```bash
curl https://your-domain.com/api/health
```

## Performance Optimization

### Add Redis Caching

```bash
npm install redis
```

Cache frequently accessed data:
- User profiles
- Chat lists
- Message pagination

### Database Indexing

Already configured in models:
```javascript
messageSchema.index({ createdAt: 1 }); // Already in Message model
chatSchema.index({ members: 1 }); // Add to Chat model
userSchema.index({ email: 1 }); // Already unique
```

### Pagination

Already implemented in message fetching with page and limit.

## Scaling Considerations

### Load Balancing
- Deploy multiple instances behind load balancer
- Use sticky sessions for Socket.IO
- Use Redis adapter for Socket.IO across instances

### Database Scaling
- Use MongoDB replication sets
- Implement sharding for large datasets
- Setup read replicas

### Caching Layer
- Implement Redis for sessions
- Cache user data
- Cache chat metadata

## Backup & Recovery

### MongoDB Backups

**Manual backup:**
```bash
mongodump --uri mongodb+srv://username:password@cluster.mongodb.net/convohub --out ./backup
```

**Restore:**
```bash
mongorestore --uri mongodb+srv://username:password@cluster.mongodb.net/convohub ./backup
```

### AWS S3 Backup
```bash
aws s3 cp backup s3://convohub-backups/ --recursive
```

## CI/CD Pipeline Example (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci --production
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "convohub-api"
          heroku_email: ${{secrets.HEROKU_EMAIL}}
```

## Troubleshooting Deployment

### Problem: Server crashes after deployment
- Check logs: `heroku logs --tail`
- Verify environment variables are set
- Check MongoDB connection
- Ensure all dependencies installed

### Problem: Socket.IO not connecting
- Verify CORS origin matches frontend URL
- Check firewall allows WebSocket connections
- Ensure Socket.IO client version matches

### Problem: Emails not sending
- Verify EMAIL_USER and EMAIL_PASS
- Check email service is allowed
- Look at Nodemailer logs

### Problem: High memory usage
- Check for memory leaks
- Monitor event listeners
- Use Node.js --max-old-space-size flag

## Maintenance

### Regular Tasks
- Monitor server health daily
- Review error logs weekly
- Check backup status
- Update dependencies monthly
- Test disaster recovery quarterly
- Security audit annually

### Dependency Updates
```bash
npm outdated          # Check for updates
npm update            # Update packages
npm audit fix         # Fix security vulnerabilities
```

---

For more help, refer to the main README.md or create an issue in the repository.
