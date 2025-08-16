import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExerciseSession, Exercise, Patient } from "@/entities/all";
import { createPageUrl } from "@/utils";
import SessionPlayer from "../components/exercise/SessionPlayer";
import SessionPreparation from "../components/exercise/SessionPreparation";
import SessionCompletion from "../components/exercise/SessionCompletion";

export default function ExerciseSessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [patient, setPatient] = useState(null);
  const [sessionPhase, setSessionPhase] = useState('preparation'); // preparation, active, completion
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessionData();
  }, [sessionId]);

  const loadSessionData = async () => {
    setIsLoading(true);
    try {
      // Load session data
      const sessions = await ExerciseSession.list();
      const session = sessions.find(s => s.id === sessionId) || sessions[0]; // Fallback for demo
      
      if (session) {
        setSessionData(session);
        
        // Load exercises
        const allExercises = await Exercise.list();
        const sessionExercises = session.exercises.map(sessionEx => {
          const exercise = allExercises.find(ex => ex.id === sessionEx.exercise_id);
          return {
            ...exercise,
            ...sessionEx // Merge session-specific data (sets, reps, etc.)
          };
        });
        setExercises(sessionExercises);
      }

      // Load patient data
      const patients = await Patient.list();
      setPatient(patients[0]); // In real app, get current user's patient record
      
    } catch (error) {
      console.error("Error loading session data:", error);
    }
    setIsLoading(false);
  };

  const handleStartSession = () => {
    setSessionPhase('active');
  };

  const handleCompleteSession = (sessionResults) => {
    // Update session with results
    updateSessionProgress(sessionResults);
    setSessionPhase('completion');
  };

  const updateSessionProgress = async (results) => {
    try {
      // In a real app, update the ExerciseSession with results
      console.log("Session results:", results);
      
      // Also create PatientProgress record
      // await PatientProgress.create(results);
      
    } catch (error) {
      console.error("Error updating session progress:", error);
    }
  };

  const handleFinishAndExit = () => {
    navigate(createPageUrl("Dashboard"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  if (!sessionData || !exercises.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-warm-gray-900 mb-2">
            Session Not Found
          </h2>
          <p className="text-warm-gray-600 mb-4">
            The requested exercise session could not be loaded.
          </p>
          <button
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-2 rounded-xl"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  switch (sessionPhase) {
    case 'preparation':
      return (
        <SessionPreparation
          session={sessionData}
          exercises={exercises}
          patient={patient}
          onStartSession={handleStartSession}
        />
      );
    case 'active':
      return (
        <SessionPlayer
          session={sessionData}
          exercises={exercises}
          patient={patient}
          onCompleteSession={handleCompleteSession}
        />
      );
    case 'completion':
      return (
        <SessionCompletion
          session={sessionData}
          exercises={exercises}
          onFinish={handleFinishAndExit}
        />
      );
    default:
      return null;
  }
}