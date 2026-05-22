import { useState } from "react";
import { useEmotion } from "../contexts/EmotionContext";
import {
  Smile,
  Frown,
  Meh,
  Brain,
  Moon,
  HelpCircle,
  Video,
  VideoOff,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

type EmotionType =
  | "calm"
  | "stressed"
  | "happy"
  | "focused"
  | "tired"
  | "confused";

const emotionIcons: Record<EmotionType, any> = {
  calm: Meh,
  stressed: Frown,
  happy: Smile,
  focused: Brain,
  tired: Moon,
  confused: HelpCircle,
};

const emotionLabels: Record<EmotionType, string> = {
  calm: "Calm",
  stressed: "Stressed",
  happy: "Happy",
  focused: "Focused",
  tired: "Tired",
  confused: "Confused",
};
///
export const EmotionDetector = () => {
  const {
    emotion,
    setEmotion,
    isDetecting,
    startDetection,
    stopDetection,
    videoRef,
    canvasRef,
    lastDetectionTime,
  } = useEmotion();

  const CurrentIcon = emotionIcons[emotion];

  const handleEmotionChange = (newEmotion: EmotionType) => {
    setEmotion(newEmotion);
  };

  const toggleDetection = () => {
    if (isDetecting) {
      stopDetection();
    } else {
      startDetection();
    }
  };

  return (
    <div className="space-y-4">
      {/* Emotion Dropdown */}
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <CurrentIcon className="h-5 w-5" />
              <span>{emotionLabels[emotion]}</span>
              {isDetecting && (
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-semibold">
              Current Emotion
              {lastDetectionTime && (
                <span className="text-xs font-normal text-gray-500 block">
                  Last detected: {lastDetectionTime}
                </span>
              )}
            </div>

            <DropdownMenuSeparator />

            {(Object.keys(emotionIcons) as EmotionType[]).map((emotionKey) => {
              const Icon = emotionIcons[emotionKey];
              return (
                <DropdownMenuItem
                  key={emotionKey}
                  onClick={() => handleEmotionChange(emotionKey)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{emotionLabels[emotionKey]}</span>
                  {emotion === emotionKey && (
                    <span className="ml-auto text-xs text-blue-500">Active</span>
                  )}
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={toggleDetection}>
              <div className="flex items-center space-x-2">
                {isDetecting ? (
                  <>
                    <VideoOff className="h-4 w-4" />
                    <span>Stop Auto Detection</span>
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4" />
                    <span>Start Auto Detection</span>
                  </>
                )}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Engagement Tracking Card */}
     

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};