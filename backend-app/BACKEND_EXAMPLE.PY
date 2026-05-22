
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import numpy as np
from PIL import Image
import cv2

app = Flask(__name__)

CORS(app)
EMOTION_MAPPING = {
    "happy": "happy",
    "neutral": "calm",
    "sad": "tired",
    "angry": "focused",
    "fear": "stressed",
    "surprise": "confused",
    "disgust": "tired",
}
def detect_emotion_deepface(image):
    
    try:
        from deepface import DeepFace
        
        img_array = np.array(image)
        
        img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        
       
        result = DeepFace.analyze(
            img_path=img_bgr,
            actions=['emotion'],
            enforce_detection=False,
            detector_backend='opencv'  

        )
        
       
        if isinstance(result, list):
            result = result[0]
        
        #
        dominant_emotion = result['dominant_emotion']
        
        mapped_emotion = EMOTION_MAPPING.get(dominant_emotion, 'calm')
        
        print(f"DeepFace detected: {dominant_emotion} -> Mapped to: {mapped_emotion}")
        
        return mapped_emotion
        
    except ImportError:
        print("DeepFace not installed. Using mock detection.")
        return mock_emotion_detection()
    except Exception as e:
        print(f"Error in emotion detection: {str(e)}")
        return 'calm'

def mock_emotion_detection():
    
    import random
    emotions = ['happy', 'neutral', 'sad', 'angry', 'fear', 'surprise', 'disgust']
    return random.choice(emotions)

@app.route('/emotion', methods=['POST', 'OPTIONS'])
def detect_emotion():
   
    
    
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
   
    if 'image' not in request.files:
        return jsonify({
            'error': 'No image provided',
            'emotion': 'Boredom'  
        }), 400
    
    try:
        
        image_file = request.files['image']
        
       
        image = Image.open(io.BytesIO(image_file.read()))
        
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        print(f"Received image: {image.size[0]}x{image.size[1]} pixels")
        
        
        detected_emotion = detect_emotion_deepface(image)
        
        
        response = jsonify({
            'emotion': detected_emotion,
            'timestamp': datetime.now().isoformat()
        })
        
        return response, 200
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({
            'error': str(e),
            'emotion': 'Engagement'  
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Emotion detection API is running'
    }), 200

@app.route('/', methods=['GET'])
def index():
    """Root endpoint with API information"""
    return jsonify({
        'name': 'Emotion Detection API',
        'version': '1.0',
        'endpoints': {
            'POST /emotion': 'Detect emotion from image',
            'GET /health': 'Health check',
        },
        'supported_emotions': ['happy', 'neutral', 'sad', 'angry', 'fear', 'surprise', 'disgust']
    })

if __name__ == '__main__':
    from datetime import datetime
    
    print("=" * 60)
    print("Emotion Detection API Server")
    print("=" * 60)
    print(f"Starting server on http://localhost:5000")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print("\nEndpoints:")
    print("  POST http://localhost:5000/emotion - Detect emotion from image")
    print("  GET  http://localhost:5000/health  - Health check")
    print("  GET  http://localhost:5000/        - API information")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 60)
    
    app.run(
        host='0.0.0.0', 
        port=5000,
        debug=True,     
        threaded=True   
    )
