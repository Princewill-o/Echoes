from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import uuid
import os
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

OUTPUT_DIR = "../public/audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Get API key from environment
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY', '')

print("✅ ElevenLabs Music Server Ready!")
print(f"API Key configured: {'Yes' if ELEVENLABS_API_KEY else 'No (using demo mode)'}")

@app.route("/generate", methods=["POST"])
def generate_music():
    try:
        data = request.json
        prompt = data.get("prompt")
        lyrics = data.get("lyrics", "")
        
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400
        
        print(f"🎵 Generating music with ElevenLabs")
        print(f"Prompt: {prompt}")
        
        if not ELEVENLABS_API_KEY:
            print("⚠️  No API key - using demo mode")
            return generate_demo_music(prompt)
        
        # Build the full prompt with lyrics if provided
        full_prompt = prompt
        if lyrics:
            # Format lyrics for ElevenLabs
            full_prompt = f"{prompt}\n\nLyrics:\n{lyrics}"
        
        # Call ElevenLabs Music API
        url = "https://api.elevenlabs.io/v1/music/compose"
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "prompt": full_prompt,
            "music_length_ms": 60000,  # 60 seconds
            "model_id": "music_v1"
        }
        
        print("📡 Calling ElevenLabs API...")
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        
        if response.status_code != 200:
            error_msg = f"ElevenLabs API error: {response.status_code}"
            print(f"❌ {error_msg}")
            print(f"Response: {response.text}")
            
            # If it's a payment error, fall back to demo mode
            if response.status_code == 402:
                print("⚠️  Music API requires paid plan - falling back to demo mode")
                return generate_demo_music(prompt)
            
            return jsonify({"error": error_msg, "details": response.text}), 500
        
        # Save the audio file
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Music generated: {filepath}")
        
        return jsonify({
            "audio_url": f"/audio/{filename}",
            "filename": filename,
            "duration": 60,
            "provider": "elevenlabs",
            "note": "Generated with ElevenLabs Music API"
        })
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

def generate_demo_music(prompt):
    """Fallback demo mode when no API key"""
    import struct
    import math
    
    print("🎵 Generating demo music (no API key)")
    time.sleep(2)
    
    filename = f"{uuid.uuid4()}.wav"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    # Generate 60 seconds of demo audio
    sample_rate = 44100
    duration = 60
    num_samples = sample_rate * duration
    
    # Determine mood from prompt
    prompt_lower = prompt.lower()
    if 'happy' in prompt_lower or 'joyful' in prompt_lower:
        scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
    elif 'sad' in prompt_lower or 'melancholic' in prompt_lower:
        scale = [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00]
    else:
        scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
    
    audio_data = []
    sections = [
        ('intro', 8, [0, 2, 4, 7]),
        ('verse', 16, [0, 2, 3, 2, 0, 4, 3, 2]),
        ('chorus', 12, [4, 5, 7, 5, 4, 2]),
        ('verse', 16, [0, 2, 3, 2, 0, 4, 3, 2]),
        ('outro', 8, [7, 5, 4, 2, 0])
    ]
    
    current_time = 0
    for section_name, section_duration, melody_pattern in sections:
        note_duration = section_duration / len(melody_pattern)
        
        for note_idx, scale_idx in enumerate(melody_pattern):
            note_samples = int(sample_rate * note_duration)
            freq = scale[scale_idx % len(scale)]
            
            for i in range(note_samples):
                if len(audio_data) >= num_samples:
                    break
                
                t = current_time + (note_idx * note_duration) + (i / sample_rate)
                sample = 0
                sample += 0.35 * math.sin(2 * math.pi * freq * t)
                sample += 0.20 * math.sin(2 * math.pi * freq * 2 * t)
                sample += 0.12 * math.sin(2 * math.pi * freq * 3 * t)
                sample += 0.15 * math.sin(2 * math.pi * (freq / 2) * t)
                
                note_progress = i / note_samples
                if note_progress < 0.05:
                    envelope = note_progress / 0.05
                elif note_progress < 0.15:
                    envelope = 1.0 - ((note_progress - 0.05) / 0.1) * 0.2
                elif note_progress < 0.85:
                    envelope = 0.8
                else:
                    envelope = 0.8 * (1.0 - ((note_progress - 0.85) / 0.15))
                
                sample *= envelope
                
                overall_progress = len(audio_data) / num_samples
                if overall_progress < 0.02:
                    sample *= overall_progress / 0.02
                elif overall_progress > 0.95:
                    sample *= (1.0 - overall_progress) / 0.05
                
                sample = int(sample * 32767 * 0.6)
                sample = max(-32768, min(32767, sample))
                audio_data.append(struct.pack('<h', sample))
        
        current_time += section_duration
    
    while len(audio_data) < num_samples:
        audio_data.append(struct.pack('<h', 0))
    
    # Write WAV file
    with open(filepath, 'wb') as f:
        f.write(b'RIFF')
        f.write((36 + num_samples * 2).to_bytes(4, 'little'))
        f.write(b'WAVE')
        f.write(b'fmt ')
        f.write((16).to_bytes(4, 'little'))
        f.write((1).to_bytes(2, 'little'))
        f.write((1).to_bytes(2, 'little'))
        f.write((sample_rate).to_bytes(4, 'little'))
        f.write((sample_rate * 2).to_bytes(4, 'little'))
        f.write((2).to_bytes(2, 'little'))
        f.write((16).to_bytes(2, 'little'))
        f.write(b'data')
        f.write((num_samples * 2).to_bytes(4, 'little'))
        for sample in audio_data:
            f.write(sample)
    
    print(f"✅ Demo audio created: {filepath}")
    
    return jsonify({
        "audio_url": f"/audio/{filename}",
        "filename": filename,
        "duration": 60,
        "provider": "demo",
        "note": "Demo mode - Add ELEVENLABS_API_KEY to .env.local for real music generation"
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "provider": "elevenlabs" if ELEVENLABS_API_KEY else "demo",
        "api_key_configured": bool(ELEVENLABS_API_KEY)
    })

if __name__ == "__main__":
    print("\n🚀 Starting ElevenLabs Music Server on http://localhost:5000")
    print("📝 Generates music with vocals and lyrics using ElevenLabs API")
    print("🎵 Supports 60-second songs with full vocal performance\n")
    app.run(port=5000, debug=True)
