function WizardNavigation({ currentStep, isAnalyzing, canAdvance, onBack, onNext, onReset }) {
  return (
    <div className="px-8 sm:px-10 pb-8 sm:pb-10 flex items-center justify-between">
      {currentStep > 1 && currentStep < 4 && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-gray-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}
      {currentStep < 4 && (
        <button
          onClick={onNext}
          disabled={currentStep === 3 && !canAdvance}
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md ${
            currentStep === 3 && !canAdvance
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-accent text-white hover:bg-accent/90 hover:shadow-lg'
          } ml-auto`}
        >
          {currentStep === 3 ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Generate Analysis
            </>
          ) : (
            <>
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      )}
      {currentStep === 4 && !isAnalyzing && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md ml-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Run New Analysis
        </button>
      )}
    </div>
  );
}

export default WizardNavigation;
