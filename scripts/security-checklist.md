# Security Checklist (Production)

## Before going live

- [ ] Change `JWT_SECRET` to a long random string (≥ 32 chars)
- [ ] Set strong Postgres password and restrict network access
- [ ] Enable HTTPS only (reverse proxy: Nginx / Caddy / Traefik)
- [ ] Configure strict CORS (`WEB_ORIGIN` to your real domain)
- [ ] Enable Helmet in NestJS (or equivalent headers)
- [ ] Rate-limit all public endpoints (especially `/auth/request-otp`)
- [ ] Move OTP store from memory to Redis
- [ ] Move User & Car stores from memory to Prisma + PostgreSQL
- [ ] Enable Prisma migrations in CI/CD
- [ ] Set up daily encrypted backups off-site (S3 / another server)
- [ ] Review file upload limits and MIME validation
- [ ] Add audit logging for delete / visibility changes
- [ ] Disable source maps in production frontend build
- [ ] Set secure cookie flags if switching to cookie-based auth later
- [ ] Monitor 4xx/5xx and set alerts

## OTP / Auth

- Rate limit: max 5 OTP requests per mobile per 15 minutes
- Max 5 wrong attempts per code
- Code TTL: 5 minutes
- Never log real OTP codes in production

## Data

- Phone numbers hidden by default option for owners
- Soft delete only (isActive flag)
- Admin actions require Admin role
