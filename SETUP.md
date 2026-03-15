# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Get Your Suno API Key

**Option 1: SunoAPI.org (Recommended)**
1. Go to https://sunoapi.org
2. Click "Get Started" or "Sign Up"
3. Purchase credits (starts at $10 for ~50-100 songs)
4. Copy your API key from the dashboard

**Option 2: SunoAPI.com**
1. Go to https://www.sunoapi.com
2. Create an account
3. Buy credits
4. Get your API key

### Step 3: Create Environment File

Create a file named `.env.local` in the root folder:

```bash
# Required - Get from sunoapi.org
SUNO_API_KEY=sk-your-suno-key-here

# Optional - Get from platform.openai.com
# Without this, lyrics will be simpler but app still works
OPENAI_API_KEY=sk-your-openai-key-here
```

### Step 4: Run the App
```bash
npm run dev
```

Open http://localhost:3000 🎉

## ✅ What Works Without API Keys

| Feature | Without Keys | With Suno Only | With Both Keys |
|---------|-------------|----------------|----------------|
| UI/Interface | ✅ | ✅ | ✅ |
| Memory Input | ✅ | ✅ | ✅ |
| Basic Lyrics | ✅ | ✅ | ✅ |
| Smart Lyrics | ❌ | ❌ | ✅ |
| Audio Generation | ❌ | ✅ | ✅ |
| Full Experience | ❌ | ⚠️ Good | ✅ Perfect |

## 💰 Cost Breakdown

### Suno API
- **Price**: ~$0.10-0.20 per song
- **Credits**: $10 = 50-100 songs
- **No subscription**: Pay only for what you use

### OpenAI API (Optional)
- **Price**: ~$0.01-0.03 per song
- **Usage**: Only for lyrics analysis
- **Alternative**: App works without it

## 🎵 How Long Does Generation Take?

1. **Lyrics**: Instant (< 2 seconds)
2. **Music**: 1-2 minutes (Suno AI processing)
3. **Total**: ~2 minutes per song

The app shows a progress indicator and polls automatically.

## 🐛 Troubleshooting

### "Cannot find module 'lucide-react'"
```bash
npm install lucide-react
```

### "Suno API error"
- Check your API key is correct
- Verify you have credits
- Check https://sunoapi.org/status

### "Music not generating"
- Wait 2-3 minutes (it's processing)
- Check browser console for errors
- Verify SUNO_API_KEY in .env.local

### "Lyrics are too simple"
- Add OPENAI_API_KEY for better lyrics
- Or edit the lyrics manually after generation

## 📝 Testing Without API Keys

Want to test the UI first?

1. Skip the API keys
2. Run `npm run dev`
3. Create a memory
4. You'll see the UI and basic lyrics
5. Add API keys later for full functionality

## 🎯 Recommended Setup

**For Demo/Testing:**
- Suno API only ($10 for testing)
- Skip OpenAI (lyrics will be simpler)

**For Production:**
- Both APIs
- Better user experience
- Professional lyrics

## 🔗 Useful Links

- Suno API Docs: https://old-docs.sunoapi.org
- OpenAI Platform: https://platform.openai.com
- Next.js Docs: https://nextjs.org/docs

## 💡 Pro Tips

1. **Start Small**: Buy $10 Suno credits to test
2. **Monitor Usage**: Check your Suno dashboard
3. **Cache Results**: Songs are saved in localStorage
4. **Test Locally**: Everything works on localhost
5. **Deploy Later**: Get it working locally first

## Need Help?

Check the main README.md for detailed documentation!
