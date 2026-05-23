# Feedback & Review Management System

A centralized, production-ready feedback and review management system built with Next.js 14+, Tailwind CSS, and Supabase. Designed to run efficiently on Vercel's free tier using Serverless Functions.

## 🌟 Features 

### Public Feedback Page
- **Dynamic Project Pages**: Accept feedback via `/feedback?project=slug`
- **Star Rating System**: 1-5 star rating with visual feedback
- **Text Comments**: Detailed feedback collection
- **Professional UI**: Clean, modern design with gradient backgrounds

### Multi-Layer Protection System
1. **Honeypot Field**: Hidden input field that silently rejects bot submissions
2. **Form Submission Timer**: Rejects submissions under 3 seconds (bot detection)
3. **Cloudflare Turnstile**: CAPTCHA verification on form submission
4. **IP-Based Rate Limiting**: Max 3 submissions per IP per hour

### Admin Dashboard
- **Secure Authentication**: HTTP-only cookie-based sessions (no NextAuth overhead)
- **Project Management**:
  - Create new projects with custom slugs
  - Edit project names
  - Delete projects (with cascade deletion of reviews)
  - View feedback URLs
- **Review Management**:
  - Browse all reviews across projects
  - Filter reviews by project
  - Delete fake or abusive reviews
  - View review statistics (total, average rating, positive/negative count)

### Server-Side Security
- Database credentials strictly in API routes
- No service role keys exposed to frontend
- Rate limiting based on hashed IP addresses
- Turnstile verification on backend
- Middleware protection for admin routes

## 📋 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.ts          # Admin login API
│   │   │   └── logout.ts         # Admin logout API
│   │   ├── reviews/
│   │   │   └── route.ts          # Submit feedback API
│   │   └── admin/
│   │       ├── projects/
│   │       │   ├── route.ts      # Create project
│   │       │   └── [id]/route.ts # Update/delete project
│   │       └── reviews/
│   │           └── [id]/route.ts # Delete review
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── login/page.tsx        # Admin login page
│   │   ├── AdminDashboard.tsx    # Dashboard client component
│   │   ├── ProjectManagement.tsx # Project CRUD UI
│   │   └── ReviewFeed.tsx        # Review list & filter
│   ├── feedback/
│   │   ├── page.tsx              # Public feedback page
│   │   ├── FeedbackForm.tsx      # Feedback form component
│   │   └── Turnstile.tsx         # Captcha component
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx                  # Home page
├── lib/
│   ├── supabase.ts               # Supabase client
│   └── security.ts               # Security utilities
├── middleware.ts                 # Admin route protection
├── DATABASE_SCHEMA.sql           # Supabase SQL setup
├── .env.local.example           # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.ts
```

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/OMKARREDDY8570/collecting-users-reviews.git
cd collecting-users-reviews
npm install
```

### 2. Setup Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy the SQL from `DATABASE_SCHEMA.sql`
3. Go to Supabase Dashboard → SQL Editor
4. Create a new query and paste the SQL
5. Execute to create tables and indexes

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting Supabase Keys:**
- Go to Supabase Dashboard → Settings → API
- Copy `URL` and `anon public key`
- Copy `service_role` key

**Getting Turnstile Keys:**
1. Visit [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to Turnstile
3. Create a new site
4. Copy Site Key and Secret Key

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- Home: http://localhost:3000
- Feedback: http://localhost:3000/feedback?project=app-one
- Admin: http://localhost:3000/admin/login

### 5. Deploy to Vercel

```bash
git push origin main
```

1. Import project on [vercel.com](https://vercel.com)
2. Add environment variables in Vercel Project Settings
3. Deploy

## 🔐 Security Details

### Bot Protection Layer

1. **Honeypot Field**: 
   - Hidden CSS field that bots typically fill
   - Silent rejection (no error shown to user)

2. **Form Timer**:
   - Tracks time between page load and submission
   - Rejects submissions < 3 seconds
   - Real users take time to read and fill form

3. **Cloudflare Turnstile**:
   - Industry-standard CAPTCHA alternative
   - Verified on backend with secret key
   - Cannot be bypassed from frontend

4. **IP Rate Limiting**:
   - Hashed IP addresses (SHA-256)
   - Max 3 submissions per IP per hour
   - Rolling window checking

### Admin Authentication

- No heavy dependencies (NextAuth, Passport)
- Lightweight JWT-like token system
- HTTP-only cookies (secure against XSS)
- Middleware verification on every request
- 24-hour session expiration

### Data Protection

- Database keys never exposed to client
- All sensitive operations in API routes
- Service role key restricted to server
- Foreign key constraints for data integrity
- Cascade deletion for project/review relationships

## 📊 Database Schema

### projects
```sql
id (UUID, PK)
slug (TEXT, UNIQUE) - e.g., 'app-one'
name (TEXT) - e.g., 'App One'
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### reviews
```sql
id (UUID, PK)
project_slug (TEXT, FK) - references projects.slug
rating (INT, 1-5)
comment (TEXT)
ip_hash (TEXT) - SHA-256 hash of user IP
created_at (TIMESTAMP)
```

**Indexes:**
- `idx_reviews_project_slug` - Fast project filtering
- `idx_reviews_ip_hash` - Rate limiting lookups
- `idx_reviews_created_at` - Timeline sorting
- `idx_projects_slug` - Project lookups

## 🌍 API Routes

### Public Routes

#### POST `/api/reviews`
Submit a new review
```json
{
  "project_slug": "app-one",
  "rating": 5,
  "comment": "Great app!",
  "turnstile_token": "..."
}
```

### Admin Routes (Protected)

#### POST `/api/admin/projects`
Create a new project
```json
{
  "name": "My App",
  "slug": "my-app"
}
```

#### PUT `/api/admin/projects/[id]`
Update project name
```json
{
  "name": "Updated Name"
}
```

#### DELETE `/api/admin/projects/[id]`
Delete a project (cascades to reviews)

#### DELETE `/api/admin/reviews/[id]`
Delete a specific review

#### POST `/api/auth/login`
Authenticate admin user
```json
{
  "username": "admin",
  "password": "your_password"
}
```

#### POST `/api/auth/logout`
Logout admin user

## 💰 Vercel Free Tier Optimization

- **No database server**: Supabase serverless
- **No long-running processes**: All operations are request-based
- **Minimal cold start**: Next.js optimized for Vercel
- **Static assets**: Leverages Vercel CDN
- **No external cron jobs**: All operations event-driven
- **Rate limiting**: Prevents abuse and excessive queries

Estimated cost on Vercel Free Tier with reasonable traffic:
- **$0/month** (with Supabase's free tier for development)

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Color Scheme**:
  - Primary: Blue (#2563eb)
  - Success: Green (#16a34a)
  - Danger: Red (#dc2626)
  - Warning: Orange (#f59e0b)

## 🔧 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | Private key (server-only) |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | Secure password |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile public key | Site key |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key | Server-side only |
| `NEXT_PUBLIC_APP_URL` | Application URL | `https://yourdomain.com` |

## 📝 Tips & Best Practices

1. **Change Admin Credentials**: Update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in production
2. **Use Strong Passwords**: Generate with `openssl rand -base64 32`
3. **Monitor Rate Limits**: Check review trends in admin dashboard
4. **Regular Backups**: Export Supabase data regularly
5. **Test Feedback Form**: Verify Turnstile works before deployment
6. **Monitor Logs**: Check Vercel function logs for errors

## 🐛 Troubleshooting

### "Turnstile verification failed"
- Verify Turnstile keys are correct
- Check site key matches in frontend
- Ensure secret key is server-side only

### "Too many submissions from your IP"
- Rate limit is 3 per hour per IP
- Hashed IP prevents tracking actual addresses
- Limit resets hourly

### Admin Login Not Working
- Verify credentials match `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Check cookies are enabled
- Clear browser cookies and try again

### Reviews Not Showing
- Verify project slug is correct
- Check Supabase tables have data
- Ensure Supabase connection is active

## 📚 Additional Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile)
- [Vercel Deployment](https://vercel.com/docs)

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for collecting user feedback efficiently and securely**
