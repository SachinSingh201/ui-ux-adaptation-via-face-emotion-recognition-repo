# Emotion Detection Testing Guide

## Quick Start Testing

### Step 1: Start the Backend

Option A - Using the Example Backend (Mock/DeepFace):
```bash
python BACKEND_EXAMPLE.py
```

Option B - Using Your Own Backend:
```bash
cd backend
python app.py
```

You should see:
```
Emotion Detection API Server
Starting server on http://localhost:5000
```

### Step 2: Test Backend Endpoint

Open a new terminal and test the backend is working:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Emotion detection API is running"
}
```

### Step 3: Start the Frontend

In your project directory:
```bash
npm run dev
```

The frontend should start at: `http://localhost:5173`

### Step 4: Test the Integration

1. **Open the Application:**
   - Navigate to `http://localhost:5173`
   - Sign up or log in
   - Go to Dashboard

2. **Start Emotion Detection:**
   - Click the emotion button in the top navigation (shows current emotion like "Calm")
   - Click "Start Auto-Detection"
   - Grant camera permissions when prompted

3. **Verify Camera Access:**
   - Click the emotion button again
   - Click "Show Camera"
   - You should see your webcam feed in a modal

4. **Check Detection is Working:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - You should see logs every 5 seconds:
     ```
     Detected emotion: happy
     ```

5. **Verify UI Updates:**
   - The emotion button should update to show the detected emotion
   - The greeting message on dashboard should change based on emotion
   - Theme colors may change based on emotion

## Testing Checklist

### Frontend Tests

- [ ] Camera permission request appears
- [ ] Camera permission can be granted
- [ ] Video preview shows in modal dialog
- [ ] Video preview is not blank/black
- [ ] Recording indicator (red dot) is visible and pulsing
- [ ] Current emotion displays in modal
- [ ] Last detection timestamp updates
- [ ] Can manually override emotion from dropdown
- [ ] Can stop detection
- [ ] Camera stops when detection is stopped
- [ ] No camera access errors in console

### Backend Tests

- [ ] Backend starts without errors
- [ ] `/health` endpoint returns 200
- [ ] `/emotion` endpoint accepts POST requests
- [ ] CORS headers are present
- [ ] Image file is received in backend
- [ ] Emotion is detected and returned
- [ ] Valid emotion values returned (calm, stressed, happy, focused, tired, confused)

### Integration Tests

- [ ] Frontend can reach backend at `http://localhost:5000`
- [ ] No CORS errors in browser console
- [ ] Frames are sent every 5 seconds
- [ ] Emotion state updates in React
- [ ] UI reflects emotion changes
- [ ] Network tab shows successful POST requests

## Common Issues and Solutions

### Issue 1: CORS Error

**Symptoms:**
```
Access to fetch at 'http://localhost:5000/emotion' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
```python
# In your Flask app:
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Add this line
```

### Issue 2: Camera Access Denied

**Symptoms:**
- Error message: "Failed to access camera"
- Video preview is black or shows error

**Solutions:**
1. Check browser permissions:
   - Chrome: Click lock icon in address bar → Camera → Allow
   - Firefox: Click lock icon → Permissions → Camera → Allow
   
2. Close other apps using camera (Zoom, Teams, etc.)

3. Try a different browser

4. Check if camera is physically covered/disabled

### Issue 3: Backend Not Receiving Images

**Symptoms:**
- Console shows: "Error sending frame to backend"
- Network tab shows failed requests

**Solutions:**
1. Verify backend is running: `curl http://localhost:5000/health`

2. Check port 5000 is not in use:
   ```bash
   # Linux/Mac
   lsof -i :5000
   
   # Windows
   netstat -ano | findstr :5000
   ```

3. Check firewall isn't blocking port 5000

### Issue 4: Invalid Emotion Received

**Symptoms:**
- Console warning: "Invalid emotion received"
- Emotion doesn't update

**Solution:**
Ensure backend returns one of these exact values:
- `calm`
- `stressed`
- `happy`
- `focused`
- `tired`
- `confused`

### Issue 5: Video Preview is Black

**Symptoms:**
- Modal opens but video is black
- No error messages

**Solutions:**
1. Wait 2-3 seconds for camera to initialize
2. Refresh the page
3. Check browser console for getUserMedia errors
4. Try stopping and restarting detection

## Manual API Testing

You can test the backend independently using curl:

### Test with a Real Image File:

```bash
curl -X POST \
  -F "image=@test_image.jpg" \
  http://localhost:5000/emotion
```

Expected response:
```json
{
  "emotion": "happy",
  "timestamp": "2026-03-12T10:30:45.123456"
}
```

## Browser DevTools Debugging

### Network Tab:

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Start emotion detection
5. You should see POST requests to `/emotion` every 5 seconds

**Check:**
- Status should be `200 OK`
- Response should have `emotion` field
- Request should have image data

### Console Tab:

Look for these logs:
```
✅ Detected emotion: happy
✅ Last detected: 10:30:45 AM
⚠️ Error detecting emotion: [error details]
```

### Application Tab:

Check localStorage for user authentication:
- Key: `currentUser`
- Should have user data if logged in

## Performance Monitoring

### Expected Behavior:

- **Frame Capture:** Every 5 seconds
- **API Response Time:** < 1 second (depends on backend processing)
- **Memory Usage:** Should not increase significantly over time
- **CPU Usage:** Moderate (camera + canvas operations)

### Monitor Performance:

1. Open DevTools → Performance tab
2. Click Record
3. Start emotion detection
4. Let it run for 30 seconds
5. Stop recording
6. Check for:
   - No memory leaks
   - Consistent frame timing
   - Smooth UI updates

## Advanced Testing

### Test Multiple Emotions:

1. Make different facial expressions
2. Verify backend detects different emotions
3. Check UI theme changes accordingly

### Test Error Recovery:

1. Start detection
2. Stop backend server
3. Check error handling in frontend
4. Restart backend
5. Verify detection resumes

### Test Resource Cleanup:

1. Start detection
2. Navigate away from page
3. Check camera light turns off
4. Check no lingering camera access

## Production Testing

Before deploying to production:

- [ ] Test with HTTPS (required for getUserMedia)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Test with slow network (throttle in DevTools)
- [ ] Test with backend errors/timeouts
- [ ] Test privacy - verify no images stored
- [ ] Load test backend (multiple users)
- [ ] Monitor error rates

## Logging for Debugging

### Frontend Logging:

Add to EmotionContext.tsx:
```typescript
console.log('Camera initialized:', videoRef.current);
console.log('Frame captured, size:', canvas.width, canvas.height);
console.log('API request sent at:', new Date().toISOString());
console.log('API response:', data);
```

### Backend Logging:

Add to your Flask app:
```python
print(f"[{datetime.now()}] Received image: {image.size}")
print(f"[{datetime.now()}] Detected emotion: {emotion}")
print(f"[{datetime.now()}] Response sent")
```

## Need Help?

1. **Check browser console first** - Most issues show detailed errors there
2. **Check backend logs** - Server errors appear in terminal
3. **Use Network tab** - See exact request/response data
4. **Test backend independently** - Isolate frontend vs backend issues
5. **Review documentation** - See EMOTION_DETECTION_INTEGRATION.md

## Success Indicators

You know everything is working when:

✅ Video preview shows your face clearly
✅ Console logs "Detected emotion: X" every 5 seconds
✅ Emotion button updates with new emotions
✅ Dashboard greeting changes based on emotion
✅ No errors in browser console
✅ No errors in backend terminal
✅ Network requests return 200 status
✅ Camera stops cleanly when detection ends
