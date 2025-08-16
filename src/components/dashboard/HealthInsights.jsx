import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Heart, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function HealthInsights({ screeningData, progressData }) {
  const getInsights = () => {
    const insights = [];

    if (screeningData) {
      // Pain level insights
      const latestPain = progressData[0]?.overall_pain_level;
      const initialPain = screeningData.pain_areas?.[0]?.pain_level;
      
      if (latestPain && initialPain && latestPain < initialPain) {
        insights.push({
          type: "positive",
          icon: TrendingDown,
          title: "Pain Improvement",
          description: `Your pain has decreased from ${initialPain}/10 to ${latestPain}/10`,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        });
      }

      // Adherence insights
      const recentAdherence = progressData.slice(0, 7).reduce((sum, session) => 
        sum + (session.adherence_score || 0), 0) / Math.min(progressData.length, 7);
      
      if (recentAdherence >= 80) {
        insights.push({
          type: "positive",
          icon: CheckCircle2,
          title: "Excellent Consistency",
          description: `You've maintained ${Math.round(recentAdherence)}% adherence this week`,
          color: "text-sage-600",
          bgColor: "bg-sage-50",
          borderColor: "border-sage-200"
        });
      } else if (recentAdherence < 60) {
        insights.push({
          type: "attention",
          icon: AlertTriangle,
          title: "Consistency Opportunity",
          description: "Regular practice leads to better outcomes. Try setting reminders!",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200"
        });
      }

      // Risk level insights
      if (screeningData.risk_level === 'low') {
        insights.push({
          type: "positive",
          icon: Heart,
          title: "Low Risk Profile",
          description: "Your screening indicates good recovery potential",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200"
        });
      }
    }

    // Default insights if no data
    if (insights.length === 0) {
      insights.push({
        type: "neutral",
        icon: Heart,
        title: "Getting Started",
        description: "Complete your first sessions to see personalized insights",
        color: "text-warm-gray-600",
        bgColor: "bg-warm-gray-50",
        borderColor: "border-warm-gray-200"
      });
    }

    return insights.slice(0, 3); // Show max 3 insights
  };

  const insights = getInsights();

  return (
    <Card className="border-sage-200 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-warm-gray-900">
          Health Insights
        </CardTitle>
        <p className="text-sm text-warm-gray-600">
          Personalized observations about your progress
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${insight.bgColor} border ${insight.borderColor}`}>
                <insight.icon className={`w-4 h-4 ${insight.color}`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${insight.color} mb-1`}>
                  {insight.title}
                </h4>
                <p className="text-sm text-warm-gray-700">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-sage-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-sage-600" />
            </div>
            <p className="text-sm text-warm-gray-600 italic">
              "Recovery is not just about healing - it's about rediscovering your capabilities and building resilience for the future."
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}