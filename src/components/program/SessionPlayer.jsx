import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { createPageUrl } from "@/utils";
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Target,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Activity,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ExercisePlayer from "./ExercisePlayer";

export default function SessionPlayer({ 
  program, 
  weekNumber, 
  sessionNumber, 
  onSessionComplete,
  onProgressUpdate 
}) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionProgress, setSessionProgress] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionPhase, setSessionPhase] = useState('preparation'); // preparation, active, complete
  const [overallPainBefore, setOverallPainBefore] = useState(0);
  const [overallPainAfter, setOverallPainAfter] = useState(0);
  const [sessionNotes, setSessionNotes] = useState("");

  // Get exercises for current week
  const currentWeek = program.week_structure?.find(week => week.week_number === weekNumber);
  const weekExercises = currentWeek ? 
    program.exercises.filter(ex => currentWeek.exercise_ids.includes(ex.id)) : 
    program.exercises;

  const currentExercise = weekExercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === weekExercises.length - 1;
  const completedExercises = sessionProgress.filter(p => p.completed).length;
  const progressPercentage = (completedExercises / weekExercises.length) * 100;

  useEffect(() => {
    // Initialize session progress tracking
    const initialProgress = weekExercises.map(exercise => ({
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      completed: false,
      skipped: false,
      data: null
    }));
    setSessionProgress(initialProgress);
  }, [weekExercises]);

  const handleStartSession = () => {
    setSessionStartTime(new Date());
    setSessionPhase('active');
  };

  const handleExerciseComplete = (exerciseData) => {
    // Update progress for current exercise
    const updatedProgress = [...sessionProgress];
    updatedProgress[currentExerciseIndex] = {
      ...updatedProgress[currentExerciseIndex],
      completed: true,
      data: exerciseData
    };
    setSessionProgress(updatedProgress);

    // Move to next exercise or complete session
    if (isLastExercise) {
      handleSessionComplete();
    } else {
      setCurrentExerciseIndex(prev => prev + 1);
    }

    // Update progress in real-time
    onProgressUpdate && onProgressUpdate({
      exerciseCompleted: exerciseData,
      sessionProgress: updatedProgress
    });
  };

  const handleExerciseSkip = (reason = "") => {
    const updatedProgress = [...sessionProgress];
    updatedProgress[currentExerciseIndex] = {
      ...updatedProgress[currentExerciseIndex],
      skipped: true,
      skipReason: reason
    };
    setSessionProgress(updatedProgress);

    if (isLastExercise) {
      handleSessionComplete();
    } else {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handleSessionComplete = () => {
    setSessionPhase('complete');
    
    const sessionData = {
      program_id: program.id,
      session_date: new Date().toISOString().split('T')[0],
      week_number: weekNumber,
      session_number: sessionNumber,
      exercises_completed: sessionProgress.filter(p => p.completed).map(p => p.data),
      overall_pain_level: overallPainAfter,
      session_duration_minutes: sessionStartTime ? 
        Math.round((new Date() - sessionStartTime) / (1000 * 60)) : 0,
      session_notes: sessionNotes,
      adherence_score: Math.round((completedExercises / weekExercises.length) * 100)
    };

    onSessionComplete && onSessionComplete(sessionData);
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < weekExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handleDifficultyAdjustment = (exerciseId, adjustment) => {
    // In a real app, this would update the exercise parameters
    console.log(`Adjusting difficulty for ${exerciseId}: ${adjustment}`);
  };

  if (sessionPhase === 'preparation') {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <Card className="border-sage-200 shadow-xl bg-gradient-to-br from-sage-50 to-mint-50">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl text-warm-gray-900">
                Week {weekNumber}, Session {sessionNumber}
              </CardTitle>
              <p className="text-lg text-warm-gray-600">
                {currentWeek?.focus || "General Exercise Session"}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-8 h-8 text-sage-600" />
                  </div>
                  <h3 className="font-semibold text-warm-gray-900">
                    {weekExercises.length} Exercises
                  </h3>
                  <p className="text-warm-gray-600 text-sm">
                    Personalized for your goals
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-mint-600" />
                  </div>
                  <h3 className="font-semibold text-warm-gray-900">
                    ~{currentWeek?.session_duration_minutes || 25} Minutes
                  </h3>
                  <p className="text-warm-gray-600 text-sm">
                    Estimated duration
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-8 h-8 text-ocean-600" />
                  </div>
                  <h3 className="font-semibold text-warm-gray-900">
                    Progressive
                  </h3>
                  <p className="text-warm-gray-600 text-sm">
                    Builds on previous sessions
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-sage-200">
                <h4 className="font-semibold text-warm-gray-900 mb-4">
                  Today's Exercises Preview
                </h4>
                <div className="space-y-3">
                  {weekExercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center gap-3 p-3 bg-sage-50 rounded-lg">
                      <Badge className="bg-sage-100 text-sage-700 min-w-[24px] h-6 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <h5 className="font-medium text-warm-gray-900">
                          {exercise.name}
                        </h5>
                        <p className="text-sm text-warm-gray-600">
                          {exercise.initial_sets} sets × {exercise.initial_reps}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {exercise.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={handleStartSession}
                size="lg"
                className="bg-sage-600 hover:bg-sage-700 text-white px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Play className="w-6 h-6 mr-3" />
                Start Session
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (sessionPhase === 'complete') {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <Card className="border-sage-200 shadow-xl bg-gradient-to-br from-green-50 to-sage-50">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-warm-gray-900">
                Session Complete!
              </CardTitle>
              <p className="text-lg text-warm-gray-600">
                Excellent work on Week {weekNumber}, Session {sessionNumber}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {completedExercises}/{weekExercises.length}
                  </div>
                  <p className="text-warm-gray-600">Exercises Completed</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage-600">
                    {sessionStartTime ? 
                      Math.round((new Date() - sessionStartTime) / (1000 * 60)) : 0}
                  </div>
                  <p className="text-warm-gray-600">Minutes</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-mint-600">
                    {Math.round(progressPercentage)}%
                  </div>
                  <p className="text-warm-gray-600">Adherence</p>
                </div>
              </div>
              
              <Progress value={progressPercentage} className="h-3" />
              
              <Button
                onClick={() => window.location.href = createPageUrl("Dashboard")}
                size="lg"
                className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-xl"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Session Progress Header */}
      <Card className="border-sage-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-warm-gray-900">
                Exercise {currentExerciseIndex + 1} of {weekExercises.length}
              </h2>
              <p className="text-warm-gray-600">
                Week {weekNumber}, Session {sessionNumber}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-sage-600">
                {Math.round(progressPercentage)}%
              </div>
              <p className="text-sm text-warm-gray-600">Complete</p>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-2 mb-4" />
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousExercise}
              disabled={currentExerciseIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {weekExercises.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index < currentExerciseIndex ? 'bg-green-500' :
                    index === currentExerciseIndex ? 'bg-sage-500' :
                    'bg-warm-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={handleNextExercise}
              disabled={currentExerciseIndex === weekExercises.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Exercise Player */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExerciseIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ExercisePlayer
            exercise={currentExercise}
            currentSet={1}
            currentRep={currentExercise?.initial_reps}
            onComplete={handleExerciseComplete}
            onSkip={handleExerciseSkip}
            onAdjustDifficulty={(adjustment) => 
              handleDifficultyAdjustment(currentExercise.id, adjustment)
            }
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}