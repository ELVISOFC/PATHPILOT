const GAP_BADGE_COLORS = {
  none: 'bg-accent text-white',
  low: 'bg-green-500 text-white',
  medium: 'bg-warning text-primary',
};

const SKILL_GAP_COLORS = {
  none: 'text-emerald-600 bg-emerald-50',
  low: 'text-green-600 bg-green-50',
  medium: 'text-amber-600 bg-amber-50',
  high: 'text-orange-600 bg-orange-50',
  major: 'text-red-600 bg-red-50',
};

const SKILL_BAR_GRADIENTS = {
  none: 'linear-gradient(90deg, #00b894, #00d2a0)',
  low: 'linear-gradient(90deg, #00b894, #55efc4)',
  medium: 'linear-gradient(90deg, #fdcb6e, #f8a825)',
  high: 'linear-gradient(90deg, #f39c12, #e67e22)',
  major: 'linear-gradient(90deg, #e74c3c, #c0392b)',
};

const CATEGORY_BAR_COLORS = {
  none: 'bg-accent',
  low: 'bg-green-500',
  medium: 'bg-warning',
  high: 'bg-red-500',
};

function ResumeGapAnalysis({ resumeAnalysis }) {
  if (!resumeAnalysis || !resumeAnalysis.hasResume) return null;

  return (
    <div className="mt-10 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-primary">Resume Gap Analysis</h3>
          <p className="text-sm text-secondary">For: <span className="font-semibold text-gray-700">{resumeAnalysis.targetRole}</span> → <span className="text-accent font-semibold">{resumeAnalysis.targetNextRole}</span></p>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-primary to-slate-800 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300 uppercase tracking-wider font-semibold">Overall Match Score</p>
            <p className="text-4xl font-extrabold mt-1">{resumeAnalysis.overallScore}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-300">Gap Level</p>
            <span className={`inline-block mt-1 px-4 py-1.5 rounded-full text-sm font-bold ${GAP_BADGE_COLORS[resumeAnalysis.gap] || 'bg-red-500 text-white'}`}>
              {resumeAnalysis.gap.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Skill Categories */}
      <div className="space-y-6">
        {resumeAnalysis.categories.map((cat, ci) => (
          <div key={ci} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-primary text-base">{cat.category}</h4>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${CATEGORY_BAR_COLORS[cat.gap] || 'bg-red-500'}`} style={{ width: `${cat.overallScore}%` }}></div>
                </div>
                <span className="text-xs font-bold text-gray-500 w-10 text-right">{cat.overallScore}%</span>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {cat.skills.map((skill, si) => (
                <div key={si} className="flex items-center gap-3 py-1">
                  <span className="text-sm font-medium text-gray-700 w-1/3 shrink-0">{skill.name}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${skill.score}%`, background: SKILL_BAR_GRADIENTS[skill.gap] || SKILL_BAR_GRADIENTS.major }}>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-20 text-center shrink-0 ${SKILL_GAP_COLORS[skill.gap] || SKILL_GAP_COLORS.major}`}>
                    {skill.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Top Strengths */}
      {resumeAnalysis.topStrengths.length > 0 && (
        <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
          <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Top Strengths
          </h4>
          <div className="flex flex-wrap gap-2">
            {resumeAnalysis.topStrengths.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-700 shadow-sm border border-emerald-200">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top Gaps */}
      {resumeAnalysis.topGaps.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-5">
          <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Priority Gaps to Close
          </h4>
          <div className="flex flex-wrap gap-2">
            {resumeAnalysis.topGaps.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-red-700 shadow-sm border border-red-200">
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-6 bg-accent bg-opacity-5 border border-accent border-opacity-20 rounded-xl p-5">
        <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Actionable Recommendations
        </h4>
        <ul className="space-y-2">
          {resumeAnalysis.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ResumeGapAnalysis;
