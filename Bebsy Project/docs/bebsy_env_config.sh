# Bebsy Referral System Environment Configuration
# Copy this file to .env and update with your production values

# =============================================================================
# APPLICATION SETTINGS
# =============================================================================
NODE_ENV=development
PORT=3001
APP_NAME="Bebsy Referral System"
APP_VERSION=1.0.0

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bebsy_referral_system
DB_USER=bebsy_user
DB_PASSWORD=your_secure_password_here

# Database connection pool settings
DB_POOL_MIN=2
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=2000

# For production with SSL
# DB_SSL=true
# DB_SSL_REJECT_UNAUTHORIZED=false

# =============================================================================
# SECURITY SETTINGS
# =============================================================================

# JWT Configuration (MUST be changed in production)
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d

# Password hashing rounds (10-12 recommended for production)
BCRYPT_ROUNDS=10

# Session security
SESSION_SECRET=your-session-secret-key-change-in-production

# =============================================================================
# FRONTEND CONFIGURATION
# =============================================================================

# Frontend URLs for CORS (comma-separated for multiple)
FRONTEND_URL=http://localhost:3000,http://localhost:3001

# Production URLs
# FRONTEND_URL=https://admin.bebsy.nl,https://referral.bebsy.nl

# =============================================================================
# EMAIL CONFIGURATION
# =============================================================================

# SMTP Settings for notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@bebsy.nl
SMTP_PASSWORD=your-app-specific-password

# Email settings
FROM_EMAIL=noreply@bebsy.nl
FROM_NAME="Bebsy Referral System"
ADMIN_EMAIL=admin@bebsy.nl

# =============================================================================
# BUSINESS RULES CONFIGURATION
# =============================================================================

# Default reward amount in euros
DEFAULT_REWARD_AMOUNT=25.00

# Average booking value for revenue calculations
AVERAGE_BOOKING_VALUE=500.00

# Maximum referrals per customer (0 = unlimited)
MAX_REFERRALS_PER_CUSTOMER=0

# Reward expiry in days
REWARD_EXPIRY_DAYS=365

# Auto-approve referrals
AUTO_APPROVE_REFERRALS=false

# Require booking reference for referrals
REQUIRE_BOOKING_REFERENCE=true

# =============================================================================
# FILE UPLOAD SETTINGS
# =============================================================================

# Upload directory
UPLOAD_DIR=uploads

# Maximum file size in bytes (5MB)
MAX_FILE_SIZE=5242880

# Allowed file types
ALLOWED_FILE_TYPES=text/csv,application/csv

# =============================================================================
# RATE LIMITING
# =============================================================================

# General rate limit (requests per 15 minutes)
RATE_LIMIT_GENERAL=100

# Auth rate limit (login attempts per 15 minutes)
RATE_LIMIT_AUTH=5

# Upload rate limit (uploads per hour)
RATE_LIMIT_UPLOAD=10

# =============================================================================
# LOGGING CONFIGURATION
# =============================================================================

# Log level (error, warn, info, verbose, debug)
LOG_LEVEL=info

# Log file locations
LOG_DIR=logs
ERROR_LOG_FILE=error.log
COMBINED_LOG_FILE=combined.log
ACCESS_LOG_FILE=access.log

# Log rotation
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5

# =============================================================================
# MONITORING & ANALYTICS
# =============================================================================

# Enable performance monitoring
ENABLE_MONITORING=true

# APM Service (if using)
# APM_SERVICE_NAME=bebsy-referral-api
# APM_SECRET_TOKEN=your-apm-secret

# Google Analytics (if needed)
# GA_TRACKING_ID=UA-XXXXXXXXX-X

# =============================================================================
# EXTERNAL INTEGRATIONS
# =============================================================================

# Bebsy API Integration
BEBSY_API_URL=https://api.bebsy.nl
BEBSY_API_KEY=your-bebsy-api-key
BEBSY_API_SECRET=your-bebsy-api-secret

# Payment processor (if needed)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Notification services
# SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
# DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# =============================================================================
# BACKUP CONFIGURATION
# =============================================================================

# Backup settings
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *"  # Daily at 2 AM
BACKUP_RETENTION_DAYS=30

# Backup storage (local or cloud)
BACKUP_TYPE=local
BACKUP_PATH=./backups

# AWS S3 settings (if using cloud backup)
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_REGION=eu-west-1
# AWS_S3_BUCKET=bebsy-referral-backups

# =============================================================================
# REDIS CONFIGURATION (for caching/sessions)
# =============================================================================

# Redis connection (optional)
# REDIS_URL=redis://localhost:6379
# REDIS_PASSWORD=your-redis-password
# REDIS_DB=0

# Session store
# SESSION_STORE=redis
# SESSION_TTL=86400

# =============================================================================
# DEVELOPMENT SETTINGS
# =============================================================================

# Development only settings
DEBUG=false
VERBOSE_LOGGING=false

# Hot reload for development
# DEV_AUTO_RELOAD=true

# API documentation
ENABLE_API_DOCS=true
API_DOCS_PATH=/api-docs

# =============================================================================
# PRODUCTION OVERRIDES
# =============================================================================

# Security headers
ENABLE_HELMET=true
ENABLE_CORS=true

# SSL/HTTPS
FORCE_HTTPS=false
TRUST_PROXY=false

# Performance
ENABLE_COMPRESSION=true
ENABLE_CACHING=true

# Health checks
HEALTH_CHECK_PATH=/api/health
READY_CHECK_PATH=/api/ready

# =============================================================================
# COMPANY INFORMATION
# =============================================================================

COMPANY_NAME="Bebsy Tours"
COMPANY_EMAIL=info@bebsy.nl
COMPANY_PHONE="+31 20 123 4567"
COMPANY_ADDRESS="Amsterdam, Netherlands"
COMPANY_WEBSITE=https://bebsy.nl

# =============================================================================
# LOCALIZATION
# =============================================================================

DEFAULT_LOCALE=nl-NL
DEFAULT_TIMEZONE=Europe/Amsterdam
DEFAULT_CURRENCY=EUR
CURRENCY_SYMBOL=€

# Date formats
DATE_FORMAT=DD-MM-YYYY
TIME_FORMAT=HH:mm
DATETIME_FORMAT="DD-MM-YYYY HH:mm"

# =============================================================================
# FEATURE FLAGS
# =============================================================================

# Enable/disable features
FEATURE_BULK_OPERATIONS=true
FEATURE_ANALYTICS=true
FEATURE_NOTIFICATIONS=true
FEATURE_AUDIT_LOG=true
FEATURE_AUTO_BACKUP=true

# Experimental features
FEATURE_AI_INSIGHTS=false
FEATURE_ADVANCED_REPORTING=true

# =============================================================================
# DEVELOPMENT DATABASE (for testing)
# =============================================================================

# Test database settings
# TEST_DB_HOST=localhost
# TEST_DB_PORT=5432
# TEST_DB_NAME=bebsy_referral_test
# TEST_DB_USER=bebsy_test_user
# TEST_DB_PASSWORD=test_password

# =============================================================================
# DOCKER CONFIGURATION
# =============================================================================

# Docker-specific settings
DOCKER_ENV=false

# Container health check
HEALTHCHECK_INTERVAL=30s
HEALTHCHECK_TIMEOUT=10s
HEALTHCHECK_RETRIES=3

# =============================================================================
# KUBERNETES/ORCHESTRATION
# =============================================================================

# Pod/Service settings
# K8S_NAMESPACE=bebsy-referral
# K8S_SERVICE_NAME=bebsy-referral-api
# K8S_POD_NAME=${HOSTNAME}

# =============================================================================
# NOTES AND REMINDERS
# =============================================================================

# PRODUCTION CHECKLIST:
# [ ] Change all default passwords and secrets
# [ ] Set NODE_ENV=production
# [ ] Configure proper database credentials
# [ ] Set up SSL certificates
# [ ] Configure backup strategy
# [ ] Set up monitoring and alerting
# [ ] Review and test all integrations
# [ ] Update CORS origins for production domains
# [ ] Set proper log levels
# [ ] Configure rate limits for production load
# [ ] Set up health checks
# [ ] Review security settings

# SECURITY REMINDERS:
# - Never commit this file with real credentials to version control
# - Use strong, unique passwords for all services
# - Rotate secrets regularly
# - Enable 2FA where possible
# - Monitor access logs regularly
# - Keep dependencies updated

# For additional configuration options, see:
# - Backend documentation
# - Database setup guide
# - Deployment instructions