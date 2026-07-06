import { useState } from 'react';
import { generateReport } from '../engine/analysisEngine';
import { analyzeResume } from '../engine/resumeAnalyzer';

const INITIAL_FORM_DATA = {
  name: '',
  jobTitle: '',
  industry: '',
  experience: '',
  skills: '',
  resumeText: '',
  location: '',
  targetSalary: '',
  goalType: 'growth',
};

// Simulated analysis delay so the loading state has time to register.
const ANALYSIS_DELAY_MS = 2500;

/**
 * Owns all wizard state: current step, form data, the generated report,
 * and the analyzing/loading flag. Returns handlers the step components
 * and navigation bind to directly.
 */
export function useWizardForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [report, setReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep === 3) {
      setIsAnalyzing(true);
      setTimeout(() => {
        const generatedReport = generateReport(formData);
        const resumeAnalysis = analyzeResume(formData);
        setReport({ ...generatedReport, resumeAnalysis });
        setIsAnalyzing(false);
        setCurrentStep(4);
      }, ANALYSIS_DELAY_MS);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const resetForm = () => {
    setCurrentStep(1);
    setReport(null);
    setFormData(INITIAL_FORM_DATA);
  };

  return {
    currentStep,
    formData,
    report,
    isAnalyzing,
    handleInputChange,
    handleSelectChange,
    nextStep,
    prevStep,
    resetForm,
  };
}
