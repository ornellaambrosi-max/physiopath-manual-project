import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format } from "date-fns";

export default function ProgressOverview({ progressData, screeningData }) {
  const getProgressTrend = () => {
    if (progressData.length < 2) return null;
    
    const latest = progressData[0]?.overall_pain_level || 0;
    const previous = progressData[1]?.overall_pain_level || 0;
    
    if (latest < previous) return { type: 'improving', icon: TrendingDown, color: 'text-green-600' };
    if (latest > previous) return { type: 'declining', icon: TrendingUp, color: 'text-red-600' };
    return { type: 'stable', icon: Minus, color: 'text-warm-gray-600' };
  };

  const getAdherenceScore = () => {
    if (progressData.length === 0) return 0;
    const totalSessions = progressData.length;
    const avgAdherence = progressData.reduce((sum, session) => sum + (session.adherence_score || 0), 0) / totalSessions;
    return Math.round(avgAdherence);
  };

  const getWeeklyProgress = () => {
    // Group sessions by week
    const weeklyData = {};
    progressData.forEach(session => {
      const week = `Week ${session.week_number}`;
      if (!weeklyData[week]) {
        weeklyData[week] = {
          sessions: 0,
          totalPain: 0,
          totalAdherence: 0
        };
      }
      weeklyData[week].sessions += 1;
      weeklyData[week].totalPain += session.overall_pain_level || 0;
      weeklyData[week].totalAdherence += session.adherence_score || 0;
    });

    return Object.keys(weeklyData).map(week => ({
      week,
      avgPain: Math.round(weeklyData[week].totalPain / weeklyData[week].sessions),
      avgAdherence: Math.round(weeklyData[week].totalAdherence / weeklyData[week].sessions)
    })).reverse();
  };

  const trend = getProgressTrend();
  const adherenceScore = getAdherenceScore();
  const weeklyProgress = getWeeklyProgress();

  return (
    <Card className="shadow-md border-sage-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-warm-gray-900">
            Progress Overview
          </CardTitle>
          {trend && (
            <div className={`flex items-center gap-1 ${trend.color}`}>
              <trend.icon className="w-4 h-4" />
              <span className="text-sm font-medium capitalize">{trend.type}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Adherence */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-warm-gray-700">Program Adherence</span>
            <span className="text-sm font-bold text-warm-gray-900">{adherenceScore}%</span>
          </div>
          <Progress value={adherenceScore} className="h-3" />
          <p className="text-xs text-warm-gray-600 mt-1">
            {adherenceScore >= 80 ? 'Excellent progress!' : 
             adherenceScore >= 60 ? 'Good consistency!' : 
             'Keep building the habit!'}
          </p>
        </div>

        {/* Weekly Breakdown */}
        {weeklyProgress.length > 0 && (
          <div>
            <h4 className="font-medium text-warm-gray-800 mb-3">Weekly Progress</h4>
            <div className="space-y-3">
              {weeklyProgress.slice(-4).map((week, index) => (
                <div key={week.week} className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-sage-700">{index + 1}</span>
                    </div>
                    <span className="font-medium text-warm-gray-800">{week.week}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <div className="font-medium text-warm-gray-900">{week.avgAdherence}%</div>
                      <div className="text-warm-gray-600">adherence</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-warm-gray-900">{week.avgPain}/10</div>
                      <div className="text-warm-gray-600">avg pain</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {progressData.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-sage-600" />
            </div>
            <p className="text-warm-gray-600">
              Start your first session to see your progress here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}