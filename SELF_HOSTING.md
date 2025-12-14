# Self-Hosting Guide

Complete guide to self-host ApiClient using Docker (recommended) or manually on a VPS.

---

## Prerequisites

| Requirement | Docker Deploy | Manual Deploy |
|-------------|---------------|---------------|
| Docker & Docker Compose | ✅ Required | ❌ Not needed |
| Node.js 18+ | ❌ Not needed | ✅ Required |
| PostgreSQL 16+ | ✅ Included | ✅ Required |
| Redis 7+ | ✅ Included | ✅ Required |
| Cloudinary Account | ✅ Required | ✅ Required |

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# ===========================================
# DATABASE
# ===========================================
# For docker-compose.full.yml, this is auto-configured
# For manual setup, use your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/apiclient"

# Password for PostgreSQL container (docker-compose.full.yml only)
POSTGRES_PASSWORD="your-secure-database-password"

# ===========================================
# APPLICATION
# ===========================================
# Your application URL (use your domain in production)
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_WEB_PUBLIC_URL="http://localhost:3000"

# Auth secret - generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="generate-a-secure-random-string-here"

# ===========================================
# REDIS
# ===========================================
# For docker-compose.full.yml, this is auto-configured
# For manual setup, use your Redis connection string
REDIS_URL="redis://localhost:6379"

# ===========================================
# OPTIONAL: Google OAuth
# ===========================================
# Leave empty to disable Google login
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

---

## Option A: Docker Deployment (Recommended)

### Quick Start (Full Stack)

This method includes PostgreSQL and Redis containers, so you don't need to set them up separately.

**1. Clone the repository:**

```bash
git clone https://github.com/yourusername/api-client.git
cd api-client
```

**2. Create your `.env` file:**

```bash
# Copy the example above and fill in your values
nano .env
```

**3. Start all services:**

```bash
docker-compose -f docker-compose.full.yml up -d
```

This starts:
- **PostgreSQL 16** on port 5432
- **Redis 7** on port 6379
- **ApiClient** on port 3000

**4. Access the app:**

Open `http://localhost:3000` in your browser.

### Commands Reference

```bash
# Start services
docker-compose -f docker-compose.full.yml up -d

# View logs
docker-compose -f docker-compose.full.yml logs -f

# Stop services
docker-compose -f docker-compose.full.yml down

# Rebuild after code changes
docker-compose -f docker-compose.full.yml up -d --build

# Full reset (removes volumes/data)
docker-compose -f docker-compose.full.yml down -v
```

### Using Existing Database/Redis

If you already have PostgreSQL and Redis running, use the simpler compose file:

```bash
# Edit .env with your DATABASE_URL and REDIS_URL
docker-compose up -d
```

---

## Option B: Manual VPS Deployment

### 1. Install Prerequisites

**Ubuntu/Debian:**

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install Redis
sudo apt-get install -y redis-server
sudo systemctl enable redis-server
```

### 2. Setup PostgreSQL

```bash
# Create database and user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE USER apiclient WITH PASSWORD 'your-password';
CREATE DATABASE apiclient OWNER apiclient;
\q
```

### 3. Clone and Install

```bash
git clone https://github.com/yourusername/api-client.git
cd api-client
npm ci
```

### 4. Configure Environment

```bash
# Create .env file with your configuration
nano .env

# Your DATABASE_URL should be:
# DATABASE_URL="postgresql://apiclient:your-password@localhost:5432/apiclient"
```

### 5. Build the Application

```bash
npm run build
```

### 6. Run with PM2

```bash
# Install PM2
sudo npm install -g pm2

# Start the application
pm2 start npm --name "api-client" -- start

# Save PM2 config for auto-restart on reboot
pm2 save
pm2 startup
```

### 7. Setup Nginx Reverse Proxy (Production)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/api-client /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails with env errors | Ensure all required env vars are set in `.env` |
| Cannot connect to database | Check `DATABASE_URL` format and credentials |
| Port 3000 already in use | Change port mapping in docker-compose |
| Container keeps restarting | Check logs: `docker-compose logs api-client` |

---

## Updating

**Docker:**
```bash
git pull
docker-compose -f docker-compose.full.yml up -d --build
```

**Manual:**
```bash
git pull
npm ci
npm run build
pm2 restart api-client
```
