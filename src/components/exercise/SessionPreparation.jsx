import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Clock, 
  Target, 
  Music, 
  CheckCircle2,
  AlertCircle,
  Dumbbell
} from "lucide-react";
import { motion } from "framer-motion";
import SupportButton from "../Support/SupportButton";

export default function SessionPreparation({ session, exercises, patient, onStartSession }) {
  const estimatedDuration = session.estimated_duration_minutes || 
    exercises.reduce((total, ex) => total + (ex.sets * 2) + (ex.rest_duration * ex.sets), 0) / 60;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-warm-gray-900 mb-2">
            {session.title}
          </h1>
          <p className="text-lg text-warm-gray-600">
            Week {session.week_number} • Session {session.session_number}
          </p>
        </div>

        {/* Session Overview */}
        <Card className="border-sage-200 shadow-lg bg-gradient-to-br from-sage-50 to-mint-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-sage-600" />
              Session Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Dumbbell className="w-8 h-8 text-sage-600" />
                </div>
                <h3 className="font-semibold text-warm-gray-900">
                  {exercises.length} Exercises
                </h3>
                <p className="text-warm-gray-600 text-sm">
                  Tailored for your recovery
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-mint-600" />
                </div>
                <h3 className="font-semibold text-warm-gray-900">
                  ~{Math.round(estimatedDuration)} Minutes
                </h3>
                <p className="text-warm-gray-600 text-sm">
                  Estimated duration
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-ocean-600" />
                </div>
                <h3 className="font-semibold text-warm-gray-900">
                  Progressive
                </h3>
                <p className="text-warm-gray-600 text-sm">
                  Building on your progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pre-session Reminders */}
        {session.pre_session_reminders && session.pre_session_reminders.length > 0 && (
          <Card className="border-ocean-200 bg-ocean-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ocean-800">
                <AlertCircle className="w-5 h-5" />
                Before You Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {session.pre_session_reminders.map((reminder, index) => (
                  <li key={index} className="flex items-start gap-2 text-ocean-700">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{reminder}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Exercise Preview */}
        <Card className="border-sage-200 shadow-md">
          <CardHeader>
            <CardTitle>Today's Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="flex items-center gap-4 p-4 border border-sage-200 rounded-lg">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center font-semibold text-sage-700">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-warm-gray-900">{exercise.name}</h4>
                    <p className="text-sm text-warm-gray-600">
                      {exercise.sets} sets × {exercise.reps}
                      {exercise.rest_duration && ` • ${exercise.rest_duration}s rest`}
                    </p>
                    {exercise.provider_notes && (
                      <p className="text-sm text-sage-700 mt-1 italic">
                        Note: {exercise.provider_notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {exercise.tags && exercise.tags.slice(0, 2).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Music & Motivation */}
        {(session.music_playlist || session.motivational_phrases) && (
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Music className="w-5 h-5" />
                Session Enhancements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {session.music_playlist && (
                <div>
                  <p className="font-medium text-purple-700">🎵 Playlist Ready</p>
                  <p className="text-sm text-purple-600">{session.music_playlist.name}</p>
                </div>
              )}
              {session.motivational_phrases && session.motivational_phrases.length > 0 && (
                <div>
                  <p className="font-medium text-purple-700">💪 Motivational Messages</p>
                  <p className="text-sm text-purple-600">Encouraging messages throughout your session</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            onClick={onStartSession}
            size="lg"
            className="bg-sage-600 hover:bg-sage-700 text-white px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Play className="w-6 h-6 mr-3" />
            Start Session
          </Button>
          
          <SupportButton 
            variant="inline"
            context="exercise_session"
            contextData={{ session_id: session.id }}
          >
            Need Help?
          </SupportButton>
        </div>
      </motion.div>
    </div>
  );
}