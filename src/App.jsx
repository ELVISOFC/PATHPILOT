import AppHeader from './components/layout/AppHeader';
import StepIndicator from './components/layout/StepIndicator';
import BasicsStep from './components/wizard/BasicsStep';
import ExperienceStep from './components/wizard/ExperienceStep';
import GoalsStep from './components/wizard/GoalsStep';
import AnalyzingState from './components/wizard/AnalyzingState';
import WizardNavigation from './components/wizard/WizardNavigation';
import AnalysisReport from './components/report/AnalysisReport';
import { useWizardForm } from './hooks/useWizardForm';

function App() {
  const {
    currentStep,
    formData,
    report,
    isAnalyzing,
    handleInputChange,
    handleSelectChange,
    nextStep,
    prevStep,
    resetForm,
  } = useWizardForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <AppHeader />
        <StepIndicator currentStep={currentStep} />

        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100">
          <div className="p-8 sm:p-10">
            {currentStep === 1 && (
              <BasicsStep formData={formData} onInputChange={handleInputChange} />
            )}

            {currentStep === 2 && (
              <ExperienceStep formData={formData} onInputChange={handleInputChange} />
            )}

            {currentStep === 3 && (
              <GoalsStep
                formData={formData}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
              />
            )}

            {currentStep === 4 && isAnalyzing && <AnalyzingState />}

            {currentStep === 4 && !isAnalyzing && report && (
              <AnalysisReport report={report} />
            )}
          </div>

          <WizardNavigation
            currentStep={currentStep}
            isAnalyzing={isAnalyzing}
            canAdvance={Boolean(formData.location)}
            onBack={prevStep}
            onNext={nextStep}
            onReset={resetForm}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-secondary">
          <span className="font-semibold text-primary">PathPilot</span> &mdash; Automated Career Trajectory Analysis
        </div>
      </div>
    </div>
  );
}

export default App;
