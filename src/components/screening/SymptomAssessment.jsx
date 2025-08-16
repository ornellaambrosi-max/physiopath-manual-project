import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Activity } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SymptomAssessment({ data, onUpdate }) {
  const symptoms = data.symptoms || {};

  const handleChange = (field, value) => {
    onUpdate({ ...symptoms, [field]: value }, 'symptoms');
  };

  const problemTypes = [
    { value: 'acute', label: 'Acute Problem', description: 'A recent injury or onset of pain (less than 6 weeks).' },
    { value: 'chronic', label: 'Chronic Problem', description: 'A long-standing issue or recurring pain (more than 3 months).' },
    { value: 'post_operative', label: 'Post-Operative', description: 'Recovery and rehabilitation after a surgery.' },
    { value: 'prevention_checkup', label: 'Prevention / Check-up', description: 'Looking to prevent injuries or get a general assessment.' },
  ];

  return (
    <Card className="border-sage-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
            <Activity className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-warm-gray-900">Symptom Assessment</CardTitle>
            <p className="text-warm-gray-600">Tell us about your current symptoms and concerns</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label className="text-lg font-medium">What best describes your problem?</Label>
          <RadioGroup 
            value={symptoms.problem_type || ''} 
            onValueChange={(value) => handleChange('problem_type', value)}
            className="grid md:grid-cols-2 gap-4"
          >
            {problemTypes.map(type => (
              <Label key={type.value} className="flex items-start space-x-3 p-4 border rounded-xl cursor-pointer has-[:checked]:bg-sage-50 has-[:checked]:border-sage-500 transition-all">
                <RadioGroupItem value={type.value} id={type.value} />
                <div className="flex flex-col">
                  <span className="font-semibold">{type.label}</span>
                  <span className="text-sm text-warm-gray-600">{type.description}</span>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryComplaint" className="text-lg font-medium">What is your primary complaint?</Label>
          <Textarea
            id="primaryComplaint"
            value={symptoms.primaryComplaint || ''}
            onChange={(e) => handleChange('primaryComplaint', e.target.value)}
            placeholder="In your own words, describe your main symptom or problem (e.g., 'Sharp pain in my right shoulder when I lift my arm')"
            rows={3}
            className="rounded-xl text-base"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="symptom_onset" className="font-medium">How did your symptoms start?</Label>
            <Textarea
              id="symptom_onset"
              value={symptoms.symptom_onset || ''}
              onChange={(e) => handleChange('symptom_onset', e.target.value)}
              placeholder="e.g., 'Lifting a heavy box', 'Gradual onset from desk work', 'After a fall'"
              rows={2}
              className="rounded-xl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration" className="font-medium">How long have you had these symptoms?</Label>
            <Select 
              value={symptoms.duration || ''} 
              onValueChange={(value) => handleChange('duration', value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less_than_1_week">Less than 1 week</SelectItem>
                <SelectItem value="1_2_weeks">1-2 weeks</SelectItem>
                <SelectItem value="2_6_weeks">2-6 weeks</SelectItem>
                <SelectItem value="6_weeks_3_months">6 weeks - 3 months</SelectItem>
                <SelectItem value="3_6_months">3-6 months</SelectItem>
                <SelectItem value="more_than_1_year">More than 1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="aggravating_factors" className="font-medium">What makes the pain worse?</Label>
                <Textarea
                    id="aggravating_factors"
                    value={symptoms.aggravating_factors || ''}
                    onChange={(e) => handleChange('aggravating_factors', e.target.value)}
                    placeholder="e.g., 'Sitting for long periods, bending forward, walking uphill'"
                    rows={3}
                    className="rounded-xl"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="relieving_factors" className="font-medium">What makes the pain better?</Label>
                <Textarea
                    id="relieving_factors"
                    value={symptoms.relieving_factors || ''}
                    onChange={(e) => handleChange('relieving_factors', e.target.value)}
                    placeholder="e.g., 'Lying down, stretching, applying heat'"
                    rows={3}
                    className="rounded-xl"
                />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SymptomAssessment({ onChange, defaultValue }) {
  const [state, setState] = useState({
    pain: 0,
    stiffness: 0,
    fatigue: 0,
    notes: "",
    ...(defaultValue || {}),
  });

  function update(partial) {
    const next = { ...state, ...partial };
    setState(next);
    onChange?.(next);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valutazione Sintomi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Dolore</Label>
          <Slider min={0} max={10} step={1} value={state.pain} onChange={(v) => update({ pain: v })} />
        </div>
        <div>
          <Label>Rigidità</Label>
          <Slider min={0} max={10} step={1} value={state.stiffness} onChange={(v) => update({ stiffness: v })} />
        </div>
        <div>
          <Label>Affaticamento</Label>
          <Slider min={0} max={10} step={1} value={state.fatigue} onChange={(v) => update({ fatigue: v })} />
        </div>
        <div>
          <Label>Note</Label>
          <Textarea rows={4} value={state.notes} onChange={(e) => update({ notes: e.target.value })} placeholder="Annotazioni libere…" />
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={() => onChange?.(state)}>Salva</Button>
        </div>
      </CardContent>
    </Card>
  );
}
