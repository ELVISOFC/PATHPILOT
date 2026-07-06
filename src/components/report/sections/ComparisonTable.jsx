function ComparisonTable({ section }) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-accent rounded-full inline-block shrink-0"></span>
        {section.title}
      </h3>
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-primary">
            <tr>
              {section.headers.map((header, i) => (
                <th key={i} className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white ${i === 0 ? '' : 'text-center'}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {section.rows.map((row, i) => (
              <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-colors`}>
                {row.map((cell, j) => {
                  const isMoney = cell.includes('+$') || cell.includes('-5');
                  const isNegative = cell.startsWith('-');
                  const isPositive = cell.startsWith('+');
                  return (
                    <td key={j} className={`px-5 py-3.5 text-sm ${
                      j === 0 ? 'font-semibold text-gray-900' : 'text-center text-gray-700'
                    } ${isMoney ? 'text-accent font-bold' : ''} ${
                      isNegative && !cell.includes('–') ? 'text-red-500' : ''
                    } ${isPositive ? 'text-green-600' : ''}`}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {section.insight && (
        <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-800"><span className="font-semibold">Insight:</span> {section.insight}</p>
        </div>
      )}
      {section.verdict && (
        <div className="mt-3 flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
          <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-emerald-800"><span className="font-semibold">Verdict:</span> {section.verdict}</p>
        </div>
      )}
      {section.best_value && (
        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3">
          <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <p className="text-sm text-amber-800"><span className="font-semibold">Best Value:</span> {section.best_value}</p>
        </div>
      )}
    </div>
  );
}

export default ComparisonTable;
