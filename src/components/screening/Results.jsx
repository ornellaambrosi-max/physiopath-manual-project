import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, AlertTriangle, CheckCircle, HeartPulse } from "lucide-react";

export default function Results({ results }) {
  if (!results) {
    return (
      <Card className="text-center p-8">
        <p>Generating your results...</p>
      </Card>
    );
  }

  const { recommendedPathway, riskLevel, summary, recommendations } = results;

  const resultInfo = {
    urgent_medical_assessment: {
      icon: AlertTriangle,
      color: "red",
      title: "Urgent Medical Assessment Recommended",
      actionText: "Find a Provider",
      actionLink: createPageUrl("Providers")
    },
    personalized_care: {
      icon: HeartPulse,
      color: "sage",
      title: "Personalized Care Pathway Recommended",
      actionText: "View Your Program",
      actionLink: createPageUrl("Program")
    },
    standardized_program: {
      icon: CheckCircle,
      color: "blue",
      title: "Structured Program Recommended",
      actionText: "Explore Programs",
      actionLink: createPageUrl("Program")
    },
    self_management: {
      icon: CheckCircle,
      color: "green",
      title: "Self-Management Pathway Recommended",
      actionText: "Learn More",
      actionLink: createPageUrl("Education")
    }
  };

  const currentResult = resultInfo[recommendedPathway] || resultInfo.self_management;
  const Icon = currentResult.icon;
  const colorClass = {
    red: "bg-red-100 border-red-500 text-red-800",
    sage: "bg-sage-100 border-sage-500 text-sage-800",
    blue: "bg-blue-100 border-blue-500 text-blue-800",
    green: "bg-green-100 border-green-500 text-green-800",
  };
  const buttonClass = {
    red: "bg-red-600 hover:bg-red-700",
    sage: "bg-sage-600 hover:bg-sage-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
  }

  return (
    <Card className="border-sage-200 shadow-xl">
      <CardHeader className="text-center bg-sage-50 p-8">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 ${colorClass[currentResult.color]}`}>
          <Icon className="w-10 h-10" />
        </div>
        <CardTitle className="text-2xl text-warm-gray-900">Thank You for Completing the Assessment</CardTitle>
        <p className="text-warm-gray-600">Here is a summary of our recommendations for you.</p>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className={`p-6 rounded-xl border-l-4 ${colorClass[currentResult.color]}`}>
          <h3 className="font-bold text-xl mb-2">{currentResult.title}</h3>
          <p className="text-lg">{summary}</p>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3">Key Recommendations:</h4>
          <ul className="list-disc list-inside space-y-2 text-warm-gray-700">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
        
        {recommendedPathway === 'urgent_medical_assessment' && (
             <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-r-lg">
                <p className="font-bold">Disclaimer:</p>
                <p className="text-sm">This is not a medical diagnosis. Please consult a doctor or go to an emergency department for a full evaluation. This tool is for screening purposes only.</p>
            </div>
        )}
        
        <div className="text-center pt-6">
            <h3 className="font-semibold text-lg mb-3">What's Next?</h3>
            <p className="text-warm-gray-600 mb-4">Click the button below to proceed to the next step in your recovery journey.</p>
            <Link to={currentResult.actionLink}>
                <Button className={`px-8 py-3 text-lg rounded-xl ${buttonClass[currentResult.color]}`}>
                    {currentResult.actionText} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}