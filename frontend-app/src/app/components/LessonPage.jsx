import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router";
import { useEmotion } from "../contexts/EmotionContext";
import { useEmotionTheme } from "../hooks/useEmotionTheme";
import { mockCourses } from "../data/mockData";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info
} from "lucide-react";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export const LessonPage = () => {

  const { courseId, lessonId } = useParams();

  const { emotion, setEmotion } = useEmotion();
  const theme = useEmotionTheme(emotion);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [engagementLevel, setEngagementLevel] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState("Neutral");
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const course = mockCourses.find((c) => c.id === courseId);
  const lesson = course?.lessons.find((l) => l.id === lessonId);

  /* -------------------- CAMERA START -------------------- */

  const startCamera = async () => {
    try {

      setCameraError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: "user",
        },
        audio: false,
      });

      if (videoRef.current) {

        videoRef.current.srcObject = stream;
        streamRef.current = stream;
       await videoRef.current.play();

        setIsCameraActive(true);

      }

    } catch (err) {

      console.error("Camera error:", err);

      if (err.name === "NotAllowedError") {
        setCameraError("Camera permission denied.");
      } else if (err.name === "NotFoundError") {
        setCameraError("No camera detected.");
      } else {
        setCameraError("Unable to access camera.");
      }

      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {

    if (streamRef.current) {

      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
  };

  /* -------------------- CAPTURE FRAME -------------------- */

const captureFrame = async () => {

  if (!videoRef.current || !canvasRef.current) return;

  const video = videoRef.current;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  try {

    // Convert canvas image to Blob
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.8)
    );

    // Create FormData
    const formData = new FormData();
    formData.append("image", blob, "frame.jpg");

    // Send to backend
    const response = await fetch("http://localhost:5000/emotion", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.emotion) {
      setEmotion(data.emotion);
      setCurrentEmotion(data.emotion);
    }

  } catch (error) {
    console.error("Emotion detection failed:", error);
  }
};

  /* -------------------- AUTO CAPTURE -------------------- */

  useEffect(() => {

    if (isCameraActive) {

      const interval = setInterval(() => {

        captureFrame();

        const randomEngagement = Math.floor(Math.random() * 100);
        setEngagementLevel(randomEngagement);

      }, 5000);

      return () => clearInterval(interval);
    }

  }, [isCameraActive]);

  /* -------------------- CLEANUP -------------------- */

  useEffect(() => {

    return () => {
      stopCamera();
    };

  }, []);

  /* -------------------- LESSON COMPLETE TIMER -------------------- */

  useEffect(() => {

    if (!lesson) return;

    const timer = setTimeout(() => {
      setIsCompleted(true);
    }, 30000);

    return () => clearTimeout(timer);

  }, [lesson]);

  if (!course || !lesson) {

    return (
      <div className={`${theme.cardBackground} rounded-xl p-8 text-center`}>
        <p className={theme.text}>Lesson not found</p>

        <Link to="/courses">
          <Button className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const currentIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = course.lessons[currentIndex + 1];
  const prevLesson = course.lessons[currentIndex - 1];

  const spacingClass =
    theme.spacing === "compact"
      ? "space-y-4"
      : theme.spacing === "relaxed"
      ? "space-y-8"
      : "space-y-6";

  const cardPaddingClass =
    theme.spacing === "compact"
      ? "p-4"
      : theme.spacing === "relaxed"
      ? "p-8"
      : "p-6";

  const getEmotionBasedTip = () => {

    switch (emotion) {

      case "stressezd":
        return "⚠️ Stay focused! Engagement low.";

      case "tired":
        return "💡 Consider taking notes.";

      case "confused":
        return "💡 Rewatch unclear sections.";

      case "focused":
        return "💡 Perfect focus for learning!";

      case "happy":
        return "💡 Great energy for studying!";

      default:
        return "💡 Keep learning!";
    }
  };

  return (
    <div className={spacingClass}>

      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/courses">Courses</Link>
        <span>/</span>
        <Link to={`/courses/${courseId}`}>{course.title}</Link>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-4">

          <div>

            <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>
              {lesson.title}
            </h1>

            <p className={`${theme.text} opacity-70`}>
              {lesson.description}
            </p>

          </div>

          {emotion === "stressed" && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg flex space-x-3">
              <Info className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800 text-sm">
                {getEmotionBasedTip()}
              </p>
            </div>
          )}

          {/* VIDEO */}
          <div className="bg-black rounded-xl overflow-hidden aspect-video">

            {lesson?.videoUrl ? (

              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${
                  lesson.videoUrl.split("youtu.be/")[1].split("?")[0]
                }`}
                title={lesson.title}
                allowFullScreen
              />

            ) : (

              <div className="flex items-center justify-center h-full text-white">
                No video available
              </div>

            )}

          </div>

          {/* NAVIGATION */}
          <div className="flex justify-between pt-4">

            {prevLesson ? (

              <Link to={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Lesson
                </Button>
              </Link>

            ) : <div />}

            {nextLesson ? (

              <Link to={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                <Button className={theme.accent}>
                  Next Lesson
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

            ) : (

              <Button
                onClick={() => setIsCompleted(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Course Completed 🎉
              </Button>

            )}

          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">

          {/* ENGAGEMENT BOX */}
          <Card className={cardPaddingClass}>

            <h3 className="font-bold text-lg mb-4">
              Engagement Tracking
            </h3>

          <div className="relative bg-black rounded-md h-48 flex items-center justify-center overflow-hidden">

  <video
    ref={videoRef}
    autoPlay
    playsInline
    muted
    className={`w-full h-full object-cover ${!isCameraActive ? "hidden" : ""}`}
  />

  {!isCameraActive && (
    <span className="text-white text-sm absolute">
      Camera Disabled
    </span>
  )}

</div>

            <Button
              className="w-full mt-4"
              onClick={isCameraActive ? stopCamera : startCamera}
            >
              {isCameraActive ? "Stop Camera" : "Enable Camera"}
            </Button>

            {cameraError && (
              <p className="text-red-500 text-sm mt-2">
                {cameraError}
              </p>
            )}

            {/* Emotion + Engagement */}
            <div className="mt-4 space-y-2">

              <p className="text-sm text-gray-600">
                Emotion: <span className="font-semibold">{currentEmotion}</span>
              </p>

              <Progress value={engagementLevel} />

            </div>

          </Card>

          {/* COURSE PROGRESS */}
          <Card className={cardPaddingClass}>

            <h3 className="font-bold mb-3">
              Course Progress
            </h3>

            <Progress value={course.progress} className="mb-2" />

            <p className="text-sm text-gray-600">
              {course.progress}% Complete
            </p>

          </Card>

        </div>

      </div>

      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} className="hidden"></canvas>

    </div>
  );
};