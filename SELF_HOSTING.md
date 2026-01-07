# 🐳 Self-Hosting Guide

<div align="center">

![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker&style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Required-blue?logo=postgresql&style=flat-square)
![Redis](https://img.shields.io/badge/Redis-Optional-red?logo=redis&style=flat-square)

**Deploy your own instance of Api Studio.**
Choose the deployment method that best fits your infrastructure.

[Docker (Recommended)](#-option-a-docker-deployment) • [Manual VPS](#-option-b-manual-vps-deployment) • [Troubleshooting](#-troubleshooting)

</div>

---

## 📋 Prerequisites

| Requirement          |    Docker     |   Manual    |
| :------------------- | :-----------: | :---------: |
| **Docker & Compose** |  ✅ Required  |     ❌      |
| **Node.js 18+**      |      ❌       | ✅ Required |
| **PostgreSQL 16+**   | ✅ (Included) | ✅ Required |
| **Redis 7+**         | ✅ (Included) | ✅ Required |

---

## ⚙️ Configuration

Create a `.env` file in your root directory.

```bash
# === Database ===
# Connection string to your PostgreSQL database
DATABASE_URL="postgresql://user:password@localhost:5432/apiclient"

# === Authentication ===
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-secure-random-secret-key"
# The URL where the app is hosted
BETTER_AUTH_URL="http://localhost:3000"

# === Redis (Optional) ===
# For rate limiting and caching
REDIS_URL="redis://localhost:6379"

# === OAuth (Optional) ===
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

---

## 🐳 Option A: Docker Deployment

**This is the recommended way to deploy Api Studio.** It sets up the app, database, and Redis automatically.

### 1. Download Compose File

Copy `docker-compose.full.yml` to your server.

### 2. Configure Environment

Create your `.env` file as shown above.

### 3. Start Services

```bash
docker-compose -f docker-compose.full.yml up -d
```

This will start Api Studio on port `3000`.

### Management Commands

| Action     | Command                                       |
| :--------- | :-------------------------------------------- |
| **Start**  | `docker-compose up -d`                        |
| **Stop**   | `docker-compose down`                         |
| **Logs**   | `docker-compose logs -f`                      |
| **Update** | `docker-compose pull && docker-compose up -d` |

---

## 🛠️ Option B: Manual VPS Deployment

Use this if you want to manage Node.js and the database yourself (e.g., on Ubuntu).

### 1. Install System Deps

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL & Redis
sudo apt-get install -y postgresql postgresql-contrib redis-server
```

### 2. Setup Database

```bash
sudo -u postgres psql -c "CREATE USER apiclient WITH PASSWORD 'securepass';"
sudo -u postgres psql -c "CREATE DATABASE apiclient OWNER apiclient;"
```

### 3. Clone & Build

```bash
git clone https://github.com/rohittiwari-dev/api-client.git
cd api-client
npm install
npm run build
```

### 4. Run with PM2

```bash
sudo npm install -g pm2
pm2 start npm --name "api-studio" -- start
pm2 save
```

---

## ⚠️ Troubleshooting

| Issue                         | Potential Solution                                                                       |
| :---------------------------- | :--------------------------------------------------------------------------------------- |
| **Database Connection Error** | Check `DATABASE_URL` in `.env`. Ensure Postgres is running and accepting connections.    |
| **Auth Failures**             | Verify `BETTER_AUTH_SECRET` is set and `BETTER_AUTH_URL` matches your domain.            |
| **CORS Errors**               | Ensure you are accessing the app from the URL defined in `BETTER_AUTH_URL`.              |
| **Build Memory Error**        | If building on a small VPS, increase swap space or build locally and transfer artifacts. |

---

**Need help?** [Open an issue](https://github.com/rohittiwari-dev/api-client/issues)
