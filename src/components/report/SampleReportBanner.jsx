const HIDDEN_INSIGHT_TAGS = [
  'Salary benchmarks',
  'Skill gap analysis',
  'Career roadmap',
  'Relocation cost analysis',
];

function SampleReportBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-warning/30 mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 p-5">
      <div className="absolute -top-6 -right-6 w-28 h-28 bg-warning/10 rounded-full blur-2xl"></div>
      <div className="flex items-start gap-4 relative z-10">
        <div className="w-12 h-12 rounded-full bg-warning flex items-center justify-center shrink-0 shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-primary text-lg">Sample Report Preview</h4>
          <p className="text-sm text-gray-600 mt-1">
            This is a curated sample report matched to your industry profile. <span className="font-semibold text-warning">80% of detailed insights are hidden</span> — including full skill-gap analysis, salary tables, and personalized career roadmap.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {HIDDEN_INSIGHT_TAGS.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-primary shadow-sm border border-slate-200">
                <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SampleReportBanner;
