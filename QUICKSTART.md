# Quick Start Guide

Get your Feedback & Review System running in 5 minutes.

## 1️⃣ Install Dependencies

```bash
npm install
```

## 2️⃣ Setup Supabase

1. Create free account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Copy-paste `DATABASE_SCHEMA.sql` and execute
5. Go to Settings → API
6. Copy Project URL and Service Role Key

## 3️⃣ Setup Turnstile

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to Turnstile
3. Click "Add Site"
4. Enter site name and domain (or use `localhost:3000`)
5. Copy Site Key and Secret Key

## 4️⃣ Configure Environment

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=mypassword123
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x...
TURNSTILE_SECRET_KEY=1x...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5️⃣ Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Test It

### Public Feedback Page
- Visit: http://localhost:3000/feedback?project=app-one
- Submit test feedback

### Admin Dashboard
- Visit: http://localhost:3000/admin/login
- Login with credentials from `.env.local`
- Create new project
- View submitted reviews

## 📦 Deploy to Vercel

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub project
3. Add environment variables
4. Click Deploy

See `DEPLOYMENT.md` for detailed steps.

## 🎯 What's Included

✅ Public feedback form with star rating
✅ Admin dashboard with project management
✅ 4-layer bot protection (honeypot, timer, Turnstile, rate limiting)
✅ Secure HTTP-only cookie authentication
✅ IP-based rate limiting
✅ Review filtering and deletion
✅ Tailwind CSS styling
✅ Ready for Vercel free tier

## 📚 Learn More

- **README.md** - Full documentation
- **DEPLOYMENT.md** - Production deployment guide
- **DATABASE_SCHEMA.sql** - Database structure
- **CODE** - Inline comments throughout

## 💡 Tips

1. **Test Locally First**: Verify everything works before deploying
2. **Change Admin Password**: Use strong password for production
3. **Monitor Vercel Logs**: Check for errors in deployments
4. **Use Supabase Studio**: Visualize and manage data easily
5. **Test Rate Limiting**: Try submitting multiple reviews from same IP

## ⚡ Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint
```

## ❓ Common Issues

**"Turnstile verification failed"**
- Check site key matches your Turnstile project
- Make sure domain is added in Turnstile settings

**"Admin login not working"**
- Verify credentials in `.env.local`
- Clear browser cookies and try again

**"Too many submissions from your IP"**
- Rate limit is 3 per hour
- Wait an hour or change IP

**"Can't connect to Supabase"**
- Verify URL and keys are correct
- Make sure Supabase project is active

## 🎉 Done!

Your feedback system is running! 

Next steps:
1. Customize styling in `app/globals.css`
2. Add more projects in admin dashboard
3. Deploy to Vercel (see `DEPLOYMENT.md`)
4. Share feedback URL with users

---

Need help? Check `README.md` or `DEPLOYMENT.md` for more details.
