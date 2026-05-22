# System Architecture Diagram

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER'S BROWSER                                 │
│                         http://localhost:5173                            │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      React Application                           │    │
│  │                                                                   │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │  RootLayout.jsx                                          │   │    │
│  │  │  ┌────────────────┐  ┌──────────────────────────────┐   │   │    │
│  │  │  │ AuthProvider   │  │ EmotionProvider              │   │   │    │
│  │  │  │ (Login/Signup) │  │ - Webcam Management          │   │   │    │
│  │  │  │                │  │ - Frame Capture              │   │   │    │
│  │  │  │                │  │ - API Communication          │   │   │    │
│  │  │  │                │  │ - Emotion State              │   │   │    │
│  │  │  └────────────────┘  └──────────────────────────────┘   │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  │                                                                   │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │  Navigation Bar                                          │   │    │
│  │  │  [Home] [Dashboard] [Courses] [User] [EmotionDetector]  │   │    │
│  │  │                                           ↑               │   │    │
│  │  │                                           │               │   │    │
│  │  │                    ┌──────────────────────┘               │   │    │
│  │  │                    │                                      │   │    │
│  │  │  ┌─────────────────▼──────────────────────────────────┐  │   │    │
│  │  │  │ EmotionDetector.tsx                                │  │   │    │
│  │  │  │ ┌────────────────────────────────────────────────┐ │  │   │    │
│  │  │  │ │ Emotion Button Dropdown                        │ │  │   │    │
│  │  │  │ │ [😐 Calm ▼]                                    │ │  │   │    │
│  │  │  │ │   • Calm                                       │ │  │   │    │
│  │  │  │ │   • Stressed                                   │ │  │   │    │
│  │  │  │ │   • Happy                                      │ │  │   │    │
│  │  │  │ │   • Focused                                    │ │  │   │    │
│  │  │  │ │   • Tired                                      │ │  │   │    │
│  │  │  │ │   • Confused                                   │ │  │   │    │
│  │  │  │ │   ─────────────                                │ │  │   │    │
│  │  │  │ │   🟢 Start Auto-Detection                      │ │  │   │    │
│  │  │  │ │   📹 Show Camera                               │ │  │   │    │
│  │  │  │ └────────────────────────────────────────────────┘ │  │   │    │
│  │  │  │                                                    │  │   │    │
│  │  │  │ ┌────────────────────────────────────────────────┐ │  │   │    │
│  │  │  │ │ Camera Preview Modal (when active)             │ │  │   │    │
│  │  │  │ │ ┌────────────────────────────────────────────┐ │ │  │   │    │
│  │  │  │ │ │ 🔴 Recording      Current: Happy           │ │ │  │   │    │
│  │  │  │ │ │                                            │ │ │  │   │    │
│  │  │  │ │ │    [  LIVE VIDEO FEED FROM WEBCAM  ]       │ │ │  │   │    │
│  │  │  │ │ │    [     User's Face Visible       ]       │ │ │  │   │    │
│  │  │  │ │ │                                            │ │ │  │   │    │
│  │  │  │ │ └────────────────────────────────────────────┘ │ │  │   │    │
│  │  │  │ │ Status: Active                                 │ │  │   │    │
│  │  │  │ │ Current Emotion: Happy                         │ │  │   │    │
│  │  │  │ │ Last Detection: 10:30:45 AM                    │ │  │   │    │
│  │  │  │ │ Detection Interval: Every 5 seconds            │ │  │   │    │
│  │  │  │ │                                                │ │  │   │    │
│  │  │  │ │ [Hide Preview] [Stop Detection]                │ │  │   │    │
│  │  │  │ └────────────────────────────────────────────────┘ │  │   │    │
│  │  │  └────────────────────────────────────────────────────┘  │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  │                                                                   │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │  Dashboard / Courses / Lessons / Profile                 │   │    │
│  │  │  (UI adapts based on detected emotion)                   │   │    │
│  │  │  - Colors change (calm=blue, happy=yellow, etc.)         │   │    │
│  │  │  - Spacing adjusts (stressed=relaxed, focused=compact)   │   │    │
│  │  │  - Font sizes adapt (tired=larger)                       │   │    │
│  │  │  - Dark mode for focused state                           │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐   │
│  │  Hidden Elements (used internally)                                │   │
│  │  • <video ref={videoRef}> - Captures webcam stream               │   │
│  │  • <canvas ref={canvasRef}> - Extracts frame data                │   │
│  └───────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Every 5 seconds
                                    │ POST /emotion
                                    │ multipart/form-data
                                    │ Image: JPEG blob
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                           FLASK BACKEND                                  │
│                       http://localhost:5000                              │
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐   │
│  │  POST /emotion Endpoint                                           │   │
│  │                                                                    │   │
│  │  1. Receive multipart/form-data request                           │   │
│  │     ↓                                                              │   │
│  │  2. Extract image file from request.files['image']                │   │
│  │     ↓                                                              │   │
│  │  3. Convert to PIL Image                                          │   │
│  │     ↓                                                              │   │
│  │  4. Convert PIL Image to OpenCV format (BGR)                      │   │
│  │     ↓                                                              │   │
│  │  5. Pass to DeepFace.analyze()                                    │   │
│  │     ↓                                                              │   │
│  │  ┌──────────────────────────────────────────────────────────┐    │   │
│  │  │  DeepFace Emotion Detection                              │    │   │
│  │  │  - Detect face in image                                  │    │   │
│  │  │  - Analyze facial expressions                            │    │   │
│  │  │  - Calculate emotion probabilities                       │    │   │
│  │  │  - Return: {dominant_emotion: "happy"}                   │    │   │
│  │  └──────────────────────────────────────────────────────────┘    │   │
│  │     ↓                                                              │   │
│  │  6. Map DeepFace emotion to frontend emotion                      │   │
│  │     DeepFace → Frontend:                                          │   │
│  │     • happy     → happy                                           │   │
│  │     • neutral   → calm                                            │   │
│  │     • sad       → tired                                           │   │
│  │     • angry     → stressed                                        │   │
│  │     • fear      → confused                                        │   │
│  │     • surprise  → focused                                         │   │
│  │     • disgust   → confused                                        │   │
│  │     ↓                                                              │   │
│  │  7. Return JSON response                                          │   │
│  │     { "emotion": "happy", "timestamp": "..." }                    │   │
│  │     ↓                                                              │   │
│  └────┼──────────────────────────────────────────────────────────────┘   │
│       │                                                                   │
│  ┌────▼──────────────────────────────────────────────────────────────┐   │
│  │  CORS Headers (Required!)                                         │   │
│  │  Access-Control-Allow-Origin: http://localhost:5173               │   │
│  │  Access-Control-Allow-Methods: POST, OPTIONS                      │   │
│  │  Access-Control-Allow-Headers: Content-Type                       │   │
│  └───────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

```
┌──────┐                                                        ┌─────────┐
│ User │                                                        │ Backend │
└──┬───┘                                                        └────┬────┘
   │                                                                  │
   │ 1. Click "Start Auto-Detection"                                 │
   │────────────────────────────────────────►                        │
   │                                                                  │
   │ 2. Browser requests camera permission                           │
   │────────────────────────────────────────►                        │
   │                                                                  │
   │ 3. User grants permission                                       │
   │────────────────────────────────────────►                        │
   │                                                                  │
   │ 4. Webcam stream starts                                         │
   │◄────────────────────────────────────────                        │
   │                                                                  │
   │ ⏱️  Wait 1 second (initial delay)                               │
   │                                                                  │
   │ 5. Capture frame from video                                     │
   │    (canvas.drawImage)                                           │
   │                                                                  │
   │ 6. Convert canvas to JPEG blob                                  │
   │    (canvas.toBlob)                                              │
   │                                                                  │
   │ 7. Create FormData with image                                   │
   │                                                                  │
   │ 8. POST /emotion with image                                     │
   │────────────────────────────────────────────────────────────────►│
   │                                                                  │
   │                                      9. Receive image            │
   │                                         Convert to PIL           │
   │                                         Run DeepFace.analyze()   │
   │                                         Map emotion              │
   │                                                                  │
   │ 10. Receive JSON response                                       │
   │     { "emotion": "happy" }                                      │
   │◄────────────────────────────────────────────────────────────────│
   │                                                                  │
   │ 11. Update emotion state                                        │
   │     setEmotion("happy")                                         │
   │                                                                  │
   │ 12. UI automatically updates                                    │
   │     - Emotion button shows "Happy"                              │
   │     - Theme changes to yellow                                   │
   │     - Greeting updates                                          │
   │                                                                  │
   │ ⏱️  Wait 5 seconds                                               │
   │                                                                  │
   │ 13. Capture next frame...                                       │
   │     (Repeat steps 5-12)                                         │
   │                                                                  │
```

## Component Hierarchy

```
App.tsx
└── RouterProvider
    └── RootLayout.jsx
        ├── AuthProvider (handles login/signup/logout)
        │   └── EmotionProvider (handles webcam & emotion detection)
        │       ├── Navigation
        │       │   ├── Logo & Brand
        │       │   ├── Nav Links (Home, Dashboard, Courses)
        │       │   ├── User Info & Logout
        │       │   └── EmotionDetector.tsx ⭐
        │       │       ├── Emotion Dropdown Button
        │       │       │   ├── Manual Emotion Selection
        │       │       │   └── Start/Stop Detection Toggle
        │       │       ├── Camera Preview Modal
        │       │       │   ├── Live Video Feed
        │       │       │   ├── Status Information
        │       │       │   └── Control Buttons
        │       │       └── Hidden Elements
        │       │           ├── <video ref={videoRef}>
        │       │           └── <canvas ref={canvasRef}>
        │       └── Routes
        │           ├── / (Landing Page)
        │           ├── /login (Login Page)
        │           ├── /signup (Signup Page)
        │           ├── /dashboard (Dashboard) 🎨 emotion-adaptive
        │           ├── /courses (Courses Page) 🎨 emotion-adaptive
        │           ├── /courses/:id (Course Detail) 🎨 emotion-adaptive
        │           ├── /courses/:id/lessons/:id (Lesson) 🎨 emotion-adaptive
        │           └── /profile (Profile Page) 🎨 emotion-adaptive
        └── All pages use useEmotion() to get current emotion
            and useEmotionTheme() to adapt styling
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ EmotionContext.tsx (State Provider)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ State Variables:                                                 │
│  • emotion: 'calm' | 'stressed' | 'happy' | 'focused' |         │
│            'tired' | 'confused'                                  │
│  • isDetecting: boolean                                          │
│  • cameraError: string | null                                    │
│  • lastDetectionTime: string | null                              │
│                                                                  │
│ Refs:                                                            │
│  • videoRef: HTMLVideoElement                                    │
│  • canvasRef: HTMLCanvasElement                                  │
│  • streamRef: MediaStream                                        │
│  • intervalRef: NodeJS.Timeout                                   │
│                                                                  │
│ Methods:                                                         │
│  • startDetection() → Sets isDetecting = true                    │
│  • stopDetection() → Sets isDetecting = false, cleanup          │
│  • setEmotion(emotion) → Updates current emotion                │
│                                                                  │
│ Effects:                                                         │
│  • useEffect([isDetecting]) → Initialize/cleanup camera         │
│  • useEffect([isDetecting]) → Start/stop frame capture loop     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Context Provider
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ All child components can access via useEmotion()                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ EmotionDetector.tsx:                                             │
│  const { emotion, startDetection, stopDetection,                │
│          videoRef, canvasRef } = useEmotion();                   │
│                                                                  │
│ Dashboard.jsx:                                                   │
│  const { emotion } = useEmotion();                               │
│  const theme = useEmotionTheme(emotion);                         │
│                                                                  │
│ All Pages:                                                       │
│  const { emotion } = useEmotion();                               │
│  → UI adapts based on current emotion                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## File Locations Reference

```
📁 Project Root
│
├── 📄 QUICK_START.md ⭐ START HERE
├── 📄 IMPLEMENTATION_SUMMARY.md (Complete overview)
├── 📄 EMOTION_DETECTION_INTEGRATION.md (Detailed guide)
├── 📄 TESTING_GUIDE.md (Testing & troubleshooting)
├── 📄 ARCHITECTURE_DIAGRAM.md (This file)
├── 🐍 BACKEND_EXAMPLE.py (Flask backend template)
│
├── 📁 src/app/
│   ├── 📁 components/
│   │   ├── 📄 EmotionDetector.tsx ⭐ (Webcam UI component)
│   │   ├── 📄 Dashboard.jsx (Emotion-adaptive dashboard)
│   │   ├── 📄 CoursesPage.jsx (Emotion-adaptive courses)
│   │   ├── 📄 CourseDetailPage.jsx
│   │   ├── 📄 LessonPage.jsx
│   │   ├── 📄 ProfilePage.jsx
│   │   └── 📄 RootLayout.jsx (Contains EmotionProvider)
│   │
│   ├── 📁 contexts/
│   │   ├── 📄 EmotionContext.tsx ⭐ (Webcam + API logic)
│   │   └── 📄 AuthContext.jsx (Login/signup)
│   │
│   └── 📁 hooks/
│       └── 📄 useEmotionTheme.js (Theme based on emotion)
│
└── 📁 backend/ (Your Flask backend - separate folder)
    └── 📄 app.py (Your backend code)
```

## API Request/Response Example

```
┌─────────────────────────────────────────────────────────────┐
│ REQUEST: POST http://localhost:5000/emotion                 │
├─────────────────────────────────────────────────────────────┤
│ Headers:                                                     │
│   Content-Type: multipart/form-data;                        │
│                boundary=----WebKitFormBoundary...           │
│                                                              │
│ Body: (FormData)                                             │
│   ------WebKitFormBoundary...                               │
│   Content-Disposition: form-data; name="image";             │
│                        filename="frame.jpg"                  │
│   Content-Type: image/jpeg                                   │
│                                                              │
│   [JPEG binary data - user's face from webcam]              │
│   ------WebKitFormBoundary...--                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ RESPONSE: 200 OK                                             │
├─────────────────────────────────────────────────────────────┤
│ Headers:                                                     │
│   Content-Type: application/json                            │
│   Access-Control-Allow-Origin: http://localhost:5173        │
│                                                              │
│ Body: (JSON)                                                 │
│   {                                                          │
│     "emotion": "happy",                                      │
│     "timestamp": "2026-03-12T10:30:45.123456"                │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
```

## Emotion Mapping Table

```
┌─────────────────┬──────────────────┬─────────────────────────┐
│ DeepFace Output │ Frontend Emotion │ UI Adaptation           │
├─────────────────┼──────────────────┼─────────────────────────┤
│ happy           │ happy            │ Yellow theme, energetic │
│ neutral         │ calm             │ Blue theme, balanced    │
│ sad             │ tired            │ Larger fonts, relaxed   │
│ angry           │ stressed         │ Calming colors, spacious│
│ fear            │ confused         │ Step-by-step guidance   │
│ surprise        │ focused          │ Dark mode, minimalist   │
│ disgust         │ confused         │ Step-by-step guidance   │
└─────────────────┴──────────────────┴─────────────────────────┘
```

## Browser Compatibility Matrix

```
┌──────────────┬──────────┬─────────────────────────────────┐
│ Browser      │ Version  │ Status                          │
├──────────────┼──────────┼─────────────────────────────────┤
│ Chrome       │ 90+      │ ✅ Full support                 │
│ Firefox      │ 88+      │ ✅ Full support                 │
│ Safari       │ 15+      │ ✅ Full support (HTTPS in prod) │
│ Edge         │ 90+      │ ✅ Full support                 │
│ Mobile Chrome│ Latest   │ ⚠️  Varies by device            │
│ Mobile Safari│ Latest   │ ⚠️  HTTPS required              │
│ IE 11        │ -        │ ❌ Not supported                │
└──────────────┴──────────┴─────────────────────────────────┘
```

---

**This diagram provides a complete visual reference for the emotion detection system architecture. For step-by-step setup, see QUICK_START.md**
