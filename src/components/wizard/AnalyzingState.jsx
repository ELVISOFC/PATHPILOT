import { useEffect, useState } from 'react';

function LoadingDots() {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return <span>{dots}</span>;
}

function AnalyzingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-slate-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-primary mb-2">Analyzing Your Profile</h3>
      <p className="text-secondary mb-6">Matching your skills against market data<LoadingDots /></p>
      <div className="w-64 bg-slate-200 rounded-full h-2 overflow-hidden">
        <div className="bg-accent h-full rounded-full animate-pulse" style={{ width: '75%' }}></div>
      </div>
    </div>
  );
}

export default AnalyzingState;
