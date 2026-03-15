# Demo Mode - Quick Start

## ✅ What's Running

The **Simple Music Server** is now running on `http://localhost:5000`

This creates placeholder audio files so you can test the complete workflow without installing the heavy MusicGen dependencies.

## 🚀 Next Steps

### 1. Start the Next.js App

Open a **new terminal** and run:

```bash
npm run dev
```

### 2. Test the App

Visit: **http://localhost:3000**

1. Enter a memory: "Late night drive after graduation"
2. Click "Create My Song"
3. Wait for lyrics to generate (~3 seconds)
4. Review and edit the lyrics
5. Click "Generate Music"
6. Wait for "music" to generate (~2 seconds)
7. See the complete song page!

### 3. What You'll Get

- ✅ Real AI-generated lyrics (GitHub AI / OpenAI)
- ✅ Placeholder audio file (1 second of silence)
- ✅ Full UI workflow (4 stages)
- ✅ Download/Share functionality
- ✅ Song saved to library

## 📝 Note About Audio

The current server creates **placeholder audio files** (silent WAV files) for demonstration purposes.

### Why?

MusicGen requires:
- Python 3.10 or 3.11 (you have 3.13)
- Heavy dependencies (~2GB)
- Significant RAM (4GB+)
- Long installation time

### For Real Music Generation

If you want actual music:

1. **Install Python 3.10 or 3.11**
   ```bash
   brew install python@3.11
   ```

2. **Create virtual environment**
   ```bash
   cd ai-service
   python3.11 -m venv venv
   source venv/bin/activate
   ```

3. **Install MusicGen**
   ```bash
   pip install torch torchaudio audiocraft flask flask-cors
   ```

4. **Run MusicGen server**
   ```bash
   python musicgen_server.py
   ```

## 🎯 Current Capabilities

Even in demo mode, you can:

- ✅ Test the complete 4-stage workflow
- ✅ Generate real AI lyrics
- ✅ Edit lyrics before music generation
- ✅ See the full UI/UX
- ✅ Test download/share features
- ✅ Build your song library
- ✅ Verify all API integrations work

## 🔍 Testing

Visit the test page: **http://localhost:3000/test**

Click each button to verify:
1. ✅ MusicGen Health - Should show "demo-server"
2. ✅ Analyze Memory - Should return real lyrics
3. ✅ Generate Song - Should return audio_url

## 📊 What's Working

```
✅ Next.js Frontend
✅ API Routes
✅ GitHub AI Integration (Lyrics)
✅ Simple Music Server (Placeholder Audio)
✅ File Storage
✅ LocalStorage
✅ Download/Share Features
✅ Complete UI Workflow
```

## 🎵 The Full Experience

To experience real music generation:

1. Use Python 3.10 or 3.11
2. Install MusicGen dependencies
3. Run `musicgen_server.py` instead of `simple_server.py`
4. Wait ~10 seconds per song
5. Get real 30-second instrumental tracks!

## 💡 Tips

- The demo server is perfect for:
  - Testing the UI/UX
  - Developing features
  - Demonstrating the workflow
  - Verifying integrations

- Switch to real MusicGen when:
  - You need actual music
  - You have Python 3.10/3.11
  - You have time for installation
  - You have sufficient RAM

## 🎉 You're Ready!

The app is fully functional in demo mode. Create songs, test features, and enjoy the workflow!

Visit: **http://localhost:3000**
