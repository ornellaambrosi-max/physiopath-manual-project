import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  Users, 
  HelpCircle,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActions({ patientData }) {
  const quickActions = [
    {
      title: "Educational Resources",
      description: "Learn about your condition",
      icon: BookOpen,
      link: createPageUrl("Education"),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100"
    },
    {
      title: "Find Specialists",
      description: "Browse healthcare providers",
      icon: Users,
      link: createPageUrl("Providers"),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100"
    },
    {
      title: "Progress Reports",
      description: "Download your progress",
      icon: FileText,
      link: "#",
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100"
    },
    {
      title: "Get Support",
      description: "Contact our team",
      icon: MessageSquare,
      link: "#",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100"
    }
  ];

  return (
    <Card className="border-sage-200 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-warm-gray-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.link} className="block">
            <div className={`p-4 rounded-lg transition-all duration-200 ${action.bgColor} ${action.hoverColor} border border-transparent hover:border-sage-200 hover:shadow-sm`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.bgColor} border border-white`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-warm-gray-900 mb-1">
                    {action.title}
                  </h4>
                  <p className="text-sm text-warm-gray-600">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}