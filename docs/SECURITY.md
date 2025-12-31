# Security Configuration Guide

## Overview

This document outlines the security measures implemented and recommended for the Morning Reader application.

---

## Implemented Security Measures

### 1. Rate Limiting

Rate limiting is implemented at the client level to prevent abuse:

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| AI Chat | 10 requests | 1 minute |
| General API | 30 requests | 1 minute |
| Write Operations | 5 requests | 1 minute |
| Create Post | 3 posts | 5 minutes |

**Implementation:** `lib/rateLimit.ts`

### 2. Content Safety

AI content moderation is integrated for all user-generated content:
- Posts
- Comments
- AI chat interactions

**Implementation:** `lib/ai.ts:checkContentSafety()`

### 3. Input Validation

All user inputs are validated using Zod schemas:
- Profile updates (`lib/schemas.ts:ProfileUpdateSchema`)
- Posts (`hooks/useCommunity.ts:CreatePostSchema`)
- Comments (`lib/schemas.ts:CommentSchema`)

### 4. Authentication

Authentication is handled by Supabase with built-in protections:
- HttpOnly Secure Cookies
- CSRF protection
- Session token signing
- Automatic token refresh

---

## Recommended Production Hardening

### 1. Content Security Policy (CSP)

Add CSP headers to prevent XSS attacks. Configure your hosting provider or add to `vite.config.ts`:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
```

### 2. Additional Security Headers

```http
# Prevent clickjacking
X-Frame-Options: DENY

# Prevent MIME sniffing
X-Content-Type-Options: nosniff

# Enable XSS filter
X-XSS-Protection: 1; mode=block

# Referrer policy
Referrer-Policy: strict-origin-when-cross-origin

# Permissions policy
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 3. Environment Configuration

For production, use a backend proxy to hide API keys:

```typescript
// Example: server/api/proxy.ts
app.post('/api/ai/chat', async (req, res) => {
  const response = await fetch('https://generativelanguage.googleapis.com/...', {
    headers: { 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` }
  });
  res.json(await response.json());
});
```

### 4. Supabase Row Level Security (RLS)

Enable RLS policies in Supabase:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

## Security Checklist

### Before Deployment

- [ ] Rotate all exposed API keys
- [ ] Remove `.env` from Git history
- [ ] Enable Supabase RLS policies
- [ ] Configure CSP headers
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Enable HTTPS only
- [ ] Review Supabase Auth settings (email confirmation, etc.)

### Regular Maintenance

- [ ] Review and update dependencies
- [ ] Rotate API keys quarterly
- [ ] Review rate limit settings
- [ ] Audit access logs
- [ ] Test authentication flows

---

## Incident Response

If a security breach is suspected:

1. **Immediate Actions:**
   - Rotate all API keys
   - Review access logs
   - Enable additional monitoring

2. **User Communication:**
   - Notify affected users
   - Provide password reset instructions
   - Document the breach timeline

3. **Post-Incident:**
   - Conduct root cause analysis
   - Update security policies
   - Implement additional safeguards

---

## Contact

For security concerns, contact the development team or create a security advisory through private channels.
