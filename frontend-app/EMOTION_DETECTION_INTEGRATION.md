# Emotion Detection Integration Guide

## Overview

The React frontend has been successfully integrated with webcam-based emotion detection capabilities. The system captures video frames from the user's webcam every 5 seconds and sends them to your Flask backend for emotion analysis.

## Frontend Implementation

### Components Modified

1. **EmotionContext.tsx** - Main context provider that handles:
   - Webcam initialization and stream management
   - Frame capture every 5 seconds
   - API communication with Flask backend
   - Emotion state management
   - Error handling for camera access and API calls

2. **EmotionDetector.tsx** - UI component that provides:
   - Manual emotion override via dropdown menu
   - Start/Stop detection toggle
   - Live camera preview in a modal dialog
   - Real-time detection status display
   - Visual indicators for active detection

### Features Implemented

✅ **Webcam Access**
- Uses `getUserMedia` API to access the user's camera
- Handles permission denials gracefully
- Displays error messages to the user

✅ **Frame Capture**
- Captures frames every 5 seconds automatically
- Uses a hidden canvas element to extract frame data
- Converts frames to JPEG format for efficient transmission

✅ **API Integration**
- Sends frames as `multipart/form-data` to backend
- Endpoint: `POST http://localhost:5000/emotion`
- Expects JSON response: `{ "emotion": "happy" }`

✅ **UI Components**
- Live video preview in modal dialog
- Recording indicator with pulsing red dot
- Current emotion display
- Last detection timestamp
- Status information panel
- Start/Stop controls

✅ **Error Handling**
- Camera permission errors
- API communication failures
- Invalid emotion responses
- Network timeouts

## Backend API Requirements

Your Flask backend should expose the following endpoint:

### Endpoint: POST /emotion

**Request Format:**
```
Content-Type: multipart/form-data
Body: image file (JPEG format)
```

**Example Request:**
```python
# The frontend sends a FormData object with the image
# In Flask, you can access it like this:

from flask import Flask, request, jsonify
from flask_cors import CORS
import io
from PIL import Image

app = Flask(__name__)
CORS(app)  # Important: Enable CORS for localhost:5173

@app.route('/emotion', methods=['POST'])
def detect_emotion():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image_file = request.files['image']
    
    # Convert to PIL Image
    image = Image.open(io.BytesIO(image_file.read()))
    
    # Your DeepFace emotion detection logic here
    # emotion = detect_emotion_from_image(image)
    
    # Return emotion as JSON
    return jsonify({'emotion': 'happy'})  # Replace with actual detection

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

**Response Format:**
```json
{
  "emotion": "happy"
}
```

**Valid Emotion Values:**
- `"calm"`
- `"stressed"`
- `"happy"`
- `"focused"`
- `"tired"`
- `"confused"`

### CORS Configuration

**IMPORTANT:** Your Flask backend must enable CORS to allow requests from `http://localhost:5173` (Vite dev server).

Install flask-cors:
```bash
pip install flask-cors
```

Enable CORS in your Flask app:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows all origins
# OR for more security:
# CORS(app, origins=['http://localhost:5173'])
```

## Usage Instructions

### For Users

1. **Start Emotion Detection:**
   - Click the emotion button in the top navigation
   - Select "Start Auto-Detection"
   - Grant camera permissions when prompted

2. **View Camera Preview:**
   - Click the emotion button
   - Select "Show Camera"
   - The modal will display live camera feed and detection status

3. **Manual Override:**
   - Click the emotion button
   - Select any emotion from the dropdown to override auto-detection

4. **Stop Detection:**
   - Click the emotion button
   - Select "Stop Auto-Detection"
   - Camera will be released and detection will stop

### For Developers

**Starting the Development Environment:**

1. Start Flask Backend:
```bash
cd backend
python app.py
# Backend should run on http://localhost:5000
```

2. Start React Frontend:
```bash
# From project root
npm run dev
# Frontend should run on http://localhost:5173
```

**Testing the Integration:**

1. Open browser console (F12)
2. Start emotion detection
3. Check console for logs:
   - "Detected emotion: [emotion]" - successful detection
   - Errors will be logged if API call fails

## Technical Details

### Data Flow

```
User's Face
    ↓
Webcam (getUserMedia)
    ↓
<video> element (autoplay)
    ↓
Hidden <canvas> element (every 5s)
    ↓
canvas.toBlob() → JPEG
    ↓
FormData with image blob
    ↓
fetch() POST to http://localhost:5000/emotion
    ↓
Backend DeepFace Analysis
    ↓
JSON Response { emotion: "happy" }
    ↓
Update React State
    ↓
UI Updates Automatically
```

### File Structure

```
/src/app/
├── components/
│   ├── EmotionDetector.tsx       # UI component with camera preview
│   ├── Dashboard.jsx              # Shows detected emotion
│   └── RootLayout.jsx            # Contains EmotionDetector in nav
├── contexts/
│   └── EmotionContext.tsx        # Webcam & API logic
└── hooks/
    └── useEmotionTheme.js        # Theme based on emotion
```

### Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (requires HTTPS in production)
- Mobile browsers: ⚠️ Limited (camera access may vary)

### Security Considerations

1. **Camera Permissions:**
   - Users must explicitly grant camera access
   - Permissions can be revoked at any time via browser settings

2. **HTTPS Requirement:**
   - `getUserMedia` requires HTTPS in production
   - `localhost` is exempt from this requirement

3. **Data Privacy:**
   - Frames are only sent to backend, not stored
   - No video recording occurs
   - Camera stops immediately when detection is stopped

## Troubleshooting

### Camera Not Working

**Error: "Failed to access camera"**
- Check if camera permissions are granted
- Ensure no other app is using the camera
- Try refreshing the page

### API Connection Failed

**Error: "Failed to communicate with emotion detection service"**
- Verify Flask backend is running on port 5000
- Check CORS is enabled in Flask
- Open Network tab in browser DevTools to see request details

### Invalid Emotion Received

**Warning in console: "Invalid emotion received"**
- Backend must return one of: calm, stressed, happy, focused, tired, confused
- Check backend response format matches: `{ "emotion": "value" }`

### Camera Preview is Black

- Wait 1-2 seconds for camera to initialize
- Check browser console for errors
- Verify camera is not being used by another application

## Next Steps

1. **Implement DeepFace Integration:**
   - Add DeepFace emotion detection to your Flask backend
   - Process the received image frames
   - Return detected emotions

2. **Optimize Performance:**
   - Adjust frame capture interval if needed (currently 5 seconds)
   - Compress images if API calls are slow
   - Add request queuing if needed

3. **Enhance UX:**
   - Add loading indicators during detection
   - Show emotion confidence scores
   - Add emotion history graph

4. **Production Deployment:**
   - Configure HTTPS for production
   - Update API endpoint URL
   - Set up proper CORS origins
   - Add rate limiting to backend

## Support

For issues or questions:
1. Check browser console for detailed error messages
2. Verify backend logs for API request details
3. Test backend endpoint independently using Postman/curl
4. Ensure both frontend and backend are running on correct ports
