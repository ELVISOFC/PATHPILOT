function Certifications({ section }) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-warning rounded-full inline-block shrink-0"></span>
        {section.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {section.rows.map((row, i) => (
          <div key={i} className="bg-white rounded-xl border-2 border-slate-200 p-5 hover:border-accent hover:shadow-lg transition-all duration-300">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">{row[0]}</div>
            <div className="flex justify-between text-sm mt-3">
              <span className="text-gray-500">Cost:</span>
              <span className="font-semibold text-gray-900">{row[1]}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Time:</span>
              <span className="font-semibold text-gray-900">{row[2]}</span>
            </div>
            <div className="flex justify-between text-sm mt-1 pt-2 border-t border-slate-100">
              <span className="text-gray-500">Impact:</span>
              <span className="font-semibold text-accent">{row[3]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Certifications;
