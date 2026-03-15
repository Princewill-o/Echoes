# Deployment Guide for Echoes

## Vercel Deployment (Recommended)

### 1. Environment Variables Setup

In your Vercel dashboard, add these environment variables:

**Required:**
- `GITHUB_TOKEN` - Your GitHub Personal Access Token
  - Get it from: https://github.com/settings/tokens
  - Scopes needed: `repo`, `read:user`

**Optional:**
- `OPENAI_API_KEY` - OpenAI API key (fallback if GitHub AI fails)
  - Get it from: https://platform.openai.com/api-keys

### 2. Deploy Steps

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables (see above)
4. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel --prod
```

When prompted, add your environment variables.

### 3. Important Notes

⚠️ **MusicGen Service Limitation:**
The Python MusicGen service (`ai-service/musicgen_server.py`) will NOT work on Vercel because:
- Vercel doesn't support long-running Python processes
- MusicGen requires GPU/significant compute resources
- Serverless functions have 10-second timeout

**Solutions:**
1. **For Hackathon Demo:** Use the deployed site for UI showcase, run MusicGen locally
2. **For Production:** Deploy MusicGen separately on:
   - Railway.app (supports Python + long processes)
   - Render.com (supports background workers)
   - AWS EC2 / Google Cloud (full control)
   - Modal.com (serverless GPU)

### 4. Update API Endpoints

If you deploy MusicGen separately, update the endpoint in:

`app/api/generate-song/route.ts`:
```typescript
const MUSICGEN_URL = process.env.MUSICGEN_URL || 'http://localhost:5000';
```

Add `MUSICGEN_URL` to Vercel environment variables.

### 5. Demo Mode (Without MusicGen)

The app will gracefully handle MusicGen being unavailable:
- Lyrics generation will still work
- Users can see the full UI flow
- Error message explains MusicGen is offline

This is perfect for hackathon presentations where you demo the UI on Vercel and run MusicGen locally for live music generation.

## Alternative: Deploy Everything Locally

For hackathon demos, you can:
1. Deploy frontend to Vercel (for judges to see UI)
2. Run full stack locally during live demo (for music generation)
3. Show both: "Here's the live site" + "Here's it working with music"

## Post-Deployment Checklist

- [ ] Vercel deployment successful
- [ ] Environment variables added
- [ ] Test lyrics generation on deployed site
- [ ] Confirm MusicGen strategy (local vs separate deployment)
- [ ] Update README with live demo link
- [ ] Test on mobile devices
- [ ] Check console for any errors

## Troubleshooting

**Build fails with TypeScript errors:**
```bash
npm run build
```
Fix any errors locally first.

**Environment variables not working:**
- Make sure they're added in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

**API routes returning 500:**
- Check Vercel function logs
- Verify environment variables are set
- Test API routes locally first

## Your Deployed URLs

After deployment, you'll have:
- **Production:** https://echoes-[your-username].vercel.app
- **Preview:** Auto-generated for each commit
- **API Routes:** https://echoes-[your-username].vercel.app/api/*

Update your README.md with the live URL!
