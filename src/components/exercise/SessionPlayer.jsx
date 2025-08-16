import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause,
  SkipForward,
  RotateCcw,
  Volume2,
  Heart,
  AlertTriangle,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SupportButton from "../Support/SupportButton";
import ExerciseTimer from "./ExerciseTimer";

export default function SessionPlayer({ session, exercises, patient, onCompleteSession }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [sessionStartTime] = useState(new Date());
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [sessionFeedback, setSessionFeedback] = useState({
    overall_pain_before: 0,
    overall_pain_after: 0,
    session_notes: ""
  });
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState("");

  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;
  const isLastSet = currentSet >= currentExercise.sets;
  const progressPercentage = ((currentExerciseIndex * currentExercise.sets + currentSet) / 
    (exercises.reduce((sum, ex) => sum + ex.sets, 0))) * 100;

  useEffect(() => {
    // Initialize exercise progress tracking
    const initialProgress = {};
    exercises.forEach(exercise => {
      initialProgress[exercise.id] = {
        completed_sets: 0,
        pain_before: 0,
        pain_after: 0,
        perceived_exertion: 5,
        notes: "",
        completed: false,
        skipped: false
      };
    });
    setExerciseProgress(initialProgress);
  }, [exercises]);

  useEffect(() => {
    // Show motivational messages periodically
    if (session.motivational_phrases && session.motivational_phrases.length > 0) {
      const interval = setInterval(() => {
        const randomPhrase = session.motivational_phrases[
          Math.floor(Math.random() * session.motivational_phrases.length)
        ];
        setCurrentMotivation(randomPhrase);
        setShowMotivation(true);
        setTimeout(() => setShowMotivation(false), 3000);
      }, 120000); // Every 2 minutes

      return () => clearInterval(interval);
    }
  }, [session.motivational_phrases]);

  const handleSetComplete = () => {
    const updatedProgress = { ...exerciseProgress };
    updatedProgress[currentExercise.id].completed_sets = currentSet;

    if (isLastSet) {
      // Exercise complete, move to next or finish session
      updatedProgress[currentExercise.id].completed = true;
      
      if (isLastExercise) {
        handleSessionComplete();
      } else {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
      }
    } else {
      // Start rest period
      setIsResting(true);
      setRestTimeLeft(currentExercise.rest_duration || 60);
      setCurrentSet(prev => prev + 1);
    }

    setExerciseProgress(updatedProgress);
  };

  const handleSkipExercise = (reason = "") => {
    const updatedProgress = { ...exerciseProgress };
    updatedProgress[currentExercise.id].skipped = true;
    updatedProgress[currentExercise.id].skip_reason = reason;
    
    setExerciseProgress(updatedProgress);

    if (isLastExercise) {
      handleSessionComplete();
    } else {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
    }
  };

  const handleSessionComplete = () => {
    const sessionResults = {
      session_id: session.id,
      patient_id: patient.id,
      session_date: new Date().toISOString().split('T')[0],
      week_number: session.week_number,
      session_number: session.session_number,
      exercises: Object.keys(exerciseProgress).map(exerciseId => ({
        exercise_id: exerciseId,
        ...exerciseProgress[exerciseId]
      })),
      actual_duration_minutes: Math.round((new Date() - sessionStartTime) / (1000 * 60)),
      adherence_score: calculateAdherenceScore(),
      ...sessionFeedback
    };

    onCompleteSession(sessionResults);
  };

  const calculateAdherenceScore = () => {
    const completedExercises = Object.values(exerciseProgress).filter(p => p.completed).length;
    return Math.round((completedExercises / exercises.length) * 100);
  };

  const handleRestComplete = () => {
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const updateExerciseFeedback = (field, value) => {
    const updatedProgress = { ...exerciseProgress };
    updatedProgress[currentExercise.id][field] = value;
    setExerciseProgress(updatedProgress);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <Card className="border-sage-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-warm-gray-900">
                Exercise {currentExerciseIndex + 1} of {exercises.length}
              </h2>
              <p className="text-warm-gray-600">
                {session.title} • Set {currentSet} of {currentExercise.sets}
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
              onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
              disabled={currentExerciseIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {exercises.map((_, index) => (
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
              onClick={() => setCurrentExerciseIndex(Math.min(exercises.length - 1, currentExerciseIndex + 1))}
              disabled={currentExerciseIndex === exercises.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rest Timer */}
      <AnimatePresence>
        {isResting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-blue-800 mb-2">Rest Time</h3>
                <ExerciseTimer
                  duration={currentExercise.rest_duration || 60}
                  onComplete={handleRestComplete}
                  autoStart={true}
                />
                <p className="text-blue-700 mt-4">
                  Prepare for set {currentSet} of {currentExercise.name}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Exercise */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExerciseIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-sage-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentExercise.name}</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-sage-100 text-sage-800">
                    Set {currentSet}/{currentExercise.sets}
                  </Badge>
                  <SupportButton 
                    variant="inline"
                    context="exercise_detail"
                    contextData={{ 
                      exercise_id: currentExercise.id,
                      session_id: session.id 
                    }}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exercise Media */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {currentExercise.video_url && (
                    <div className="aspect-video bg-warm-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-12 h-12 text-warm-gray-400 mx-auto mb-2" />
                        <p className="text-warm-gray-600">Video Demo</p>
                        <p className="text-xs text-warm-gray-500">{currentExercise.video_url}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-warm-gray-900 mb-2">Instructions</h4>
                    <p className="text-warm-gray-700">{currentExercise.instructions}</p>
                  </div>
                  
                  {currentExercise.provider_notes && (
                    <div className="p-3 bg-sage-50 rounded-lg">
                      <h4 className="font-medium text-sage-800 mb-1">Provider Notes</h4>
                      <p className="text-sage-700 text-sm">{currentExercise.provider_notes}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-warm-gray-50 rounded-lg">
                      <p className="font-medium text-warm-gray-900">{currentExercise.reps}</p>
                      <p className="text-sm text-warm-gray-600">Repetitions</p>
                    </div>
                    <div className="p-3 bg-warm-gray-50 rounded-lg">
                      <p className="font-medium text-warm-gray-900">{currentExercise.rest_duration}s</p>
                      <p className="text-sm text-warm-gray-600">Rest</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercise Feedback */}
              <div className="border-t border-warm-gray-200 pt-6 space-y-4">
                <h4 className="font-medium text-warm-gray-900">How are you feeling?</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-warm-gray-700 mb-2">
                      Pain Level (0-10)
                    </label>
                    <Slider
                      value={[exerciseProgress[currentExercise.id]?.pain_after || 0]}
                      onValueChange={(value) => updateExerciseFeedback('pain_after', value[0])}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-warm-gray-500 mt-1">
                      <span>No Pain</span>
                      <span>Worst Pain</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-warm-gray-700 mb-2">
                      Effort Level (1-10)
                    </label>
                    <Slider
                      value={[exerciseProgress[currentExercise.id]?.perceived_exertion || 5]}
                      onValueChange={(value) => updateExerciseFeedback('perceived_exertion', value[0])}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-warm-gray-500 mt-1">
                      <span>Very Easy</span>
                      <span>Maximum</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSetComplete}
                  className="bg-sage-600 hover:bg-sage-700 flex-1"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isLastSet ? 'Complete Exercise' : 'Complete Set'}
                </Button>
                
                <Button
                  onClick={() => handleSkipExercise('Too difficult')}
                  variant="outline"
                  className="text-warm-gray-600"
                >
                  Skip Exercise
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Motivational Messages */}
      <AnimatePresence>
        {showMotivation && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-sage-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <p className="text-center font-medium">{currentMotivation}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Support Button */}
      <SupportButton 
        variant="floating"
        context="exercise_session"
        contextData={{ 
          session_id: session.id,
          exercise_id: currentExercise.id 
        }}
      />
    </div>
  );
}