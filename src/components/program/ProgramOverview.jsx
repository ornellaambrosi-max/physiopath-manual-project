import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  Activity
} from "lucide-react";

export default function ProgramOverview({ currentProgram, patientData }) {
  if (!currentProgram) {
    return (
      <Card className="border-sage-200 shadow-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-warm-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-warm-gray-400" />
          </div>
          <h3 className="font-semibold text-warm-gray-900 mb-2">No Program Assigned</h3>
          <p className="text-warm-gray-600">
            Complete your screening to get a personalized exercise program.
          </p>
        </CardContent>
      </Card>
    );
  }

  const programProgress = {
    currentWeek: 3,
    totalWeeks: currentProgram.duration_weeks || 8,
    sessionsCompleted: 12,
    totalSessions: (currentProgram.duration_weeks || 8) * (currentProgram.sessions_per_week || 3)
  };

  const progressPercentage = (programProgress.currentWeek / programProgress.totalWeeks) * 100;

  return (
    <div className="space-y-6">
      {/* Program Header */}
      <Card className="border-sage-200 shadow-md bg-gradient-to-r from-sage-50 to-mint-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-warm-gray-900 mb-2">
                {currentProgram.title}
              </CardTitle>
              <p className="text-warm-gray-600 mb-4">
                {currentProgram.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-sage-100 text-sage-800">
                  {currentProgram.program_type}
                </Badge>
                <Badge className="bg-mint-100 text-mint-800">
                  {currentProgram.difficulty_level}
                </Badge>
                <Badge className="bg-ocean-100 text-ocean-800">
                  {currentProgram.condition_type?.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-sage-600">
                Week {programProgress.currentWeek}
              </div>
              <p className="text-warm-gray-600">of {programProgress.totalWeeks}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-warm-gray-700 mb-2">
                <span>Program Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-sage-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Sessions Completed</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  {programProgress.sessionsCompleted}
                </p>
                <p className="text-xs text-warm-gray-500">
                  of {programProgress.totalSessions} total
                </p>
              </div>
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-sage-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Frequency</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  {currentProgram.sessions_per_week || 3}x
                </p>
                <p className="text-xs text-warm-gray-500">per week</p>
              </div>
              <div className="w-12 h-12 bg-mint-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-sage-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Total Exercises</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  {currentProgram.exercises?.length || 0}
                </p>
                <p className="text-xs text-warm-gray-500">in program</p>
              </div>
              <div className="w-12 h-12 bg-ocean-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-sage-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Needed */}
      {currentProgram.equipment_needed && currentProgram.equipment_needed.length > 0 && (
        <Card className="border-sage-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Equipment Needed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentProgram.equipment_needed.map((equipment, index) => (
                <Badge key={index} variant="outline" className="bg-warm-gray-50">
                  {equipment}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Content */}
      {currentProgram.educational_content && (
        <Card className="border-sage-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-sage-600" />
              About Your Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-warm-gray-700 leading-relaxed">
              {currentProgram.educational_content}
            </p>
            {currentProgram.evidence_base && (
              <div className="mt-4 p-3 bg-sage-50 rounded-lg">
                <p className="text-sm text-sage-800">
                  <strong>Evidence Base:</strong> {currentProgram.evidence_base}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}