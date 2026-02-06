# AstroPinch Deployment Guide

## Environment Variables Setup

### Required Environment Variables

#### Backend (Python/FastAPI)
```
GROQ_API_KEY=<your-groq-api-key>
GEMINI_API_KEY=<your-gemini-api-key>
DATABASE_URL=<your-database-connection-string>
SECRET_KEY=<random-secret-key-for-jwt>
```

#### Frontend (React/Vite)
```
VITE_API_BASE_URL=<your-backend-api-url>
```

---

## Deployment Steps

### 1. Backend Deployment (Render)

1. **Create New Web Service** on Render
2. **Connect GitHub Repository**: `krahulgs/AstroPinch`
3. **Configure Build Settings:**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3.11+

4. **Add Environment Variables** (in Render dashboard):
   - `GROQ_API_KEY` → Get from https://console.groq.com
   - `GEMINI_API_KEY` → Get from https://makersuite.google.com/app/apikey
   - `DATABASE_URL` → Use Render PostgreSQL or external DB
   - `SECRET_KEY` → Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

5. **Deploy**: Render auto-deploys on push to main branch

---

### 2. Frontend Deployment (Vercel)

1. **Import Project** from GitHub
2. **Framework Preset**: Vite
3. **Build Settings:**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   - `VITE_API_BASE_URL` → Your Render backend URL (e.g., `https://astropinch-api.onrender.com`)

5. **Deploy**: Auto-deploys on push

---

### 3. Database Setup

#### Option A: Render PostgreSQL (Recommended)
1. Create PostgreSQL database on Render
2. Copy connection string
3. Set as `DATABASE_URL` in backend environment variables

#### Option B: SQLite (Development Only)
- Default: `sqlite:///./astropinch.db`
- Not recommended for production

---

## Getting API Keys

### Groq API Key
1. Visit: https://console.groq.com
2. Sign up / Log in
3. Navigate to API Keys
4. Create new key
5. Copy and save securely

### Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create API key
4. Copy and save securely

---

## Security Checklist

- [ ] Never commit `.env` file to Git
- [ ] Use different API keys for dev/prod
- [ ] Rotate SECRET_KEY in production
- [ ] Enable HTTPS only in production
- [ ] Set CORS origins to production domains only
- [ ] Use environment-specific database credentials
- [ ] Enable rate limiting on API endpoints
- [ ] Monitor API usage and set billing alerts

---

## Monitoring & Maintenance

### Health Checks
- Backend: `https://your-api.com/health`
- Frontend: Check homepage loads

### Logs
- **Render**: View logs in dashboard
- **Vercel**: Check deployment logs

### Updates
```bash
# Local development
git pull origin main
pip install -r requirements.txt
npm install

# Production
# Push to main branch → Auto-deploys
```

---

## Troubleshooting

### Backend Issues
1. Check Render logs for errors
2. Verify all environment variables are set
3. Test API endpoints with Postman/curl
4. Check database connection

### Frontend Issues
1. Verify `VITE_API_BASE_URL` is correct
2. Check browser console for errors
3. Ensure CORS is configured on backend
4. Clear browser cache

### AI Analysis Not Working
1. Verify API keys are valid
2. Check API rate limits
3. Review backend logs for AI service errors
4. Test with fallback message

---

## Cost Optimization

### Free Tier Limits
- **Groq**: 14,400 requests/day (free tier)
- **Gemini**: 60 requests/minute (free tier)
- **Render**: 750 hours/month (free tier)
- **Vercel**: Unlimited for personal projects

### Recommendations
- Use Groq as primary (faster, higher limits)
- Gemini as fallback
- Monitor usage in dashboards
- Set up billing alerts

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/krahulgs/AstroPinch/issues
- Documentation: Check README.md
- API Docs: https://your-api.com/docs (FastAPI auto-generated)
