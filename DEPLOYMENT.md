# Deployment Guide

This guide walks through deploying the Feedback & Review Management System to Vercel.

## Prerequisites

- GitHub account with repository
- Supabase account with project
- Cloudflare account for Turnstile
- Vercel account

## Step 1: Prepare Supabase

### 1.1 Create Supabase Project

1. Visit [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Select organization and provide:
   - **Name**: Your project name
   - **Database Password**: Generate strong password
   - **Region**: Select closest to your users
4. Wait for project to initialize (5-10 minutes)

### 1.2 Setup Database Schema

1. Go to SQL Editor in Supabase
2. Click "New Query"
3. Copy entire contents of `DATABASE_SCHEMA.sql`
4. Paste into editor
5. Click "Run"
6. Verify tables created in Table Editor

### 1.3 Get Supabase Keys

1. Go to Project Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Setup Cloudflare Turnstile

### 2.1 Create Turnstile Account

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Login or create account
3. Navigate to Turnstile

### 2.2 Add New Site

1. Click "Add Site"
2. **Site Name**: Your app name
3. **Domain**: Your Vercel domain (e.g., `feedback-app.vercel.app`)
4. **Mode**: Managed Challenge (recommended)
5. Click "Create"
6. Copy:
   - **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - **Secret Key** → `TURNSTILE_SECRET_KEY`

### 2.3 Test Locally

Add to `.env.local` and test feedback form locally before deploying.

## Step 3: Push to GitHub

### 3.1 Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: Feedback system"
git branch -M main
git remote add origin https://github.com/yourusername/feedback-system.git
git push -u origin main
```

### 3.2 Create .gitignore

Already included, but verify:
- `node_modules/`
- `.next/`
- `.env.local`
- `.DS_Store`

## Step 4: Deploy to Vercel

### 4.1 Import Project

1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Paste GitHub URL and click Import
5. Select Next.js Framework

### 4.2 Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase API settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase API settings |
| `ADMIN_USERNAME` | Choose secure username |
| `ADMIN_PASSWORD` | Generate: `openssl rand -base64 32` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | From Cloudflare Turnstile |
| `TURNSTILE_SECRET_KEY` | From Cloudflare Turnstile |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL |
| `SESSION_SECRET` | Generate: `openssl rand -base64 32` |

### 4.3 Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your app is live!

## Step 5: Post-Deployment

### 5.1 Update Turnstile Domain

1. Go to Cloudflare Turnstile
2. Edit your site
3. Update Domain to your Vercel domain if changed
4. Save

### 5.2 Test Features

1. **Public Feedback**: `/feedback?project=app-one`
2. **Admin Login**: `/admin/login`
   - Username: Your `ADMIN_USERNAME`
   - Password: Your `ADMIN_PASSWORD`
3. **Create Project**: Add new project from admin
4. **Submit Feedback**: Test feedback form with new project

### 5.3 Setup Custom Domain (Optional)

1. In Vercel → Project Settings → Domains
2. Add your custom domain
3. Follow DNS instructions
4. Update Turnstile domain to match

## Step 6: Continuous Deployment

### GitHub Integration

Once imported, Vercel automatically:
- Deploys on every `git push` to `main`
- Creates preview deployments for pull requests
- Shows build status in GitHub

### To Deploy New Changes

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically redeploy within minutes.

## Monitoring & Maintenance

### Vercel Dashboard

Monitor:
- **Deployments**: View all deploys and rollback if needed
- **Functions**: Check serverless function performance
- **Analytics**: View traffic and performance metrics
- **Logs**: Real-time function logs

### Supabase Dashboard

Monitor:
- **Database**: View query performance
- **Auth**: Monitor user access (if added later)
- **Storage**: Check file storage usage
- **Logs**: SQL query logs for debugging

### Debugging

**To view function logs:**

1. Vercel Dashboard → Your Project → Functions
2. Select function and view logs
3. Use `console.log()` in API routes

**Database Issues:**

1. Go to Supabase Dashboard → SQL Editor
2. Query data directly:
   ```sql
   SELECT * FROM reviews LIMIT 10;
   SELECT * FROM projects;
   ```

## Performance Optimization

### Already Implemented

- ✅ React Server Components for minimal JS
- ✅ Image optimization via Next.js
- ✅ CSS minification via Tailwind
- ✅ Database indexes for fast queries
- ✅ Efficient rate limiting checks

### Additional Tips

1. **CDN**: Vercel CDN caches static content
2. **ISR**: Could add Incremental Static Regeneration for stats page
3. **Edge**: Could move security checks to Vercel Edge Functions
4. **Analytics**: Consider adding Vercel Web Analytics

## Scaling

### Free Tier Limits

- **Vercel**: 100 GB/month bandwidth
- **Supabase**: 500 MB database storage
- **Turnstile**: 300k checks/month free

### Upgrading

When you exceed limits:

1. **Vercel Pro**: $20/month for more functions
2. **Supabase Pro**: $25/month for more database
3. **Cloudflare Pro**: $20/month for Turnstile

## Security Checklist

Before going to production:

- [ ] Change `ADMIN_PASSWORD` to strong value
- [ ] Change `SESSION_SECRET` to random value
- [ ] Verify Supabase RLS policies
- [ ] Test admin login with new credentials
- [ ] Test feedback form with Turnstile
- [ ] Verify IP rate limiting works
- [ ] Check error messages don't leak info
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Setup monitoring/alerts

## Troubleshooting

### Deployment Failed

Check Vercel logs:
1. Vercel Dashboard → Deployments
2. Click failed deployment
3. View build logs
4. Common issues:
   - Missing environment variable
   - Node version mismatch
   - Syntax errors in code

### Connection to Supabase Failed

1. Verify URL and keys are correct
2. Check Supabase project is active
3. Test connection locally first
4. Verify IP is whitelisted (if applicable)

### Turnstile Not Working

1. Verify site key matches
2. Check domain is added to Turnstile
3. Test locally with test keys
4. Check secret key is server-side only

### Admin Login Loop

1. Verify credentials in environment
2. Check session secret is set
3. Clear browser cookies
4. Check middleware.ts is present

## Rolling Back

If deployment breaks:

1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click → "Redeploy"
4. Vercel reinstalls and deploys that version

## Support

For deployment help:
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile)

---

**Deployment complete! Your feedback system is live.** 🚀
