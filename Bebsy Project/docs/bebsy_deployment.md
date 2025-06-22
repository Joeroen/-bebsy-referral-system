# Bebsy Referral System - Complete Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- OR Node.js 18+, PostgreSQL 13+, Redis (manual setup)
- Git

### One-Command Deployment
```bash
git clone https://github.com/bebsy/referral-system.git
cd referral-system
cp .env.example .env
# Edit .env with your configuration
./scripts/deploy.sh
```

Access at: http://localhost (admin/admin123)

---

## 📋 Complete Setup Instructions

### 1. Docker Deployment (Recommended)

#### Basic Setup
```bash
# Clone repository
git clone https://github.com/bebsy/referral-system.git
cd referral-system

# Configure environment
cp .env.example .env
nano .env  # Update configuration

# Deploy all services
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

#### With Monitoring
```bash
# Deploy with Prometheus & Grafana
docker-compose --profile monitoring up -d

# Access points:
# - App: http://localhost
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3003 (admin/admin)
```

#### With Logging (ELK Stack)
```bash
# Deploy with full logging
docker-compose --profile monitoring --profile logging up -d

# Kibana: http://localhost:5601
```

#### Production with SSL
```bash
# Generate SSL certificates
docker-compose --profile ssl run certbot

# Deploy production stack
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 2. Manual Installation

#### Database Setup
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createuser bebsy_user
sudo -u postgres createdb bebsy_referral_system -O bebsy_user
sudo -u postgres psql -c "ALTER USER bebsy_user WITH PASSWORD 'secure_password';"

# Import schema
psql -U bebsy_user -d bebsy_referral_system -f database/schema.sql
```

#### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env

# Start development server
npm run dev

# Or production
npm start
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure API endpoint
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env.local

# Development
npm start

# Production build
npm run build
npx serve -s build -l 3000
```

#### Nginx Configuration (Production)
```nginx
# /etc/nginx/sites-available/bebsy-referral
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    client_max_body_size 10M;
}
```

---

## ⚙️ Configuration

### Environment Variables

#### Critical Settings
```bash
# Security (REQUIRED - Change in production!)
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-long
DB_PASSWORD=your_secure_database_password

# Database
DB_HOST=localhost
DB_USER=bebsy_user
DB_NAME=bebsy_referral_system

# Application
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

#### Business Rules
```bash
# Rewards
DEFAULT_REWARD_AMOUNT=25.00
AVERAGE_BOOKING_VALUE=500.00
MAX_REFERRALS_PER_CUSTOMER=0  # 0 = unlimited

# Features
AUTO_APPROVE_REFERRALS=false
REQUIRE_BOOKING_REFERENCE=true
```

#### Email Notifications
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@bebsy.nl
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@bebsy.nl
```

### Database Configuration

#### Connection Pooling
```bash
DB_POOL_MIN=2
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=2000
```

#### SSL (Production)
```bash
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

---

## 🔒 Security Setup

### 1. Change Default Credentials
```sql
-- Connect to database
psql -U bebsy_user -d bebsy_referral_system

-- Update admin password
UPDATE admin_users 
SET password_hash = '$2b$12$new_hash_here' 
WHERE username = 'admin';
```

### 2. SSL Certificate Setup
```bash
# Using Let's Encrypt
sudo apt-get install certbot nginx
sudo certbot --nginx -d your-domain.com

# Or with Docker
docker-compose --profile ssl run certbot
```

### 3. Firewall Configuration
```bash
# UFW setup
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw deny 3001  # Don't expose backend directly
sudo ufw deny 5432  # Don't expose database
```

### 4. Security Headers
Already configured in Nginx:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

---

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Application health
curl http://localhost/api/health

# Database health
docker-compose exec postgres pg_isready -U bebsy_user

# Service status
docker-compose ps
```

### Logging
```bash
# Application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Nginx logs
docker-compose logs -f nginx
tail -f logs/nginx/access.log

# Database logs
docker-compose logs -f postgres
```

### Backup & Restore

#### Automated Backups
```bash
# Backups run automatically at 2 AM daily
# Manual backup
docker-compose exec backup /backup.sh

# List backups
ls -la backups/

# Restore from backup
gunzip backups/bebsy_backup_20231201_020000.sql.gz
docker-compose exec postgres psql -U bebsy_user -d bebsy_referral_system -f /backups/bebsy_backup_20231201_020000.sql
```

#### Cloud Backup (AWS S3)
```bash
# Configure in .env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=bebsy-backups

# Backups will automatically upload to S3
```

### Performance Monitoring

#### Prometheus Metrics
- HTTP request duration
- Database connection pool
- Memory usage
- Error rates

#### Grafana Dashboards
- System overview
- API performance
- Database metrics
- User activity

---

## 🚀 Deployment Environments

### Development
```bash
# Start dev environment
./scripts/dev-setup.sh

# Services:
# - Database: localhost:5432
# - Redis: localhost:6379
# - Backend: localhost:3001 (npm run dev)
# - Frontend: localhost:3000 (npm start)
```

### Staging
```bash
# Staging with production-like setup
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

### Production
```bash
# Full production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# With high availability
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --profile ha up -d
```

---

## 🔧 Maintenance Tasks

### Database Maintenance
```sql
-- Update statistics
ANALYZE;

-- Vacuum tables
VACUUM VERBOSE;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Clean old audit logs (older than 1 year)
DELETE FROM audit_log WHERE changed_at < CURRENT_DATE - INTERVAL '1 year';
```

### Application Updates
```bash
# Update application
git pull origin main
docker-compose build
docker-compose up -d

# Database migrations (if any)
docker-compose exec backend npm run migrate

# Verify update
curl http://localhost/api/health
```

### Log Rotation
```bash
# Configure logrotate
sudo nano /etc/logrotate.d/bebsy

# Content:
/var/log/bebsy/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 www-data www-data
    postrotate
        docker-compose restart nginx
    endscript
}
```

---

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Load balancer will automatically distribute traffic
```

### Database Scaling
```bash
# Read replica for reports
docker-compose --profile ha up -d

# Connection pooling
# Configure pgbouncer for high-traffic scenarios
```

### CDN Integration
```nginx
# Configure CDN for static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    
    # CDN configuration
    proxy_set_header Host your-cdn.com;
    proxy_pass https://your-cdn.com;
}
```

---

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check database status
docker-compose exec postgres pg_isready

# Check credentials
docker-compose exec postgres psql -U bebsy_user -d bebsy_referral_system -c "SELECT current_user;"

# Reset database password
docker-compose exec postgres psql -U postgres -c "ALTER USER bebsy_user WITH PASSWORD 'new_password';"
```

#### Frontend Not Loading
```bash
# Check build process
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend

# Check Nginx configuration
docker-compose exec nginx nginx -t
```

#### API Errors
```bash
# Check backend logs
docker-compose logs backend

# Check JWT secret
docker-compose exec backend node -e "console.log(process.env.JWT_SECRET?.length)"

# Restart backend
docker-compose restart backend
```

#### File Upload Issues
```bash
# Check upload directory permissions
docker-compose exec backend ls -la uploads/

# Fix permissions
docker-compose exec backend chown -R node:node uploads/
```

### Performance Issues
```bash
# Check resource usage
docker stats

# Database performance
docker-compose exec postgres psql -U bebsy_user -d bebsy_referral_system -c "
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;"

# Nginx access patterns
tail -f logs/nginx/access.log | grep -E "(50[0-9]|40[0-9])"
```

---

## 📚 API Documentation

### Authentication
```bash
# Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Use token in subsequent requests
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost/api/customers
```

### Customer Management
```bash
# Get customers
curl -H "Authorization: Bearer TOKEN" "http://localhost/api/customers?page=1&limit=20&search=jan"

# Add customer
curl -X POST http://localhost/api/customers \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bebsy_customer_id": "CUST001",
    "name": "Jan Jansen",
    "email": "jan@example.com"
  }'

# Import customers (CSV)
curl -X POST http://localhost/api/customers/import \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@customers.csv"
```

### Referral Management
```bash
# Create referral
curl -X POST http://localhost/api/referrals \
  -H "Content-Type: application/json" \
  -d '{
    "referrer_code": "ABC12345",
    "new_customer_email": "newcustomer@example.com",
    "booking_reference": "BOOK001"
  }'

# Update referral status
curl -X PUT http://localhost/api/referrals/REFERRAL_ID/status \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

# Bulk update referrals
curl -X POST http://localhost/api/referrals/bulk-update \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "referralIds": ["id1", "id2"],
    "status": "approved"
  }'
```

### Analytics
```bash
# Dashboard statistics
curl -H "Authorization: Bearer TOKEN" "http://localhost/api/dashboard/stats?period=30"

# Conversion rates
curl -H "Authorization: Bearer TOKEN" "http://localhost/api/analytics/conversion-rate?period=90"

# Revenue impact
curl -H "Authorization: Bearer TOKEN" "http://localhost/api/analytics/revenue-impact"
```

### Data Export
```bash
# Export customers (JSON)
curl -H "Authorization: Bearer TOKEN" "http://localhost/api/export/customers?format=json" -o customers.json

# Export referrals (CSV)
curl -H "Authorization: Bearer TOKEN" "http://localhost/api/export/referrals?format=csv" -o referrals.csv
```

---

## 🌐 Cloud Deployment Options

### AWS Deployment

#### Using ECS Fargate
```bash
# Build and push images
docker build -t bebsy-backend backend/
docker tag bebsy-backend:latest YOUR_ECR_URI/bebsy-backend:latest
docker push YOUR_ECR_URI/bebsy-backend:latest

# Deploy with ECS CLI
ecs-cli compose --file docker-compose.aws.yml up
```

#### Using EKS (Kubernetes)
```yaml
# kubernetes/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: bebsy-referral

---
# kubernetes/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: bebsy-config
  namespace: bebsy-referral
data:
  DB_HOST: "postgres-service"
  NODE_ENV: "production"
  FRONTEND_URL: "https://referral.bebsy.nl"

---
# kubernetes/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: bebsy-secrets
  namespace: bebsy-referral
type: Opaque
stringData:
  DB_PASSWORD: "your_secure_password"
  JWT_SECRET: "your_jwt_secret"

---
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bebsy-backend
  namespace: bebsy-referral
spec:
  replicas: 3
  selector:
    matchLabels:
      app: bebsy-backend
  template:
    metadata:
      labels:
        app: bebsy-backend
    spec:
      containers:
      - name: backend
        image: YOUR_ECR_URI/bebsy-backend:latest
        ports:
        - containerPort: 3001
        envFrom:
        - configMapRef:
            name: bebsy-config
        - secretRef:
            name: bebsy-secrets
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5

---
# kubernetes/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: bebsy-backend-service
  namespace: bebsy-referral
spec:
  selector:
    app: bebsy-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3001
  type: ClusterIP

---
# kubernetes/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: bebsy-ingress
  namespace: bebsy-referral
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - referral.bebsy.nl
    secretName: bebsy-tls
  rules:
  - host: referral.bebsy.nl
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: bebsy-backend-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: bebsy-frontend-service
            port:
              number: 80
```

### Google Cloud Platform

#### Cloud Run Deployment
```bash
# Build and deploy backend
gcloud builds submit --tag gcr.io/PROJECT_ID/bebsy-backend backend/
gcloud run deploy bebsy-backend \
  --image gcr.io/PROJECT_ID/bebsy-backend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production

# Build and deploy frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/bebsy-frontend frontend/
gcloud run deploy bebsy-frontend \
  --image gcr.io/PROJECT_ID/bebsy-frontend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

### Azure Deployment

#### Container Instances
```bash
# Create resource group
az group create --name bebsy-referral --location westeurope

# Deploy backend
az container create \
  --resource-group bebsy-referral \
  --name bebsy-backend \
  --image YOUR_REGISTRY/bebsy-backend:latest \
  --ports 3001 \
  --environment-variables NODE_ENV=production \
  --secure-environment-variables DB_PASSWORD=secret JWT_SECRET=secret

# Deploy frontend
az container create \
  --resource-group bebsy-referral \
  --name bebsy-frontend \
  --image YOUR_REGISTRY/bebsy-frontend:latest \
  --ports 80
```

### Heroku Deployment

#### Backend (API)
```bash
# Create Heroku app
heroku create bebsy-referral-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set FRONTEND_URL=https://bebsy-referral-app.herokuapp.com

# Deploy
git subtree push --prefix backend heroku main

# Run database setup
heroku pg:psql < database/schema.sql
```

#### Frontend
```bash
# Create app for frontend
heroku create bebsy-referral-app

# Set buildpack
heroku buildpacks:set mars/create-react-app

# Set API URL
heroku config:set REACT_APP_API_URL=https://bebsy-referral-api.herokuapp.com/api

# Deploy
git subtree push --prefix frontend heroku main
```

---

## 🔐 Security Best Practices

### 1. Environment Security
```bash
# Never commit secrets
echo ".env" >> .gitignore
echo "*.log" >> .gitignore
echo "uploads/*" >> .gitignore
echo "backups/*" >> .gitignore

# Use strong passwords
openssl rand -base64 32  # Generate secure password
```

### 2. Database Security
```sql
-- Create read-only user for analytics
CREATE USER bebsy_readonly WITH PASSWORD 'readonly_pass';
GRANT CONNECT ON DATABASE bebsy_referral_system TO bebsy_readonly;
GRANT USAGE ON SCHEMA public TO bebsy_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO bebsy_readonly;

-- Audit configuration
ALTER SYSTEM SET log_statement = 'mod';
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

### 3. Network Security
```bash
# Docker network isolation
docker network create --driver bridge bebsy-isolated

# Firewall rules (production)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 4. Application Security
```javascript
// Rate limiting configuration
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
```

### 5. SSL/TLS Configuration
```nginx
# Strong SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# HSTS
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

# Security headers
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'";
```

---

## 📊 Performance Optimization

### Database Optimization
```sql
-- Index optimization
CREATE INDEX CONCURRENTLY idx_referrals_created_at_status 
ON referrals(created_at, reward_status) 
WHERE reward_status = 'pending';

-- Partitioning for large tables
CREATE TABLE referrals_2024 PARTITION OF referrals
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Query optimization
EXPLAIN ANALYZE SELECT * FROM referral_stats WHERE total_referrals > 10;
```

### Application Caching
```javascript
// Redis caching middleware
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      res.sendResponse = res.json;
      res.json = (body) => {
        client.setex(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };
      next();
    } catch (error) {
      next();
    }
  };
};

// Use caching for dashboard stats
app.get('/api/dashboard/stats', cacheMiddleware(300), getDashboardStats);
```

### Frontend Optimization
```javascript
// Code splitting
import { lazy, Suspense } from 'react';

const CustomersManagement = lazy(() => import('./CustomersManagement'));
const ReferralsManagement = lazy(() => import('./ReferralsManagement'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Router>
        <Route path="/customers" component={CustomersManagement} />
        <Route path="/referrals" component={ReferralsManagement} />
      </Router>
    </Suspense>
  );
}
```

### CDN Configuration
```bash
# CloudFlare settings
# Cache static assets: 1 year
# Cache API responses: 5 minutes for GET requests
# Always use HTTPS
# Enable Brotli compression
```

---

## 🚨 Incident Response

### Monitoring Alerts
```yaml
# prometheus/alerts.yml
groups:
- name: bebsy-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      
  - alert: DatabaseDown
    expr: up{job="postgres"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Database is down"
      
  - alert: HighMemoryUsage
    expr: (node_memory_MemTotal - node_memory_MemAvailable) / node_memory_MemTotal > 0.9
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High memory usage"
```

### Incident Response Playbook

#### Database Issues
```bash
# Check database status
docker-compose exec postgres pg_isready

# Check connections
docker-compose exec postgres psql -U bebsy_user -c "SELECT count(*) FROM pg_stat_activity;"

# Check locks
docker-compose exec postgres psql -U bebsy_user -c "SELECT * FROM pg_locks WHERE NOT granted;"

# Restart database (last resort)
docker-compose restart postgres
```

#### Application Issues
```bash
# Check logs
docker-compose logs --tail=100 backend

# Check memory usage
docker stats bebsy-backend

# Scale up if needed
docker-compose up -d --scale backend=3

# Restart application
docker-compose restart backend
```

#### Network Issues
```bash
# Check Nginx status
docker-compose exec nginx nginx -t
curl -I http://localhost/health

# Check upstream connections
docker-compose exec nginx cat /var/log/nginx/error.log | tail -20

# Reload Nginx config
docker-compose exec nginx nginx -s reload
```

---

## 📈 Scaling Strategies

### Horizontal Scaling
```bash
# Scale backend instances
docker-compose up -d --scale backend=5

# Load balancer configuration
upstream backend {
    least_conn;
    server backend_1:3001 max_fails=3 fail_timeout=30s;
    server backend_2:3001 max_fails=3 fail_timeout=30s;
    server backend_3:3001 max_fails=3 fail_timeout=30s;
}
```

### Database Scaling
```bash
# Read replicas
docker-compose --profile ha up -d

# Connection pooling with PgBouncer
docker run -d --name pgbouncer \
  -e DATABASES_HOST=postgres \
  -e DATABASES_NAME=bebsy_referral_system \
  -e DATABASES_USER=bebsy_user \
  -e DATABASES_PASSWORD=password \
  -p 5432:5432 \
  pgbouncer/pgbouncer
```

### Microservices Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  Auth Service   │    │ Notification    │
│    (Nginx)      │────│                 │────│   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Customer      │    │   Referral      │    │   Rewards       │
│   Service       │    │   Service       │    │   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │   Database      │
                    │   (PostgreSQL)  │
                    └─────────────────┘
```

---

## 📚 Additional Resources

### Documentation
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [React Documentation](https://reactjs.org/docs/)

### Community & Support
- GitHub Issues: Report bugs and request features
- Discord: Join our community chat
- Email: support@bebsy.nl

### Training Materials
- Admin User Guide: `docs/admin-guide.pdf`
- API Reference: `docs/api-reference.md`
- Video Tutorials: `docs/videos/`

---

## 🎯 Success Metrics

### KPIs to Monitor
- **Referral Conversion Rate**: Target >15%
- **Average Response Time**: <200ms for API calls
- **System Uptime**: >99.9%
- **Customer Satisfaction**: >4.5/5
- **Data Processing**: <5min for CSV imports

### Performance Benchmarks
```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 http://localhost/api/dashboard/stats

# Database performance
pgbench -c 10 -j 2 -t 1000 bebsy_referral_system
```

---

## 📝 Changelog & Updates

### Version 1.0.0 (Production Release)
- ✅ Complete referral management system
- ✅ Dutch admin interface
- ✅ CSV import/export functionality
- ✅ Docker deployment ready
- ✅ Comprehensive monitoring
- ✅ Security hardened
- ✅ Production documentation

### Roadmap v1.1.0
- 🔄 API versioning
- 🔄 Advanced analytics dashboard
- 🔄 Email notifications
- 🔄 Mobile app support
- 🔄 Multi-tenant support

---

**🎉 Your Bebsy Referral System is now ready for production!**

For support: support@bebsy.nl | Documentation: docs.bebsy.nl | Status: status.bebsy.nl