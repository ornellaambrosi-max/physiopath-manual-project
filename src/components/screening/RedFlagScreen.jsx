import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from "lucide-react";

export default function RedFlagScreen({ data, onUpdate }) {
  const redFlags = data.redFlags || {};

  const handleChange = (field, value) => {
    onUpdate({ ...redFlags, [field]: value }, 'redFlags');
  };

  const flagQuestions = [
    { id: 'trauma', label: 'Have you had any recent significant trauma (e.g., a fall, car accident)?' },
    { id: 'weight_loss', label: 'Have you experienced unexplained weight loss of more than 5kg (10 lbs) in the last 3 months?' },
    { id: 'fever_sweats', label: 'Have you had a fever, chills, or night sweats recently?' },
    { id: 'night_pain', label: 'Do you have constant pain at night that does not change or get better with any position?' },
    { id: 'bladder_bowel', label: 'Have you experienced any new or worsening problems with your bladder or bowel control (e.g., incontinence)?' },
    { id: 'neuro_symptoms', label: 'Have you noticed numbness or tingling in the groin or buttock area (saddle area)?' },
    { id: 'systemic_disease', label: 'Do you have a personal history of cancer?' },
    { id: 'severe_pain', label: 'Is your pain severe, unrelenting, and getting progressively worse?' }
  ];

  return (
    <Card className="border-red-300 bg-red-50 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-red-800">Safety Check</CardTitle>
            <p className="text-red-700">Please answer these important questions carefully.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {flagQuestions.map(q => (
          <div key={q.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-white">
            <Label htmlFor={q.id} className="flex-1 pr-4 font-medium">{q.label}</Label>
            <Switch
              id={q.id}
              checked={redFlags[q.id] || false}
              onCheckedChange={(checked) => handleChange(q.id, checked)}
            />
          </div>
        ))}

        {Object.values(redFlags).some(val => val === true) && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-r-lg">
                <div className="flex">
                    <div className="py-1">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                    </div>
                    <div>
                        <p className="font-bold">Important Information</p>
                        <p className="text-sm">Based on your answers, some symptoms may require further medical evaluation. Please complete the assessment to see our recommendation.</p>
                    </div>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}