import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  Minus,
  Calendar,
  Activity,
  Heart,
  Target,
  Award
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function ProgressTracking({ progressData, currentProgram }) {
  // Process progress data for charts
  const processProgressData = () => {
    if (!progressData || progressData.length === 0) return [];
    
    return progressData.slice(0, 10).reverse().map((session, index) => ({
      session: `S${index + 1}`,
      date: new Date(session.session_date).toLocaleDateString(),
      pain: session.overall_pain_level || 0,
      adherence: session.adherence_score || 0,
      duration: session.session_duration_minutes || 0
    }));
  };

  const chartData = processProgressData();

  // Calculate trends
  const getTrend = (dataKey) => {
    if (chartData.length < 2) return null;
    
    const latest = chartData[chartData.length - 1][dataKey];
    const previous = chartData[chartData.length - 2][dataKey];
    
    if (dataKey === 'pain') {
      // For pain, lower is better
      if (latest < previous) return { type: 'improving', icon: TrendingDown, color: 'text-green-600' };
      if (latest > previous) return { type: 'concerning', icon: TrendingUp, color: 'text-red-600' };
    } else {
      // For adherence and duration, higher is better
      if (latest > previous) return { type: 'improving', icon: TrendingUp, color: 'text-green-600' };
      if (latest < previous) return { type: 'declining', icon: TrendingDown, color: 'text-red-600' };
    }
    
    return { type: 'stable', icon: Minus, color: 'text-warm-gray-600' };
  };

  const painTrend = getTrend('pain');
  const adherenceTrend = getTrend('adherence');

  // Calculate overall stats
  const overallStats = {
    totalSessions: progressData.length,
    averagePain: progressData.length > 0 ? 
      Math.round(progressData.reduce((sum, session) => sum + (session.overall_pain_level || 0), 0) / progressData.length * 10) / 10 : 0,
    averageAdherence: progressData.length > 0 ? 
      Math.round(progressData.reduce((sum, session) => sum + (session.adherence_score || 0), 0) / progressData.length) : 0,
    streakDays: calculateStreak()
  };

  function calculateStreak() {
    if (progressData.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < progressData.length; i++) {
      const sessionDate = new Date(progressData[i].session_date);
      const daysDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  if (!progressData || progressData.length === 0) {
    return (
      <Card className="border-sage-200 shadow-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-warm-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-warm-gray-400" />
          </div>
          <h3 className="font-semibold text-warm-gray-900 mb-2">No Progress Data</h3>
          <p className="text-warm-gray-600">
            Complete your first exercise session to start tracking your progress.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-sage-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  {overallStats.totalSessions}
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
                <p className="text-sm font-medium text-warm-gray-600">Avg. Pain Level</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold text-warm-gray-900">
                    {overallStats.averagePain}/10
                  </p>
                  {painTrend && (
                    <painTrend.icon className={`w-4 h-4 ${painTrend.color}`} />
                  )}
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Adherence</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold text-warm-gray-900">
                    {overallStats.averageAdherence}%
                  </p>
                  {adherenceTrend && (
                    <adherenceTrend.icon className={`w-4 h-4 ${adherenceTrend.color}`} />
                  )}
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warm-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-warm-gray-900 mt-1">
                  {overallStats.streakDays} days
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pain Level Chart */}
      <Card className="border-sage-200 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Pain Level Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  labelFormatter={(value) => `Session ${value}`}
                  formatter={(value) => [`${value}/10`, 'Pain Level']}
                />
                <Line 
                  type="monotone" 
                  dataKey="pain" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Adherence Chart */}
      <Card className="border-sage-200 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-sage-600" />
            Exercise Adherence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => `Session ${value}`}
                  formatter={(value) => [`${value}%`, 'Adherence']}
                />
                <Bar 
                  dataKey="adherence" 
                  fill="#4a8a4a"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card className="border-sage-200 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sage-600" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressData.slice(0, 5).map((session, index) => (
              <div key={session.id || index} className="flex items-center justify-between p-3 border border-sage-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-sage-700">
                      W{session.week_number}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-warm-gray-900">
                      Week {session.week_number}, Session {session.session_number}
                    </p>
                    <p className="text-sm text-warm-gray-600">
                      {new Date(session.session_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-warm-gray-900">
                      {session.overall_pain_level || 0}/10
                    </p>
                    <p className="text-warm-gray-600">Pain</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-warm-gray-900">
                      {session.adherence_score || 0}%
                    </p>
                    <p className="text-warm-gray-600">Adherence</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-warm-gray-900">
                      {session.session_duration_minutes || 0}min
                    </p>
                    <p className="text-warm-gray-600">Duration</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}