function SkillGaps({ section }) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-warning rounded-full inline-block shrink-0"></span>
        {section.title}
      </h3>
      <div className="space-y-3">
        {section.skills.map((skill, i) => {
          const maxLevel = skill.required || skill.required_sr || 5;
          const currentLevel = skill.level;
          const gapText = skill.gap || skill.gap_sr || 'none';
          const gapColor = gapText === 'none' ? 'text-emerald-600 bg-emerald-50' :
                           gapText === 'low' ? 'text-green-600 bg-green-50' :
                           gapText === 'medium' ? 'text-amber-600 bg-amber-50' :
                           gapText === 'high' ? 'text-orange-600 bg-orange-50' :
                           'text-red-600 bg-red-50';
          const barGradient = gapText === 'none' ? 'linear-gradient(90deg, #00b894, #00d2a0)' :
                              gapText === 'low' ? 'linear-gradient(90deg, #00b894, #55efc4)' :
                              gapText === 'medium' ? 'linear-gradient(90deg, #fdcb6e, #f8a825)' :
                              gapText === 'high' ? 'linear-gradient(90deg, #f39c12, #e67e22)' :
                              'linear-gradient(90deg, #e74c3c, #c0392b)';
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 text-sm">{skill.name}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${gapColor}`}>
                  {gapText === 'none' ? '✓ Met' : gapText.charAt(0).toUpperCase() + gapText.slice(1) + ' Gap'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 font-medium w-16 shrink-0">You: {currentLevel}/{maxLevel}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(currentLevel / maxLevel) * 100}%`, background: barGradient }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 font-medium w-16 shrink-0 text-right">Need: {maxLevel}/{maxLevel}</span>
              </div>
              {skill.gap_sr && skill.gap_gp && (
                <div className="mt-2 flex gap-3 text-xs text-gray-500">
                  <span className={`px-2 py-0.5 rounded ${skill.gap_sr === 'none' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    Sr. PM gap: {skill.gap_sr}
                  </span>
                  <span className={`px-2 py-0.5 rounded ${skill.gap_gp === 'none' ? 'bg-emerald-50 text-emerald-600' : skill.gap_gp === 'major' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                    Group PM gap: {skill.gap_gp}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {section.actions && section.actions.length > 0 && (
        <div className="mt-4 bg-accent bg-opacity-5 border border-accent border-opacity-20 rounded-xl p-4">
          <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Recommended Actions
          </h4>
          <ul className="space-y-2">
            {section.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
      {section.top_recommendation && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <p className="text-sm text-amber-900"><span className="font-bold">Top Recommendation:</span> {section.top_recommendation}</p>
        </div>
      )}
      {section.recommendation && (
        <div className="mt-3 bg-accent bg-opacity-5 border border-accent border-opacity-20 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl shrink-0">🎯</span>
          <p className="text-sm text-gray-700">{section.recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default SkillGaps;
