import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SymptomControls({ sensationTypes, currentSensation, onSensationChange }) {
  const handleTypeChange = (type) => {
    onSensationChange({
      ...currentSensation,
      type,
      color: sensationTypes[type].color,
    });
  };

  const handleIntensityChange = (value) => {
    onSensationChange({
      ...currentSensation,
      intensity: value[0],
    });
  };

  return (
    <div className="space-y-6 p-4 border rounded-xl bg-white dark:bg-warm-gray-800 border-sage-200 dark:border-warm-gray-700">
      <div>
        <Label className="font-medium text-base mb-3 block">1. Select Sensation Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(sensationTypes).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={cn(
                "p-2 text-sm rounded-lg border text-center transition-all duration-200",
                currentSensation.type === type
                  ? 'border-2 font-semibold shadow-md'
                  : 'hover:shadow-sm'
              )}
              style={{
                borderColor: currentSensation.type === type ? sensationTypes[type].color : 'var(--sage-200)',
                backgroundColor: currentSensation.type === type ? `${sensationTypes[type].color}20` : 'transparent',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="intensity-slider" className="font-medium text-base mb-3 block">2. Set Intensity</Label>
        <div className="flex items-center gap-4">
          <Slider
            id="intensity-slider"
            min={0}
            max={10}
            step={1}
            value={[currentSensation.intensity]}
            onValueChange={handleIntensityChange}
            style={{ '--slider-thumb-color': currentSensation.color }}
            className="[&>span:first-child]:bg-[var(--slider-thumb-color)]"
          />
          <Badge 
            variant="outline" 
            className="text-lg w-12 h-12 flex items-center justify-center rounded-full" 
            style={{ borderColor: currentSensation.color, color: currentSensation.color }}
          >
            {currentSensation.intensity}
          </Badge>
        </div>
        <div className="flex justify-between text-xs text-warm-gray-500 mt-1">
          <span>No Sensation</span>
          <span>Worst Imaginable</span>
        </div>
      </div>
      
      <div>
        <Label className="font-medium text-base mb-3 block">Legend</Label>
        <div className="space-y-1">
          {Object.entries(sensationTypes).map(([type, { color }]) => (
            <div key={type} className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}