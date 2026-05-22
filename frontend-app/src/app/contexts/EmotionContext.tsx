import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type EmotionType = 'calm' | 'stressed' | 'happy' | 'focused' | 'tired' | 'confused';

interface EmotionContextType {
  emotion: EmotionType;
  setEmotion: (emotion: EmotionType) => void;
  isDetecting: boolean;
  startDetection: () => void;
  stopDetection: () => void;
  videoRef: React.RefObject<HTMLVideoElement|null>;
  canvasRef: React.RefObject<HTMLCanvasElement|null>;
  cameraError: string | null;
  lastDetectionTime: string | null;
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export const useEmotion = () => {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotion must be used within EmotionProvider');
  }
  return context;
};

export const EmotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emotion, setEmotion] = useState<EmotionType>('calm');
  const [isDetecting, setIsDetecting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastDetectionTime, setLastDetectionTime] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize webcam when detection starts
  useEffect(() => {
    const initializeCamera = async () => {
      if (!isDetecting) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setCameraError(null);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setCameraError('Failed to access camera. Please check permissions.');
        setIsDetecting(false);
      }
    };

    if (isDetecting) {
      initializeCamera();
    }

    return () => {
      // Cleanup camera stream when detection stops
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isDetecting]);

  // Capture frames and send to backend
  useEffect(() => {
    if (!isDetecting) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const captureAndDetect = async () => {
      try {
        if (!videoRef.current || !canvasRef.current) {
          console.warn('Video or canvas ref not available');
          return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Check if video is ready
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
          console.warn('Video not ready yet');
          return;
        }

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame to canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
          if (!blob) {
            console.error('Failed to create blob from canvas');
            return;
          }

          // Create FormData and send to backend
          const formData = new FormData();
          formData.append('image', blob, 'frame.jpg');

          try {
            const response = await fetch('http://localhost:5000/emotion', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Update emotion state if valid emotion received
            if (data.emotion && isValidEmotion(data.emotion)) {
              setEmotion(data.emotion as EmotionType);
              setLastDetectionTime(new Date().toLocaleTimeString());
              console.log('Detected emotion:', data.emotion);
            } else {
              console.warn('Invalid emotion received:', data.emotion);
            }
          } catch (error) {
            console.error('Error sending frame to backend:', error);
            setCameraError('Failed to communicate with emotion detection service');
          }
        }, 'image/jpeg', 0.95);

      } catch (error) {
        console.error('Error capturing frame:', error);
      }
    };

    // Start capturing frames every 5 seconds
    intervalRef.current = setInterval(captureAndDetect, 5000);

    // Also capture immediately when detection starts
    setTimeout(captureAndDetect, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isDetecting]);

  const isValidEmotion = (emotion: string): boolean => {
    return ['calm', 'stressed', 'happy', 'focused', 'tired', 'confused'].includes(emotion);
  };

  const startDetection = () => setIsDetecting(true);
  
  const stopDetection = () => {
    setIsDetecting(false);
    setLastDetectionTime(null);
    setCameraError(null);
  };

  return (
    <EmotionContext.Provider 
      value={{ 
        emotion, 
        setEmotion, 
        isDetecting, 
        startDetection, 
        stopDetection,
        videoRef,
        canvasRef,
        cameraError,
        lastDetectionTime,
      }}
    >
      {children}
    </EmotionContext.Provider>
  );
};
