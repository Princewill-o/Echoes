# Setup Checklist

## Prerequisites
- [ ] Node.js 18+ installed
- [ ] Python 3.8+ installed
- [ ] pip (Python package manager)
- [ ] 4GB+ RAM available
- [ ] 2GB+ disk space for MusicGen model

## Installation

### 1. Node Dependencies
```bash
npm install
```
- [ ] Dependencies installed successfully

### 2. Environment Variables
```bash
cp .env.local.example .env.local
# Edit .env.local and add your GITHUB_TOKEN
```
- [ ] `.env.local` file created
- [ ] `GITHUB_TOKEN` added

### 3. Python Dependencies
```bash
cd ai-service
pip install -r requirements.txt
```
- [ ] torch installed
- [ ] torchaudio installed
- [ ] audiocraft installed
- [ ] flask installed
- [ ] flask-cors installed

## Running the App

### Terminal 1: MusicGen Service
```bash
./start-musicgen.sh
```
- [ ] Service starts without errors
- [ ] Model loads successfully
- [ ] Server running on http://localhost:5000
- [ ] Health check passes: `curl http://localhost:5000/health`

### Terminal 2: Next.js App
```bash
npm run dev
```
- [ ] App starts without errors
- [ ] Server running on http://localhost:3000
- [ ] No compilation errors

## Testing

### 1. Open App
- [ ] Visit http://localhost:3000
- [ ] Landing page loads
- [ ] No console errors

### 2. Create a Song
- [ ] Enter a memory
- [ ] Click "Create My Song"
- [ ] Stage 1: Lyrics generate successfully
- [ ] Stage 2: Can review and edit lyrics
- [ ] Stage 3: Music generates successfully
- [ ] Stage 4: Audio plays correctly

### 3. Features
- [ ] Play/Pause works
- [ ] Download button works
- [ ] Share button works
- [ ] Song saves to library
- [ ] Library page shows song
- [ ] Dark/Light mode toggle works

## Troubleshooting

### MusicGen Issues
- [ ] Check Python version: `python3 --version`
- [ ] Check if port 5000 is available
- [ ] Review Terminal 1 logs for errors
- [ ] Try reinstalling: `pip install -r requirements.txt --force-reinstall`

### Next.js Issues
- [ ] Check Node version: `node --version`
- [ ] Clear .next folder: `rm -rf .next`
- [ ] Reinstall: `rm -rf node_modules && npm install`
- [ ] Check browser console for errors

### API Issues
- [ ] Verify GITHUB_TOKEN is valid
- [ ] Check API rate limits
- [ ] Test endpoints: `./test-api.sh`

## Optional Enhancements

### FFmpeg (for MP3 conversion)
```bash
# macOS
brew install ffmpeg

# Linux
sudo apt-get install ffmpeg
```
- [ ] FFmpeg installed
- [ ] MP3 conversion works

### GPU Acceleration (faster generation)
- [ ] CUDA installed (NVIDIA GPU)
- [ ] PyTorch with CUDA support
- [ ] Switch to musicgen-medium or musicgen-large

## Documentation Read
- [ ] README.md
- [ ] QUICK_START.md
- [ ] WORKFLOW.md
- [ ] MUSICGEN_SETUP.md

## Ready to Go! 🎉
- [ ] All checks passed
- [ ] App is running smoothly
- [ ] Created first song successfully

## Support
If you encounter issues:
1. Check the logs in both terminals
2. Review browser console
3. Consult MUSICGEN_SETUP.md
4. Check GitHub issues

Happy music making! 🎵
