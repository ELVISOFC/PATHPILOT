function GoalsStep({ formData, onInputChange, onSelectChange }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-3xl font-bold text-primary">Your Goals &amp; Target</h2>
        <p className="text-secondary mt-1">Where do you want to take your career?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Location</label>
          <input type="text" name="location" value={formData.location} onChange={onInputChange}
            className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
            placeholder="e.g. San Francisco, CA or Austin, TX" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Salary</label>
          <input type="text" name="targetSalary" value={formData.targetSalary} onChange={onInputChange}
            className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
            placeholder="e.g. $170,000" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Goal</label>
          <select name="goalType" value={formData.goalType} onChange={onSelectChange}
            className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none bg-white">
            <option value="growth">Career Growth / Promotion</option>
            <option value="pivot">Industry / Role Pivot</option>
            <option value="relocate">Relocation Analysis</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default GoalsStep;
