import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, ListChecks } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// PSFS Component
const PSFS = ({ data, onUpdate }) => {
  const [items, setItems] = useState(data.psfs_items || []);

  const updateParent = (newItems) => {
    onUpdate({ ...data, psfs_items: newItems }, 'scales');
  };

  const handleActivityChange = (index, value) => {
    const newItems = [...items];
    newItems[index].activity = value;
    setItems(newItems);
    updateParent(newItems);
  };

  const handleRatingChange = (index, value) => {
    const newItems = [...items];
    newItems[index].rating = value[0];
    setItems(newItems);
    updateParent(newItems);
  };

  const addItem = () => {
    if (items.length < 3) {
      const newItems = [...items, { activity: "", rating: 5 }];
      setItems(newItems);
      updateParent(newItems);
    }
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    updateParent(newItems);
  };

  return (
    <div className="space-y-4">
      <p className="text-warm-gray-600">Please list up to 3 important activities you are unable to do or have difficulty with because of your problem. Rate your current ability to do each activity.</p>
      {items.map((item, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <Label>Activity #{index + 1}</Label>
            <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
          <Input
            placeholder="e.g., Playing with my children, Running 5km, Lifting groceries"
            value={item.activity}
            onChange={(e) => handleActivityChange(index, e.target.value)}
          />
          <Label>Current Ability (0 = Cannot Do, 10 = Able to Do at Previous Level)</Label>
          <div className="flex items-center gap-4">
            <Slider
              min={0} max={10} step={1}
              value={[item.rating]}
              onValueChange={(value) => handleRatingChange(index, value)}
            />
            <Badge variant="outline" className="text-lg">{item.rating}</Badge>
          </div>
        </div>
      ))}
      {items.length < 3 && (
        <Button variant="outline" onClick={addItem}>
          <Plus className="w-4 h-4 mr-2" /> Add Activity
        </Button>
      )}
    </div>
  );
};

// Generic Questionnaire Component
const Questionnaire = ({ title, questions, data, onUpdate, fieldName }) => {
  const responses = data[fieldName] || {};
  
  const handleResponseChange = (questionId, value) => {
    const newResponses = { ...responses, [questionId]: value };
    onUpdate({ ...data, [fieldName]: newResponses }, 'scales');
  };

  return (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <div key={q.id} className="p-4 border rounded-lg">
          <p className="font-medium mb-3">{index + 1}. {q.text}</p>
          <RadioGroup 
            value={responses[q.id]?.toString() || ''}
            onValueChange={(value) => handleResponseChange(q.id, parseInt(value))}
            className="flex flex-wrap gap-x-4 gap-y-2"
          >
            {q.options.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value.toString()} id={`${q.id}-${opt.value}`} />
                <Label htmlFor={`${q.id}-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

const fabqQuestions = [
    { id: 'fabq1', text: "My pain was caused by physical activity.", options: [{value: 0, label: "0"}, {value: 1, label: "1"}, {value: 2, label: "2"}, {value: 3, label: "3"}, {value: 4, label: "4"}, {value: 5, label: "5"}, {value: 6, label: "6"}] },
    { id: 'fabq2', text: "Physical activity might harm my back.", options: [{value: 0, label: "0"}, {value: 1, label: "1"}, {value: 2, label: "2"}, {value: 3, label: "3"}, {value: 4, label: "4"}, {value: 5, label: "5"}, {value: 6, label: "6"}] },
];

const phqQuestions = [
    { id: 'phq1', text: "Over the last 2 weeks, how often have you been bothered by having little interest or pleasure in doing things?", options: [{value: 0, label: "Not at all"}, {value: 1, label: "Several days"}, {value: 2, label: "More than half the days"}, {value: 3, label: "Nearly every day"}] },
    { id: 'phq2', text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?", options: [{value: 0, label: "Not at all"}, {value: 1, label: "Several days"}, {value: 2, label: "More than half the days"}, {value: 3, label: "Nearly every day"}] },
];


export default function ValidatedScales({ data, onUpdate }) {
  const scales = data.scales || {};

  return (
    <Card className="border-sage-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
            <ListChecks className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-warm-gray-900">Clinical Questionnaires</CardTitle>
            <p className="text-warm-gray-600">These standard questions help us better understand your condition.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">Functional Goals (PSFS)</AccordionTrigger>
            <AccordionContent>
              <PSFS data={scales} onUpdate={onUpdate} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">Beliefs about Pain (Mini-FABQ)</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4 text-warm-gray-600">Please rate your agreement with the following statements (0=Completely Disagree, 6=Completely Agree).</p>
              <Questionnaire title="Beliefs about Pain" questions={fabqQuestions} data={scales} onUpdate={onUpdate} fieldName="fabq_responses" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">Mood Screening (PHQ-2)</AccordionTrigger>
            <AccordionContent>
              <Questionnaire title="Mood Screening" questions={phqQuestions} data={scales} onUpdate={onUpdate} fieldName="phq_responses" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}