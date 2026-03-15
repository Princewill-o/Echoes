from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import os
import time
import struct
import math

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

OUTPUT_DIR = "../public/audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("✅ Simple Music Server Ready!")
print("Note: This is a demo server that creates placeholder audio files.")
print("For real music generation, install MusicGen with Python 3.10 or 3.11")

@app.route("/generate", methods=["POST"])
def generate_music():
    try:
        data = request.json
        prompt = data.get("prompt")
        
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400
        
        print(f"🎵 Generating music for prompt: {prompt}")
        
        # Simulate generation time
        time.sleep(2)
        
        # Create a 60-second audio file with melody based on genre/mood
        filename = f"{uuid.uuid4()}.wav"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        # Generate 60 seconds of audio with a richer melody
        sample_rate = 44100
        duration = 60  # 1 minute
        num_samples = sample_rate * duration
        
        # Parse prompt to determine style
        prompt_lower = prompt.lower()
        
        # Determine tempo based on prompt
        if 'slow' in prompt_lower or 'melancholic' in prompt_lower or 'sad' in prompt_lower:
            tempo = 0.5  # Slower
        elif 'fast' in prompt_lower or 'energetic' in prompt_lower or 'upbeat' in prompt_lower:
            tempo = 1.5  # Faster
        else:
            tempo = 1.0  # Medium
        
        # Determine mood/key
        if 'happy' in prompt_lower or 'joyful' in prompt_lower or 'euphoric' in prompt_lower:
            # Major key - happier sound
            scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]  # C major
        elif 'sad' in prompt_lower or 'melancholic' in prompt_lower or 'dark' in prompt_lower:
            # Minor key - sadder sound
            scale = [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00]  # A minor
        else:
            # Neutral/mixed
            scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]  # C major
        
        # Create audio data with a musical progression
        audio_data = []
        
        # Song structure: Intro (8s) -> Verse (16s) -> Chorus (12s) -> Verse (16s) -> Outro (8s)
        sections = [
            ('intro', 8, [0, 2, 4, 7]),      # Intro melody
            ('verse', 16, [0, 2, 3, 2, 0, 4, 3, 2]),  # Verse melody
            ('chorus', 12, [4, 5, 7, 5, 4, 2]),  # Chorus melody
            ('verse', 16, [0, 2, 3, 2, 0, 4, 3, 2]),  # Verse repeat
            ('outro', 8, [7, 5, 4, 2, 0])    # Outro melody
        ]
        
        current_time = 0
        
        for section_name, section_duration, melody_pattern in sections:
            section_samples = int(sample_rate * section_duration)
            note_duration = section_duration / len(melody_pattern)
            
            for note_idx, scale_idx in enumerate(melody_pattern):
                note_start = current_time + (note_idx * note_duration)
                note_samples = int(sample_rate * note_duration)
                
                freq = scale[scale_idx % len(scale)]
                
                for i in range(note_samples):
                    if len(audio_data) >= num_samples:
                        break
                    
                    t = (current_time + (note_idx * note_duration) + (i / sample_rate))
                    
                    # Generate richer sound with multiple harmonics
                    sample = 0
                    sample += 0.35 * math.sin(2 * math.pi * freq * t)  # Fundamental
                    sample += 0.20 * math.sin(2 * math.pi * freq * 2 * t)  # 2nd harmonic
                    sample += 0.12 * math.sin(2 * math.pi * freq * 3 * t)  # 3rd harmonic
                    sample += 0.08 * math.sin(2 * math.pi * freq * 4 * t)  # 4th harmonic
                    
                    # Add subtle bass
                    sample += 0.15 * math.sin(2 * math.pi * (freq / 2) * t)
                    
                    # Apply note envelope (ADSR-like)
                    note_progress = (i / note_samples)
                    if note_progress < 0.05:  # Attack
                        envelope = note_progress / 0.05
                    elif note_progress < 0.15:  # Decay
                        envelope = 1.0 - ((note_progress - 0.05) / 0.1) * 0.2
                    elif note_progress < 0.85:  # Sustain
                        envelope = 0.8
                    else:  # Release
                        envelope = 0.8 * (1.0 - ((note_progress - 0.85) / 0.15))
                    
                    sample *= envelope
                    
                    # Apply overall fade in/out
                    overall_progress = len(audio_data) / num_samples
                    if overall_progress < 0.02:  # Fade in
                        sample *= overall_progress / 0.02
                    elif overall_progress > 0.95:  # Fade out
                        sample *= (1.0 - overall_progress) / 0.05
                    
                    # Convert to 16-bit PCM
                    sample = int(sample * 32767 * 0.6)  # 60% volume
                    sample = max(-32768, min(32767, sample))
                    audio_data.append(struct.pack('<h', sample))
            
            current_time += section_duration
        
        # Pad to exactly 60 seconds if needed
        while len(audio_data) < num_samples:
            audio_data.append(struct.pack('<h', 0))
        
        # Write WAV file
        with open(filepath, 'wb') as f:
            # RIFF header
            f.write(b'RIFF')
            f.write((36 + num_samples * 2).to_bytes(4, 'little'))
            f.write(b'WAVE')
            
            # fmt chunk
            f.write(b'fmt ')
            f.write((16).to_bytes(4, 'little'))
            f.write((1).to_bytes(2, 'little'))   # PCM
            f.write((1).to_bytes(2, 'little'))   # Mono
            f.write((sample_rate).to_bytes(4, 'little'))
            f.write((sample_rate * 2).to_bytes(4, 'little'))  # Byte rate
            f.write((2).to_bytes(2, 'little'))   # Block align
            f.write((16).to_bytes(2, 'little'))  # Bits per sample
            
            # data chunk
            f.write(b'data')
            f.write((num_samples * 2).to_bytes(4, 'little'))
            for sample in audio_data:
                f.write(sample)
        
        print(f"✅ Audio file created: {filepath} (60 seconds)")
        
        return jsonify({
            "audio_url": f"/audio/{filename}",
            "filename": filename,
            "duration": duration,
            "note": "This is a 60-second instrumental demo. For AI vocals, you need a text-to-speech singing model like Suno AI or Stable Audio."
        })
    
    except Exception as e:
        print(f"❌ Error generating music: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model": "demo-server",
        "note": "Using placeholder audio. Install MusicGen for real generation."
    })

if __name__ == "__main__":
    print("\n🚀 Starting Simple Music Server on http://localhost:5000")
    print("📝 This creates placeholder audio files for testing")
    print("🎵 For real music, use Python 3.10/3.11 and install MusicGen\n")
    app.run(port=5000, debug=True)
