import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Map, AlertTriangle, RotateCcw, Trash2, Undo } from "lucide-react";
import InteractiveBodyChart from "./InteractiveBodyChart";
import SymptomControls from "./SymptomControls";
import { HelpTooltip } from "../common/Tooltip";

// Define sensation types with associated colors
const SENSATION_TYPES = {
  Pain: { color: "hsl(0, 90%, 60%)" },
  Numbness: { color: "hsl(200, 90%, 60%)" },
  Tingling: { color: "hsl(50, 90%, 60%)" },
  Burning: { color: "hsl(30, 90%, 60%)" },
  Heaviness: { color: "hsl(240, 30%, 50%)" },
  Tightness: { color: "hsl(300, 50%, 50%)" },
};

export default function PainMapping({ data, onUpdate }) {
  const [markedAreas, setMarkedAreas] = useState(data.painAreas || []);
  const [painNarrative, setPainNarrative] = useState(data.pain_narrative || "");
  const [currentView, setCurrentView] = useState('front');
  const [currentSensation, setCurrentSensation] = useState({
    type: "Pain",
    intensity: 7,
    color: SENSATION_TYPES.Pain.color,
  });
  const [history, setHistory] = useState([]);

  // This effect ensures that the parent component's state is updated whenever our local state changes.
  useEffect(() => {
    onUpdate({ painAreas: markedAreas, pain_narrative: painNarrative });
  }, [markedAreas, painNarrative, onUpdate]);

  const addMarkedArea = (newArea) => {
    setHistory([...history, markedAreas]); // Save current state for undo
    setMarkedAreas([...markedAreas, newArea]);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setMarkedAreas(previousState);
      setHistory(history.slice(0, -1));
    }
  };

  const handleReset = () => {
    setHistory([...history, markedAreas]); // Allow undoing the reset
    setMarkedAreas([]);
  };
  
  const handleRemoveArea = (areaId) => {
    setHistory([...history, markedAreas]);
    setMarkedAreas(markedAreas.filter(area => area.id !== areaId));
  };

  return (
    <Card className="border-sage-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
            <Map className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-warm-gray-900">Symptom Mapping</CardTitle>
            <p className="text-warm-gray-600">Select a sensation, then click on the body chart to mark the areas where you feel it.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side: Body Chart */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-center gap-2 mb-2">
              <Button onClick={() => setCurrentView('front')} variant={currentView === 'front' ? 'default' : 'outline'} className="rounded-full">Front View</Button>
              <Button onClick={() => setCurrentView('back')} variant={currentView === 'back' ? 'default' : 'outline'} className="rounded-full">Back View</Button>
            </div>
            <div className="relative p-4 bg-warm-gray-50 dark:bg-warm-gray-800 rounded-xl border border-sage-200 dark:border-warm-gray-700">
              <InteractiveBodyChart
                view={currentView}
                markedAreas={markedAreas}
                currentSensation={currentSensation}
                onAreaDrawn={addMarkedArea}
                onAreaClick={handleRemoveArea}
              />
            </div>
          </div>

          {/* Right Side: Controls and Legend */}
          <div className="space-y-6">
            <SymptomControls
              sensationTypes={SENSATION_TYPES}
              currentSensation={currentSensation}
              onSensationChange={setCurrentSensation}
            />
             <div className="flex items-center gap-2">
                <Button onClick={handleUndo} variant="outline" size="sm" className="flex-1" disabled={history.length === 0}>
                  <Undo className="w-4 h-4 mr-2"/> Undo
                </Button>
                <Button onClick={handleReset} variant="destructive" size="sm" className="flex-1" disabled={markedAreas.length === 0}>
                  <RotateCcw className="w-4 h-4 mr-2"/> Reset All
                </Button>
                <HelpTooltip content="Click to draw a shape. Click again to add points. Double-click to finish. Click a finished shape to remove it."/>
              </div>
          </div>
        </div>

        {/* Bottom: Narrative Text Input */}
        <div className="space-y-2 pt-4 border-t border-sage-200 dark:border-warm-gray-700">
          <Label htmlFor="pain_narrative" className="font-medium text-lg">Describe Your Sensations</Label>
          <Textarea
            id="pain_narrative"
            value={painNarrative}
            onChange={(e) => setPainNarrative(e.target.value)}
            placeholder="In your own words, describe your pain and other sensations (e.g., 'A constant, dull ache in my lower right back that becomes sharp with bending. Also, tingling down my leg in the morning...')"
            rows={5}
            className="rounded-xl text-base"
          />
        </div>
      </CardContent>
    </Card>
  );
}