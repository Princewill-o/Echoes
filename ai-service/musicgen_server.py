from flask import Flask, request, jsonify
from flask_cors import CORS
from audiocraft.models import MusicGen
import torchaudio
import uuid
import os

app = Flask(__name__)
CORS(app)

print("Loading MusicGen model...")
model = MusicGen.get_pretrained("facebook/musicgen-small")
model.set_generation_params(duration=60)  # 60 seconds (1 minute)
print("Model loaded successfully!")

OUTPUT_DIR = "../public/audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.route("/generate", methods=["POST"])
def generate_music():
    try:
        data = request.json
        prompt = data.get("prompt")
        
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400
        
        print(f"Generating music for prompt: {prompt}")
        
        # Generate audio
        audio = model.generate([prompt])
        
        # Save to file
        filename = f"{uuid.uuid4()}.wav"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        torchaudio.save(filepath, audio[0].cpu(), 32000)
        
        print(f"Audio saved to: {filepath}")
        
        return jsonify({
            "audio_url": f"/audio/{filename}",
            "filename": filename
        })
    
    except Exception as e:
        print(f"Error generating music: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "musicgen-small"})

if __name__ == "__main__":
    print("Starting MusicGen server on http://localhost:5000")
    app.run(port=5000, debug=True)
