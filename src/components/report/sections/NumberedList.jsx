function NumberedList({ section }) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-accent rounded-full inline-block shrink-0"></span>
        {section.title}
      </h3>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {section.items.map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
            <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
            <p className="text-sm text-gray-700 pt-1.5">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NumberedList;
