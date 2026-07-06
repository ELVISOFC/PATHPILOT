function AppHeader() {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-primary tracking-tight">PathPilot</h1>
      </div>
      <p className="text-base text-secondary">Automated career trajectory &amp; market analysis</p>
    </div>
  );
}

export default AppHeader;
