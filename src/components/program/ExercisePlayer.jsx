import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Volume2,
  VolumeX,
  Settings,
  Camera,
  Mic,
  MicOff,
  StopCircle,
  CheckCircle2,
  AlertTriangle,
  Timer,
  SkipForward
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

export default function ExercisePlayer({ 
  exercise, 
  currentSet, 
  currentRep, 
  onComplete, 
  onSkip, 
  onAdjustDifficulty,
  programSettings = {} 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [exercisePhase, setExercisePhase] = useState('preparation'); // preparation, exercise, rest, complete
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  
  // Exercise feedback state
  const [painBefore, setPainBefore] = useState(0);
  const [painAfter, setPainAfter] = useState(0);
  const [tensionLevel, setTensionLevel] = useState(0);
  const [effortLevel, setEffortLevel] = useState(0);
  const [difficultyRating, setDifficultyRating] = useState(5);
  const [exerciseNotes, setExerciseNotes] = useState("");
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  // Timer effects
  useEffect(() => {
    let interval;
    if (isPlaying && !isPaused && exercisePhase === 'exercise') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, exercisePhase]);

  useEffect(() => {
    let interval;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            setExercisePhase('preparation');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setExercisePhase('exercise');
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setTimer(0);
    setExercisePhase('preparation');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleCompleteSet = () => {
    if (currentSet < exercise.initial_sets) {
      // Start rest period
      setIsResting(true);
      setRestTimer(exercise.rest_time_seconds || 30);
      setExercisePhase('rest');
      setIsPlaying(false);
    } else {
      // Exercise complete, show feedback dialog
      setShowFeedbackDialog(true);
      setExercisePhase('complete');
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunks.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        // In a real app, upload this blob to storage and save URL
        console.log('Recording saved:', blob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSubmitFeedback = () => {
    const feedbackData = {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      sets_completed: currentSet,
      reps_completed: currentRep.toString(),
      actual_duration_seconds: timer,
      difficulty_rating: difficultyRating,
      pain_level_before: painBefore,
      pain_level_after: painAfter,
      tension_level: tensionLevel,
      effort_level: effortLevel,
      completed: true,
      notes: exerciseNotes
    };
    
    onComplete(feedbackData);
    setShowFeedbackDialog(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exercise Header */}
      <Card className="border-sage-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-warm-gray-900">
                {exercise.name}
              </CardTitle>
              <p className="text-warm-gray-600 mt-2">{exercise.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-sage-100 text-sage-700">
                {exercise.category}
              </Badge>
              <Badge variant="outline">
                Set {currentSet} of {exercise.initial_sets}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Video Player */}
      <Card className="border-sage-200 shadow-lg">
        <CardContent className="p-6">
          <div className="relative bg-black rounded-xl overflow-hidden mb-4">
            <video
              ref={videoRef}
              className="w-full aspect-video"
              poster={exercise.thumbnail_url}
              muted={volume === 0}
              onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            >
              <source src={exercise.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={isPlaying && !isPaused ? handlePause : handlePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying && !isPaused ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVolume(volume === 0 ? 1 : 0)}
                      className="text-white hover:bg-white/20"
                    >
                      {volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Recording Controls */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`text-white hover:bg-white/20 ${isRecording ? 'text-red-400' : ''}`}
                  >
                    {isRecording ? (
                      <StopCircle className="w-5 h-5" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                  </Button>
                  
                  <span className="text-sm">
                    {formatTime(Math.floor(currentTime))}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Exercise Timer & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-sage-50 border-sage-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Timer className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-sage-700">Exercise Time</span>
                </div>
                <div className="text-2xl font-bold text-sage-900">
                  {formatTime(timer)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-mint-50 border-mint-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-mint-600" />
                  <span className="font-medium text-mint-700">Target Reps</span>
                </div>
                <div className="text-2xl font-bold text-mint-900">
                  {exercise.initial_reps}
                </div>
              </CardContent>
            </Card>
            
            {isResting && (
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Timer className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-700">Rest Time</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900">
                    {formatTime(restTimer)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Exercise Instructions */}
          <div className="bg-warm-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-warm-gray-900 mb-2">Instructions</h4>
            <p className="text-warm-gray-700">{exercise.instructions}</p>
            
            {exercise.precautions && (
              <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800">Precautions</p>
                    <p className="text-yellow-700 text-sm">{exercise.precautions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleCompleteSet}
              className="bg-sage-600 hover:bg-sage-700 text-white px-6"
              disabled={exercisePhase === 'rest'}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Complete Set
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onSkip()}
              className="px-6"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip Exercise
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onAdjustDifficulty('easier')}
              className="px-6"
            >
              Make Easier
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onAdjustDifficulty('harder')}
              className="px-6"
            >
              Make Harder
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Exercise Feedback</DialogTitle>
            <DialogDescription>
              Please rate your experience with this exercise
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <Label>Pain Level Before Exercise (0-10)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[painBefore]}
                  onValueChange={(value) => setPainBefore(value[0])}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <Badge variant="outline" className="min-w-[40px] justify-center">
                  {painBefore}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label>Pain Level After Exercise (0-10)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[painAfter]}
                  onValueChange={(value) => setPainAfter(value[0])}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <Badge variant="outline" className="min-w-[40px] justify-center">
                  {painAfter}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label>Tension Level (0-10)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[tensionLevel]}
                  onValueChange={(value) => setTensionLevel(value[0])}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <Badge variant="outline" className="min-w-[40px] justify-center">
                  {tensionLevel}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label>Effort Level (0-10)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[effortLevel]}
                  onValueChange={(value) => setEffortLevel(value[0])}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <Badge variant="outline" className="min-w-[40px] justify-center">
                  {effortLevel}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label>Difficulty Rating (1-10)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[difficultyRating]}
                  onValueChange={(value) => setDifficultyRating(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <Badge variant="outline" className="min-w-[40px] justify-center">
                  {difficultyRating}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label htmlFor="exercise-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="exercise-notes"
                value={exerciseNotes}
                onChange={(e) => setExerciseNotes(e.target.value)}
                placeholder="Any additional comments about this exercise..."
                rows={3}
                className="mt-2"
              />
            </div>
            
            <Button
              onClick={handleSubmitFeedback}
              className="w-full bg-sage-600 hover:bg-sage-700"
            >
              Submit Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}