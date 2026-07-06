import { steps } from '../../wizardSteps';

function StepIndicator({ currentStep }) {
  return (
    <nav aria-label="Progress" className="mb-10">
      <ol role="list" className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, idx) => (
          <li key={step.id} className="relative flex flex-col items-center flex-1">
            <div className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-500 shadow-sm ${
              currentStep >= step.id
                ? 'border-accent bg-accent text-white shadow-accent/30'
                : 'border-gray-300 bg-white text-gray-400'
            }`}>
              {currentStep > step.id ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span className={`mt-2 text-xs font-semibold tracking-wide ${currentStep >= step.id ? 'text-accent' : 'text-gray-400'}`}>
              {step.title}
            </span>
            {idx < steps.length - 1 && (
              <div className={`absolute top-5 left-[calc(50%+1.5rem)] w-[calc(100%-3rem)] h-0.5 -z-10 transition-colors duration-500 ${currentStep > step.id ? 'bg-accent' : 'bg-gray-200'}`}></div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default StepIndicator;
