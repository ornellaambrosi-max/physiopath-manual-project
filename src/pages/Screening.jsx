
import React, { useState } from "react";
import { Patient, ScreeningAssessment } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Heart, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import PersonalInfo from "../components/screening/PersonalInfo";
import SymptomAssessment from "../components/screening/SymptomAssessment";
import PainMapping from "../components/screening/PainMapping";
import FunctionalAssessment from "../components/screening/FunctionalAssessment";
import ValidatedScales from "../components/screening/ValidatedScales";
import RedFlagScreen from "../components/screening/RedFlagScreen";
import Results from "../components/screening/Results";

export default function Screening() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [screeningData, setScreeningData] = useState({
    personalInfo: {},
    symptoms: {},
    painAreas: [],
    functional: {},
    scales: {},
    redFlags: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  const steps = [
    { id: 1, title: "Personal Information", component: PersonalInfo, dataKey: 'personalInfo' },
    { id: 2, title: "Symptom Assessment", component: SymptomAssessment, dataKey: 'symptoms' },
    { id: 3, title: "Pain Mapping", component: PainMapping, dataKey: 'painAreas' },
    { id: 4, title: "Your Story & Goals", component: FunctionalAssessment, dataKey: 'functional' },
    { id: 5, title: "Clinical Questionnaires", component: ValidatedScales, dataKey: 'scales' },
    { id: 6, title: "Safety Check", component: RedFlagScreen, dataKey: 'redFlags' },
    { id: 7, title: "Results", component: Results, dataKey: null }
  ];

  const totalSteps = steps.filter(s => s.id !== 7).length; // Don't count results step in progress
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) { // Allow going to results step
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateScreeningData = (stepData, stepName) => {
    setScreeningData(prev => ({
      ...prev,
      [stepName]: stepData
    }));
  };

  const handleSubmitScreening = async () => {
    setIsSubmitting(true);
    try {
      // Create or update patient record
      const patientRecord = await Patient.create(screeningData.personalInfo);

      const recommendedPathway = determineRecommendedPathway();
      const riskLevel = determineRiskLevel();

      // Create screening assessment
      const assessmentData = {
        patient_id: patientRecord.id,
        problem_type: screeningData.symptoms.problem_type,
        primary_complaint: screeningData.symptoms.primaryComplaint,
        symptom_onset: screeningData.symptoms.symptom_onset,
        symptom_duration: screeningData.symptoms.duration,
        aggravating_factors: screeningData.symptoms.aggravating_factors,
        relieving_factors: screeningData.symptoms.relieving_factors,
        pain_areas: screeningData.painAreas,
        patient_narrative: screeningData.functional.patient_narrative,
        functional_goals: screeningData.functional.goals,
        impact_on_life: screeningData.functional.impact_on_life,
        support_system: screeningData.functional.support_system,
        red_flags: screeningData.redFlags,
        psfs_items: screeningData.scales.psfs_items,
        // TODO: Calculate scores from responses (placeholder for now)
        mini_fabq_score: 0, 
        mood_phq_score: 0,
        recommended_pathway: recommendedPathway,
        risk_level: riskLevel,
        assessment_notes: `Screening completed. Pathway: ${recommendedPathway}. Risk: ${riskLevel}.`
      };

      const assessment = await ScreeningAssessment.create(assessmentData);

      // Update patient with final care pathway
      await Patient.update(patientRecord.id, {
        care_pathway: recommendedPathway,
        screening_completed: true,
      });
      
      const generatedResults = {
        recommendedPathway,
        riskLevel,
        summary: generateResultsSummary({ recommended_pathway: recommendedPathway }),
        recommendations: generateRecommendations({ red_flags: screeningData.redFlags })
      };

      setResults(generatedResults);
      setCurrentStep(7); // Move to results step

    } catch (error) {
      console.error("Error submitting screening:", error);
    }
    setIsSubmitting(false);
  };

  const determineRecommendedPathway = () => {
    const hasRedFlags = Object.values(screeningData.redFlags).some(v => v === true);
    if (hasRedFlags) return 'urgent_medical_assessment';
    
    // Simplified logic, would be more complex in reality
    const painWorst = Math.max(...(screeningData.painAreas.map(area => area.pain_level_worst) || [0]));
    if (painWorst >= 7) return 'personalized_care';
    if (painWorst >= 4) return 'standardized_program';

    return 'self_management';
  };

  const determineRiskLevel = () => {
    const hasRedFlags = Object.values(screeningData.redFlags).some(v => v === true);
    if (hasRedFlags) return 'urgent';
    
    const painWorst = Math.max(...(screeningData.painAreas.map(area => area.pain_level_worst) || [0]));
    if (painWorst >= 8) return 'high';
    if (painWorst >= 5) return 'medium';

    return 'low';
  };
  
  const generateResultsSummary = ({ recommended_pathway }) => {
    const summaries = {
      urgent_medical_assessment: "Your answers suggest that you should seek an urgent medical assessment from a doctor or hospital to rule out any serious conditions.",
      personalized_care: "You would benefit most from a personalized physiotherapy program, tailored specifically to your unique symptoms, goals, and lifestyle.",
      standardized_program: "A structured, evidence-based exercise program would be a great starting point to manage your condition and improve your function.",
      self_management: "Your symptoms appear manageable with self-care. We recommend our educational resources and gentle exercise guides."
    };
    return summaries[recommended_pathway] || "";
  };
  
  const generateRecommendations = ({ red_flags }) => {
    const hasRedFlags = Object.values(red_flags).some(v => v === true);
    if (hasRedFlags) {
        return ["Seek immediate consultation with a doctor or go to an emergency department.", "Do not begin an exercise program until cleared by a medical professional.", "Bring a summary of these results to your appointment."];
    }
    return ["Begin with gentle movement and activity modification as tolerated.", "Focus on understanding your pain triggers and what brings relief.", "Gradually increase your activity levels within a comfortable range."];
  };

  const getCurrentComponent = () => {
    const step = steps.find(s => s.id === currentStep);
    if (!step) return null;

    const Component = step.component;
    return (
      <Component
        // For Results step, pass the full screeningData object as context if needed.
        // For other steps, pass the specific slice of data identified by dataKey.
        data={currentStep === 7 ? screeningData : (step.dataKey ? screeningData[step.dataKey] : {})}
        onUpdate={(stepData) => updateScreeningData(stepData, step.dataKey)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={currentStep === 6 ? handleSubmitScreening : null}
        isSubmitting={isSubmitting}
        results={currentStep === 7 ? results : null} // Only pass results when on the results step
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-warm-gray-900">
              Health Assessment
            </h1>
            <p className="text-warm-gray-600 mt-1">
              A comprehensive evaluation to personalize your care journey
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {currentStep < 7 &&
          <Card className="border-sage-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-warm-gray-900">
                    Step {currentStep} of {totalSteps}
                  </span>
                </div>
                <span className="text-sm text-warm-gray-600">
                  {Math.round(progressPercentage)}% complete
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2 mb-4" />
              <p className="text-sm font-medium text-warm-gray-700">
                {steps[currentStep - 1]?.title}
              </p>
            </CardContent>
          </Card>
        }
      </div>

      {/* Current Step Component */}
      <div className="mb-8">
        {getCurrentComponent()}
      </div>

      {/* Navigation */}
      {currentStep < 7 && (
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm sticky bottom-0 py-4 px-6 -mx-6 border-t border-sage-200">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="rounded-xl px-6 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-warm-gray-600">Step {currentStep} of {totalSteps}</p>
            <p className="font-medium">{steps[currentStep - 1]?.title}</p>
          </div>

          <Button
            onClick={currentStep === 6 ? handleSubmitScreening : handleNext}
            disabled={isSubmitting}
            className="bg-sage-600 hover:bg-sage-700 rounded-xl px-6 py-2"
          >
            {isSubmitting ? (
              "Processing..."
            ) : currentStep === 6 ? (
              "Complete Assessment"
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
