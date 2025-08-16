import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function WelcomeCard({ patientData, nextSteps }) {
  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-orange-100 text-orange-700 border-orange-200",
      low: "bg-sage-100 text-sage-700 border-sage-200"
    };

    const icons = {
      high: AlertTriangle,
      medium: Clock,
      low: CheckCircle2
    };

    const Icon = icons[priority];

    return (
      <Badge className={`${styles[priority]} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {priority === 'high' ? 'Priority' : priority === 'medium' ? 'Important' : 'Continue'}
      </Badge>
    );
  };

  return (
    <Card className="bg-gradient-to-r from-white via-sage-50 to-mint-50 border-sage-200 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-warm-gray-900">
                Your Next Step
              </h2>
              {getPriorityBadge(nextSteps.priority)}
            </div>
            <h3 className="text-xl font-semibold text-warm-gray-800 mb-2">
              {nextSteps.title}
            </h3>
            <p className="text-warm-gray-600 mb-6 text-lg leading-relaxed">
              {nextSteps.description}
            </p>
            <Link to={nextSteps.link}>
              <Button className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                {nextSteps.action}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-gradient-to-br from-sage-100 to-sage-200 rounded-full flex items-center justify-center shadow-inner">
              <div className="w-20 h-20 bg-sage-500 rounded-full flex items-center justify-center shadow-lg">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}