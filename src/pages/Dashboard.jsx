import React, { useState, useEffect } from "react";
import { Patient, ScreeningAssessment, PatientProgress } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  Calendar, 
  Target, 
  CheckCircle2,
  ArrowRight,
  Zap,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import ProgressOverview from "../components/dashboard/ProgressOverview";
import TodaysSession from "../components/dashboard/TodaysSession";
import HealthInsights from "../components/dashboard/HealthInsights";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [patientData, setPatientData] = useState(null);
  const [screeningData, setScreeningData] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const patients = await Patient.list();
      const screenings = await ScreeningAssessment.list();
      const progress = await PatientProgress.list("-session_date");
      
      setPatientData(patients[0] || null);
      setScreeningData(screenings[0] || null);
      setProgressData(progress);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getWelcomeMessage = () => {
    if (!patientData) return "Welcome to PhysioPath";
    
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    return `${greeting}, ${patientData.first_name}`;
  };

  const getNextSteps = () => {
    if (!patientData || !patientData.screening_completed) {
      return {
        title: "Complete Your Initial Screening",
        description: "Start your personalized care journey with our comprehensive assessment",
        action: "Begin Screening",
        link: createPageUrl("Screening"),
        priority: "high"
      };
    }

    if (patientData.care_pathway === "referral") {
      return {
        title: "Review Provider Recommendations",
        description: "We've identified healthcare providers that can best help you",
        action: "View Providers",
        link: createPageUrl("Providers"),
        priority: "medium"
      };
    }

    return {
      title: "Continue Your Program",
      description: "Keep up the momentum with today's exercises",
      action: "Start Session",
      link: createPageUrl("Program"),
      priority: "low"
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  const nextSteps = getNextSteps();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-warm-gray-900 mb-2">
          {getWelcomeMessage()}
        </h1>
        <p className="text-lg text-warm-gray-600 max-w-2xl mx-auto">
          Your personalized path to recovery and optimal health starts here
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-sage-50 to-white border-sage-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Care Pathway</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  {patientData?.care_pathway?.replace('_', ' ') || 'Not Started'}
                </p>
              </div>
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-sage-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-mint-50 to-white border-sage-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Progress</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  {progressData.length > 0 ? `${Math.round(progressData[0].adherence_score || 0)}%` : '0%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-mint-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-sage-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-sage-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Sessions</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  {progressData.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-sage-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white border-sage-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Next Session</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  Today
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-sage-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <WelcomeCard 
            patientData={patientData}
            nextSteps={nextSteps}
          />
          
          <ProgressOverview 
            progressData={progressData}
            screeningData={screeningData}
          />

          <TodaysSession 
            patientData={patientData}
            progressData={progressData}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <HealthInsights 
            screeningData={screeningData}
            progressData={progressData}
          />
          
          <QuickActions 
            patientData={patientData}
          />

          {/* Motivational Card */}
          <Card className="bg-gradient-to-br from-sage-500 to-sage-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Daily Inspiration</h3>
                </div>
              </div>
              <p className="text-sage-50 text-sm leading-relaxed mb-4">
                "Every step forward, no matter how small, is progress. Your body has an incredible capacity to heal and adapt."
              </p>
              <div className="text-xs text-sage-100">
                Recovery is not just about healing - it's about rediscovering your strength.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}