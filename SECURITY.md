# Security Policy

## 🔒 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## 🚨 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email: **security@example.com** (or create a private security advisory on GitHub)

### What to Include

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** assessment
4. **Suggested fix** (if you have one)

### What to Expect

- **Acknowledgment** within 48 hours
- **Status update** within 7 days
- **Resolution timeline** based on severity

## 🛡️ Security Best Practices

When self-hosting Api Studio, follow these security guidelines:

### Environment Variables

```bash
# Use strong, unique secrets
BETTER_AUTH_SECRET="generate-a-32-character-random-string"

# Never commit .env files
# Add to .gitignore
```

### Database Security

- Use strong PostgreSQL passwords
- Limit database network access
- Enable SSL connections in production
- Regular backups with encryption

### Network Security

- Always use HTTPS in production
- Configure proper CORS headers
- Use a reverse proxy (nginx, Caddy)
- Enable rate limiting

### Authentication

- Enforce strong passwords
- Consider enabling 2FA
- Review OAuth provider settings
- Regularly rotate secrets

## 🔐 Security Features

### Server-Side Auth Processing

All authentication computations happen server-side:

- Credentials never exposed to browser
- Crypto operations use Node.js `crypto`
- No sensitive data in client bundles

### Cookie Security

- HttpOnly flag support
- Secure flag for HTTPS
- SameSite attribute handling
- Partitioned cookie support

### Request Proxying

All API requests route through server proxy:

- CORS bypass without exposing credentials
- Server-side header computation
- No direct client-to-API exposure

## ⚠️ Known Limitations

1. **Local Storage**: Request data stored in browser localStorage
2. **Self-Hosted Security**: Depends on your infrastructure
3. **OAuth Tokens**: Stored client-side for convenience

## 📋 Security Checklist for Deployment

- [ ] Strong `BETTER_AUTH_SECRET` configured
- [ ] HTTPS enabled
- [ ] Database password is strong
- [ ] Redis password configured (if used)
- [ ] Firewall rules configured
- [ ] Regular updates scheduled
- [ ] Backup strategy in place
- [ ] Monitoring/logging enabled

## 🏆 Hall of Fame

We appreciate security researchers who help keep Api Studio secure. Contributors who responsibly disclose vulnerabilities will be acknowledged here (with permission).

---

Thank you for helping keep Api Studio secure! 🔐
