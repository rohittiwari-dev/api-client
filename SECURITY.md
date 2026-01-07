# 🛡️ Security Policy

<div align="center">

![Security Status](https://img.shields.io/badge/Security-Active-green?style=flat-square)
![Supported Versions](https://img.shields.io/badge/Supported%20Versions-1.1.x-blue?style=flat-square)

**We take the security of Api Studio and its users seriously.**
This document outlines our security policy, including how to report vulnerabilities and our supported versions.

</div>

---

## 🔒 Supported Versions

We actively maintain and support the following versions of Api Studio with security updates:

| Version   | Status         | Security Updates   |
| :-------- | :------------- | :----------------- |
| **1.1.x** | ✅ **Current** | **Active Support** |
| 1.0.x     | ❌ EOL         | No Updates         |
| < 1.0     | ❌ EOL         | No Updates         |

---

## 🚨 Reporting a Vulnerability

**Please do NOT report security vulnerabilities via public GitHub issues.**

If you believe you have found a security vulnerability in Api Studio, please report it responsibly by following these steps:

1.  **Email Us**: Send a detailed report to **[INSERT_SECURITY_EMAIL_HERE]** (or open a [GitHub Private Vulnerability Report](https://github.com/rohittiwari-dev/api-client/security/advisories/new)).
2.  **Include Details**:
    - Description of the vulnerability.
    - Steps to reproduce the issue.
    - Potential impact.
    - Proof of Concept (PoC) if possible.
3.  **Wait for Response**: We acknowledge reports within **48 hours**.

> We will work with you to validate and fix the issue. We aim to release a patch within **7 days** for critical issues.

---

## 🛡️ Security Best Practices

When self-hosting Api Studio, you are responsible for the infrastructure security. Follow these guidelines:

### 1. Environment Secrets

Never commit your `.env` file. Ensure your `BETTER_AUTH_SECRET` is a long, random string.

```bash
# Generate a secure secret
openssl rand -base64 32
```

### 2. Database Security

- Use **strong, unique passwords** for your PostgreSQL user.
- Allow database connections **only from the application container/IP**.
- Enable **SSL/TLS** for database connections in production.

### 3. Network Security

- **Always use HTTPS** in production.
- Run Api Studio behind a reverse proxy (Nginx, Traefik, Caddy) that handles SSL termination.
- Configure strict **CORS policies** if you are serving the API on a different domain.

---

## 🔐 Architecture Security Features

Api Studio is designed with security in mind:

- **Server-Side Auth**: All sensitive authentication logic (OAuth exchanges, password hashing) happens on the server.
- **Proxy Mode**: Cross-origin API requests are proxied through our server, so browser security contexts (CORS) don't block legitimate development work, while keeping credentials safe.
- **Cookie Security**: Auth tokens are stored in `HttpOnly`, `Secure`, `SameSite=Lax` cookies to prevent XSS attacks.

---

## 🏆 Hall of Fame

We would like to thank the following security researchers for their responsible disclosure and help in making Api Studio more secure:

_(No reports yet. Be the first!)_

---

**Thank you for helping keep the community safe!** 🔐
