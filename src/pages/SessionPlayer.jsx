import React, { useState, useEffect } from "react";
import { ExerciseProgram, PatientProgress, Patient } from "@/entities/all";
import { useParams, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import SessionPlayer from "../components/program/SessionPlayer";

export default function SessionPlayerPage() {
  const navigate = useNavigate();
  const [currentProgram, setCurrentProgram] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // For demo purposes, we'll use fixed values. In a real app, these would come from URL params or state
  const weekNumber = 3;
  const sessionNumber = 2;

  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = async () => {
    setIsLoading(true);
    try {
      const programs = await ExerciseProgram.list();
      const patients = await Patient.list();
      
      setCurrentProgram(programs[0] || null);
      setPatientData(patients[0] || null);
    } catch (error) {
      console.error("Error loading session data:", error);
    }
    setIsLoading(false);
  };

  const handleSessionComplete = async (sessionData) => {
    try {
      // Save session progress to database
      await PatientProgress.create({
        patient_id: patientData.id,
        ...sessionData
      });
      
      // Navigate back to program page or dashboard
      navigate(createPageUrl("Program"));
    } catch (error) {
      console.error("Error saving session progress:", error);
    }
  };

  const handleProgressUpdate = async (updateData) => {
    // Real-time progress updates for clinician monitoring
    console.log("Progress update:", updateData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  if (!currentProgram || !patientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-warm-gray-900 mb-2">
            No Active Program Found
          </h2>
          <p className="text-warm-gray-600 mb-4">
            Please complete your screening first to get a personalized program.
          </p>
          <button
            onClick={() => navigate(createPageUrl("Screening"))}
            className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-2 rounded-xl"
          >
            Start Screening
          </button>
        </div>
      </div>
    );
  }

  return (
    <SessionPlayer
      program={currentProgram}
      weekNumber={weekNumber}
      sessionNumber={sessionNumber}
      onSessionComplete={handleSessionComplete}
      onProgressUpdate={handleProgressUpdate}
    />
  );
}