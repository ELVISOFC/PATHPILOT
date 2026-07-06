function BasicsStep({ formData, onInputChange }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-3xl font-bold text-primary">Tell us the basics</h2>
        <p className="text-secondary mt-1">We use these to benchmark your current standing.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={onInputChange}
            className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
            placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Job Title</label>
          <input type="text" name="jobTitle" value={formData.jobTitle} onChange={onInputChange}
            className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
            placeholder="Senior Software Engineer" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry</label>
          <input type="text" name="industry" value={formData.industry} onChange={onInputChange}
            className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
            placeholder="Technology / Financial Services / Healthcare" />
        </div>
      </div>
    </div>
  );
}

export default BasicsStep;
