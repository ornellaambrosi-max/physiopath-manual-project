import React, { useState, useEffect } from "react";
import { ExerciseProgram, PatientProgress, Patient } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PlayCircle, 
  PauseCircle, 
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ProgramOverview from "../components/program/ProgramOverview";
import TodaysWorkout from "../components/program/TodaysWorkout";
import ExerciseLibrary from "../components/program/ExerciseLibrary";
import ProgressTracking from "../components/program/ProgressTracking";

export default function Program() {
  const [currentProgram, setCurrentProgram] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgramData();
  }, []);

  const loadProgramData = async () => {
    setIsLoading(true);
    try {
      const programs = await ExerciseProgram.list();
      const progress = await PatientProgress.list("-session_date");
      const patients = await Patient.list();
      
      setCurrentProgram(programs[0] || null);
      setProgressData(progress);
      setPatientData(patients[0] || null);
    } catch (error) {
      console.error("Error loading program data:", error);
    }
    setIsLoading(false);
  };

  const tabs = [
    { id: 'today', label: "Today's Session", icon: PlayCircle },
    { id: 'overview', label: 'Program Overview', icon: Target },
    { id: 'exercises', label: 'Exercise Library', icon: Activity },
    { id: 'progress', label: 'Progress Tracking', icon: TrendingUp }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  if (!patientData || (!patientData.screening_completed)) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-sage-200 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-sage-600" />
            </div>
            <h1 className="text-2xl font-bold text-warm-gray-900 mb-4">
              Complete Your Assessment First
            </h1>
            <p className="text-lg text-warm-gray-600 mb-8 max-w-lg mx-auto">
              To access your personalized exercise program, you'll need to complete our comprehensive health screening first.
            </p>
            <Link to={createPageUrl("Screening")}>
              <Button className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-xl font-medium">
                Start Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'today':
        return <TodaysWorkout currentProgram={currentProgram} progressData={progressData} patientData={patientData} />;
      case 'overview':
        return <ProgramOverview currentProgram={currentProgram} patientData={patientData} />;
      case 'exercises':
        return <ExerciseLibrary currentProgram={currentProgram} />;
      case 'progress':
        return <ProgressTracking progressData={progressData} currentProgram={currentProgram} />;
      default:
        return <TodaysWorkout currentProgram={currentProgram} progressData={progressData} patientData={patientData} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-warm-gray-900 mb-4">
          Your Exercise Program
        </h1>
        <p className="text-lg text-warm-gray-600 max-w-2xl mx-auto">
          Evidence-based exercises tailored to your specific needs and recovery goals
        </p>
      </div>

      {/* Program Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-sage-50 to-white border-sage-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Current Week</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  Week 3
                </p>
              </div>
              <Calendar className="w-8 h-8 text-sage-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-mint-50 to-white border-sage-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Sessions Completed</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  {progressData.length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-sage-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-sage-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Avg. Pain Level</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  {progressData.length > 0 ? 
                    Math.round(progressData.reduce((sum, p) => sum + (p.overall_pain_level || 0), 0) / progressData.length) :
                    0}/10
                </p>
              </div>
              <Activity className="w-8 h-8 text-sage-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white border-sage-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Adherence</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  {progressData.length > 0 ? 
                    Math.round(progressData.reduce((sum, p) => sum + (p.adherence_score || 0), 0) / progressData.length) :
                    0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-sage-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card className="border-sage-200 shadow-sm mb-6">
        <CardContent className="p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "bg-sage-600 text-white shadow-md" 
                    : "text-warm-gray-600 hover:bg-sage-50 hover:text-sage-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Tab Content */}
      {renderActiveTab()}
    </div>
  );
}