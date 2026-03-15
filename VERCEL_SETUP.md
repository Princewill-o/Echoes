# ⚡ Quick Vercel Setup

## Step 1: Add Environment Variables in Vercel

Go to your Vercel project dashboard:
https://vercel.com/princewill-o/echoes/settings/environment-variables

Add these variables:

### Required Variable:

**Name:** `GITHUB_TOKEN`  
**Value:** Your GitHub Personal Access Token  
**Get it from:** https://github.com/settings/tokens  
**Scopes needed:** `repo`, `read:user`

Click "Generate new token (classic)" → Select scopes → Copy token

### Optional Variable:

**Name:** `OPENAI_API_KEY`  
**Value:** Your OpenAI API key (fallback)  
**Get it from:** https://platform.openai.com/api-keys

---

## Step 2: Redeploy

After adding environment variables:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

OR just push a new commit (already done!)

---

## Step 3: Test Your Deployment

Once deployed, visit:
```
https://echoes-princewill-o.vercel.app
```

Test these features:
- ✅ Landing page loads
- ✅ Create page works
- ✅ Lyrics generation works (needs GITHUB_TOKEN)
- ⚠️ Music generation won't work (needs local MusicGen)

---

## Important: MusicGen Won't Work on Vercel

The Python MusicGen service can't run on Vercel's serverless platform.

**For your hackathon demo:**
1. Show the deployed Vercel site for UI/UX
2. Run MusicGen locally for live music generation demo
3. Explain: "Production version would use dedicated GPU server"

**To run locally during demo:**
```bash
# Terminal 1: MusicGen
./start-musicgen.sh

# Terminal 2: Next.js (optional, use Vercel URL instead)
npm run dev
```

---

## Your Live URLs

**Production:** https://echoes-princewill-o.vercel.app  
**GitHub:** https://github.com/Princewill-o/Echoes

Add these to your presentation slides!

---

## Troubleshooting

**Build failed?**
- Check build logs in Vercel dashboard
- Look for TypeScript or dependency errors

**Lyrics not generating?**
- Verify GITHUB_TOKEN is added in Vercel
- Check it has correct scopes
- Redeploy after adding variables

**Still having issues?**
- Check Vercel function logs
- Test API routes: `https://your-url.vercel.app/api/analyze-memory`
- Verify environment variables are set correctly
