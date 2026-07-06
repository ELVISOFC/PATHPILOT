function ReportHeader({ report }) {
  return (
    <div className="text-center mb-8 pb-8 border-b border-slate-200">
      <div className="inline-flex items-center gap-2 bg-accent bg-opacity-10 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-4">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Report Ready
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-primary">{report.title}</h2>
      <div className="flex items-center justify-center gap-6 mt-3 text-sm text-secondary flex-wrap">
        {report.userName && <span>For: <span className="font-semibold text-gray-700">{report.userName}</span></span>}
        {report.industry && <span>Industry: <span className="font-semibold text-gray-700">{report.industry}</span></span>}
        <span className="bg-slate-100 text-gray-500 px-3 py-1 rounded-full text-xs">{report.report_id}</span>
      </div>
    </div>
  );
}

export default ReportHeader;
