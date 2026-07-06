function TreeDiagram({ section }) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-warning rounded-full inline-block shrink-0"></span>
        {section.title}
      </h3>
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        {section.nodes.map((node, i) => (
          <div key={i}>
            <div className="text-center mb-6">
              <span className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-md text-lg">
                {node.current}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {node.branches.map((branch, j) => (
                <div key={j} className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:shadow-md transition-shadow">
                  <div className="text-xs text-gray-400 mb-1">{branch.timeline}</div>
                  <div className="font-bold text-primary mb-1">{branch.path}</div>
                  <div className="w-8 h-0.5 bg-accent mx-auto my-2"></div>
                  {branch.next && (
                    <div className="text-xs text-gray-500 mt-2">
                      <span className="text-gray-400">→</span> {branch.next.path} <span className="text-gray-400">({branch.next.timeline})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TreeDiagram;
