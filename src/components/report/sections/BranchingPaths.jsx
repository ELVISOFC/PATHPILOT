function BranchingPaths({ section }) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-accent rounded-full inline-block shrink-0"></span>
        {section.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {section.paths.map((path, i) => (
          <div key={i} className="relative group bg-white rounded-xl border-2 border-slate-200 p-5 hover:border-accent hover:shadow-lg transition-all duration-300 cursor-default">
            <div className="absolute -top-3 left-4">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                Option {i + 1}
              </span>
            </div>
            <h4 className="font-bold text-primary mt-2 mb-1 text-base">{path.name}</h4>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {path.timeline}
            </div>
            <p className="text-sm font-semibold text-accent border-t border-slate-100 pt-3 mt-3">
              {path.salary_target}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BranchingPaths;
