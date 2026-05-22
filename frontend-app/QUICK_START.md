# 🚀 Quick Start Guide

## Get Your Emotion Detection Running in 3 Steps

### Step 1: Start Backend (Terminal 1)

```bash
# Option A: Use the example backend
python BACKEND_EXAMPLE.py

# Option B: Use your own backend
cd backend
python app.py
```

**Expected Output:**
```
Emotion Detection API Server
Starting server on http://localhost:5000
```

### Step 2: Start Frontend (Terminal 2)

```bash
# In your project root directory
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 3: Test It!

1. Open browser: `http://localhost:5173`
2. Login or signup
3. Go to Dashboard
4. Click the emotion button (top right)
5. Click "Start Auto-Detection"
6. Grant camera permissions
7. Click "Show Camera" to see live preview

**You're done!** The app will now detect your emotions every 5 seconds.

---

## 📁 Files Overview

### Core Implementation
- `/src/app/contexts/EmotionContext.tsx` - Webcam + API logic
- `/src/app/components/EmotionDetector.tsx` - UI component

### Documentation
- `IMPLEMENTATION_SUMMARY.md` - Complete overview (READ THIS FIRST)
- `EMOTION_DETECTION_INTEGRATION.md` - Detailed integration guide
- `TESTING_GUIDE.md` - Testing and troubleshooting
- `BACKEND_EXAMPLE.py` - Example Flask backend
- `QUICK_START.md` - This file

---

## ✅ Quick Verification

Open browser console (F12) and look for:
```
✅ Detected emotion: happy
✅ Last detected: 10:30:45 AM
```

If you see errors:
```
❌ CORS error → Add CORS(app) to Flask backend
❌ Camera error → Check browser permissions
❌ API error → Verify backend is running on port 5000
```

---

## 🔧 Common Configuration

### Change Backend URL
Edit `/src/app/contexts/EmotionContext.tsx` line ~125:
```typescript
const response = await fetch('YOUR_URL_HERE/emotion', {
```

### Change Detection Interval
Edit `/src/app/contexts/EmotionContext.tsx` line ~169:
```typescript
setInterval(captureAndDetect, 5000); // Change 5000 to desired ms
```

---

## 📚 Need More Help?

1. **Integration Details** → Read `IMPLEMENTATION_SUMMARY.md`
2. **API Setup** → Read `EMOTION_DETECTION_INTEGRATION.md`
3. **Testing Issues** → Read `TESTING_GUIDE.md`
4. **Backend Code** → See `BACKEND_EXAMPLE.py`

---

## 🎯 What You Get

- ✅ Live webcam emotion detection
- ✅ 6 emotion states (calm, stressed, happy, focused, tired, confused)
- ✅ Automatic UI adaptation based on emotion
- ✅ Manual emotion override option
- ✅ Camera preview with live status
- ✅ Frame capture every 5 seconds
- ✅ Real-time backend integration
- ✅ Error handling and cleanup

---

**That's it! Your emotion-adaptive e-learning platform is ready to go! 🎉**
