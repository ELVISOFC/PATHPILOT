function ExperienceStep({ formData, onInputChange }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-3xl font-bold text-primary">Your Experience &amp; Skills</h2>
        <p className="text-secondary mt-1">Help us identify your unique market value.</p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience Summary</label>
          <textarea name="experience" rows={4} value={formData.experience} onChange={onInputChange}
            className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none resize-none"
            placeholder="Briefly describe your career path, years of experience, and key achievements..." />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Key Skills <span className="text-gray-400 font-normal">(comma separated)</span></label>
          <input type="text" name="skills" value={formData.skills} onChange={onInputChange}
            className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
            placeholder="e.g. System Design, Python, SQL, Leadership, Product Strategy" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resume / Profile Summary <span className="text-gray-400 font-normal">(paste your resume or LinkedIn summary for skill gap analysis)</span></label>
          <textarea name="resumeText" rows={6} value={formData.resumeText} onChange={onInputChange}
            className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none resize-none"
            placeholder="Paste your resume, LinkedIn profile, or career summary here. Our AI will scan it against industry role requirements to find skill gaps..." />
          <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Optional — enables detailed Resume Gap Analysis in your report
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExperienceStep;
