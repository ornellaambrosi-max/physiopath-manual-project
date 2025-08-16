import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function ExerciseTimer({ duration, onComplete, autoStart = false, showControls = true }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setTimeLeft(duration);
    setIsComplete(false);
  }, [duration]);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            onComplete && onComplete();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (!isRunning) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsComplete(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="text-center space-y-4">
      {/* Timer Display */}
      <div className="relative">
        <div className="text-6xl font-mono font-bold text-warm-gray-900">
          {formatTime(timeLeft)}
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="w-full bg-warm-gray-200 rounded-full h-2">
            <div 
              className="bg-sage-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              disabled={timeLeft === 0}
              className="bg-sage-600 hover:bg-sage-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {timeLeft === duration ? 'Start' : 'Resume'}
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="outline"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      )}

      {/* Completion Message */}
      {isComplete && (
        <div className="text-green-600 font-semibold">
          ✓ Time's up! Great work!
        </div>
      )}
    </div>
  );
}