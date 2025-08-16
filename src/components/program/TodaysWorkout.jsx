import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import { 
  Clock, 
  PlayCircle, 
  Target, 
  ChevronRight 
} from "lucide-react";

export default function TodaysWorkout({ currentProgram, progressData, patientData }) {
  const getTodaysSession = () => {
    // Enhanced session data with more detailed structure
    return {
      week: 3,
      session: 2,
      estimatedTime: 25,
      focus: "Mobility & Strengthening",
      exercises: [
        { 
          id: "neck_rotations",
          name: "Gentle Neck Rotations", 
          sets: 3, 
          reps: "10 each direction",
          category: "mobility",
          video_url: "/videos/neck-rotations.mp4"
        },
        { 
          id: "shoulder_squeezes",
          name: "Shoulder Blade Squeezes", 
          sets: 3, 
          reps: "15",
          category: "strength",
          video_url: "/videos/shoulder-squeezes.mp4"
        },
        { 
          id: "trap_stretches",
          name: "Upper Trap Stretches", 
          sets: 2, 
          reps: "30 second hold",
          category: "flexibility",
          video_url: "/videos/trap-stretches.mp4"
        },
        { 
          id: "posture_strengthening",
          name: "Posture Strengthening", 
          sets: 2, 
          reps: "12",
          category: "strength",
          video_url: "/videos/posture-strengthening.mp4"
        }
      ]
    };
  };

  const hasCompletedToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return progressData && progressData.some(session => 
      session.session_date === today
    );
  };

  const handleStartSession = () => {
    // Navigate to session player
    window.location.href = createPageUrl("SessionPlayer");
  };

  if (!patientData || (patientData.care_pathway !== 'personalized_care' && patientData.care_pathway !== 'standardized_program')) {
    return (
      <Card className="border-sage-200 shadow-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-sage-600" />
          </div>
          <h3 className="font-semibold text-warm-gray-900 mb-2">Ready to Start Your Program?</h3>
          <p className="text-warm-gray-600 mb-4">
            Complete your screening to get a personalized exercise program
          </p>
          <Link to={createPageUrl("Screening")}>
            <Button className="bg-sage-600 hover:bg-sage-700">
              Begin Assessment
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const session = getTodaysSession();
  const completed = hasCompletedToday();

  return (
    <Card className="border-sage-200 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-warm-gray-900">
              Today's Session
            </CardTitle>
            <p className="text-warm-gray-600 mt-1">
              Week {session.week}, Session {session.session}
            </p>
          </div>
          <Badge className={completed ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200"}>
            {completed ? "Completed" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-sage-50 rounded-lg">
          <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-sage-600" />
          </div>
          <div>
            <div className="font-medium text-warm-gray-900">
              ~{session.estimatedTime} minutes
            </div>
            <div className="text-sm text-warm-gray-600">
              Focus: {session.focus}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-warm-gray-800 mb-3">Exercise Preview</h4>
          <div className="space-y-2">
            {session.exercises.map((exercise, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-sage-200 rounded-lg">
                <div className="flex items-center gap-3">
                  {/* Exercise Category Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    exercise.category === 'mobility' ? 'bg-blue-100 text-blue-700' :
                    exercise.category === 'strength' ? 'bg-red-100 text-red-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {exercise.category === 'mobility' ? 'M' :
                     exercise.category === 'strength' ? 'S' : 'F'}
                  </div>
                  <div>
                    <div className="font-medium text-warm-gray-900">{exercise.name}</div>
                    <div className="text-sm text-warm-gray-600">
                      {exercise.sets} sets × {exercise.reps}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-warm-gray-400" />
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleStartSession}
          className={`w-full ${
            completed 
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-sage-600 hover:bg-sage-700"
          } text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg`}
          disabled={completed}
        >
          {completed ? (
            <>View Session Details</>
          ) : (
            <>
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Session
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}