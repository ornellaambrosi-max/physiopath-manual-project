import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList } from "lucide-react";

export default function FunctionalAssessment({ data, onUpdate }) {
  const functional = data.functional || {};

  const handleChange = (field, value) => {
    onUpdate({ ...functional, [field]: value }, 'functional');
  };

  return (
    <Card className="border-sage-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-warm-gray-900">Your Story & Goals</CardTitle>
            <p className="text-warm-gray-600">Help us understand the bigger picture and what's important to you.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="patient_narrative" className="font-medium">Your Story</Label>
          <Textarea
            id="patient_narrative"
            value={functional.patient_narrative || ''}
            onChange={(e) => handleChange('patient_narrative', e.target.value)}
            placeholder="Please tell us the story of your problem in your own words. How has it evolved over time?"
            rows={4}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals" className="font-medium">Your Goals & Expectations</Label>
          <Textarea
            id="goals"
            value={functional.goals || ''}
            onChange={(e) => handleChange('goals', e.target.value)}
            placeholder="What are the most important things you want to achieve with treatment? What are your expectations?"
            rows={4}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="impact_on_life" className="font-medium">Impact on Your Life</Label>
          <Textarea
            id="impact_on_life"
            value={functional.impact_on_life || ''}
            onChange={(e) => handleChange('impact_on_life', e.target.value)}
            placeholder="How has this problem affected your work, hobbies, social life, and daily activities?"
            rows={4}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="support_system" className="font-medium">Your Support System</Label>
          <Textarea
            id="support_system"
            value={functional.support_system || ''}
            onChange={(e) => handleChange('support_system', e.target.value)}
            placeholder="Tell us about the support you have from family, friends, or other healthcare professionals."
            rows={3}
            className="rounded-xl"
          />
        </div>
      </CardContent>
    </Card>
  );
}