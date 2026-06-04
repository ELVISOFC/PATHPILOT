import React, { useState } from 'react';
import { generateReport } from './engine/analysisEngine';
import { purchaseFullReport, purchaseSubscription, getStripe, PAYMENT_LINKS } from './stripe/stripeConfig';
import { analyzeResume } from './engine/resumeAnalyzer';

const steps = [
  { id: 1, title: 'Basics', description: 'Who you are' },
  { id: 2, title: 'Experience', description: 'What you do' },
  { id: 3, title: 'Goals', description: 'Where you are going' },
  { id: 4, title: 'Analysis', description: 'Your PathPilot Report' },
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    industry: '',
    experience: '',
    skills: '',
    resumeText: '',
    location: '',
    targetSalary: '',
    goalType: 'growth',
  });
  const [report, setReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep === 3) {
      setIsAnalyzing(true);
      setTimeout(() => {
        const generatedReport = generateReport(formData);
        const resumeAnalysis = analyzeResume(formData);
        setReport({ ...generatedReport, resumeAnalysis });
        setIsAnalyzing(false);
        setCurrentStep(4);
      }, 2500);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const resetForm = () => {
    setCurrentStep(1);
    setReport(null);
    setFormData({
      name: '',
      jobTitle: '',
      industry: '',
      experience: '',
      skills: '',
      resumeText: '',
      location: '',
      targetSalary: '',
      goalType: 'growth',
    });
  };

  // ── LOADING DOTS ─────────────────────────────────────────────

  function LoadingDots() {
    const [dots, setDots] = useState('');
    React.useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }, []);
    return <span>{dots}</span>;
  }

  // ── SECTION RENDERERS ────────────────────────────────────────

  const renderSection = (section) => {
    switch (section.type) {
      case 'comparison_table':
      case 'single_table':
        return (
          <div key={section.id} className="mb-10 last:mb-0">
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

      case 'skill_gaps':
        return (
          <div key={section.id} className="mb-10 last:mb-0">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-warning rounded-full inline-block shrink-0"></span>
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.skills.map((skill, i) => {
                const maxLevel = skill.required || skill.required_sr || 5;
                const currentLevel = skill.level;
                const gapText = skill.gap || skill.gap_sr || 'none';
                const gapColor = gapText === 'none' ? 'text-emerald-600 bg-emerald-50' :
                                 gapText === 'low' ? 'text-green-600 bg-green-50' :
                                 gapText === 'medium' ? 'text-amber-600 bg-amber-50' :
                                 gapText === 'high' ? 'text-orange-600 bg-orange-50' :
                                 'text-red-600 bg-red-50';
                const barGradient = gapText === 'none' ? 'linear-gradient(90deg, #00b894, #00d2a0)' :
                                    gapText === 'low' ? 'linear-gradient(90deg, #00b894, #55efc4)' :
                                    gapText === 'medium' ? 'linear-gradient(90deg, #fdcb6e, #f8a825)' :
                                    gapText === 'high' ? 'linear-gradient(90deg, #f39c12, #e67e22)' :
                                    'linear-gradient(90deg, #e74c3c, #c0392b)';
                return (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 text-sm">{skill.name}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${gapColor}`}>
                        {gapText === 'none' ? '✓ Met' : gapText.charAt(0).toUpperCase() + gapText.slice(1) + ' Gap'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-medium w-16 shrink-0">You: {currentLevel}/{maxLevel}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${(currentLevel / maxLevel) * 100}%`, background: barGradient }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 font-medium w-16 shrink-0 text-right">Need: {maxLevel}/{maxLevel}</span>
                    </div>
                    {skill.gap_sr && skill.gap_gp && (
                      <div className="mt-2 flex gap-3 text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded ${skill.gap_sr === 'none' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          Sr. PM gap: {skill.gap_sr}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${skill.gap_gp === 'none' ? 'bg-emerald-50 text-emerald-600' : skill.gap_gp === 'major' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          Group PM gap: {skill.gap_gp}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {section.actions && section.actions.length > 0 && (
              <div className="mt-4 bg-accent bg-opacity-5 border border-accent border-opacity-20 rounded-xl p-4">
                <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  Recommended Actions
                </h4>
                <ul className="space-y-2">
                  {section.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {section.top_recommendation && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl shrink-0">💡</span>
                <p className="text-sm text-amber-900"><span className="font-bold">Top Recommendation:</span> {section.top_recommendation}</p>
              </div>
            )}
            {section.recommendation && (
              <div className="mt-3 bg-accent bg-opacity-5 border border-accent border-opacity-20 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl shrink-0">🎯</span>
                <p className="text-sm text-gray-700">{section.recommendation}</p>
              </div>
            )}
          </div>
        );

      case 'branching_paths':
        return (
          <div key={section.id} className="mb-10 last:mb-0">
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

      case 'tree_diagram':
        return (
          <div key={section.id} className="mb-10 last:mb-0">
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

      case 'numbered_list':
        return (
          <div key={section.id} className="mb-10 last:mb-0">
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

      case 'certifications':
        return (
          <div key={section.id} className="mb-10 last:mb-0">
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

      default:
        return null;
    }
  };

  // ── MAIN RENDER ──────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
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

        {/* Stepper */}
        <nav aria-label="Progress" className="mb-10">
          <ol role="list" className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, idx) => (
              <li key={step.id} className="relative flex flex-col items-center flex-1">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-500 shadow-sm ${
                  currentStep >= step.id
                    ? 'border-accent bg-accent text-white shadow-accent/30'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span className={`mt-2 text-xs font-semibold tracking-wide ${currentStep >= step.id ? 'text-accent' : 'text-gray-400'}`}>
                  {step.title}
                </span>
                {idx < steps.length - 1 && (
                  <div className={`absolute top-5 left-[calc(50%+1.5rem)] w-[calc(100%-3rem)] h-0.5 -z-10 transition-colors duration-500 ${currentStep > step.id ? 'bg-accent' : 'bg-gray-200'}`}></div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100">
          <div className="p-8 sm:p-10">

            {/* ── STEP 1: BASICS ──────────────────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-slate-200 pb-5">
                  <h2 className="text-3xl font-bold text-primary">Tell us the basics</h2>
                  <p className="text-secondary mt-1">We use these to benchmark your current standing.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                      className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
                      placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Job Title</label>
                    <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange}
                      className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
                      placeholder="Senior Software Engineer" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry</label>
                    <input type="text" name="industry" value={formData.industry} onChange={handleInputChange}
                      className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
                      placeholder="Technology / Financial Services / Healthcare" />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: EXPERIENCE ──────────────────────────── */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-slate-200 pb-5">
                  <h2 className="text-3xl font-bold text-primary">Your Experience &amp; Skills</h2>
                  <p className="text-secondary mt-1">Help us identify your unique market value.</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience Summary</label>
                    <textarea name="experience" rows={4} value={formData.experience} onChange={handleInputChange}
                      className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none resize-none"
                      placeholder="Briefly describe your career path, years of experience, and key achievements..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Key Skills <span className="text-gray-400 font-normal">(comma separated)</span></label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleInputChange}
                      className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
                      placeholder="e.g. System Design, Python, SQL, Leadership, Product Strategy" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resume / Profile Summary <span className="text-gray-400 font-normal">(paste your resume or LinkedIn summary for skill gap analysis)</span></label>
                    <textarea name="resumeText" rows={6} value={formData.resumeText} onChange={handleInputChange}
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
            )}

            {/* ── STEP 3: GOALS ───────────────────────────────── */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-slate-200 pb-5">
                  <h2 className="text-3xl font-bold text-primary">Your Goals &amp; Target</h2>
                  <p className="text-secondary mt-1">Where do you want to take your career?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                      className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
                      placeholder="e.g. San Francisco, CA or Austin, TX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Salary</label>
                    <input type="text" name="targetSalary" value={formData.targetSalary} onChange={handleInputChange}
                      className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none"
                      placeholder="e.g. $170,000" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Goal</label>
                    <select name="goalType" value={formData.goalType} onChange={handleSelectChange}
                      className="block w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-4 transition-all outline-none bg-white">
                      <option value="growth">Career Growth / Promotion</option>
                      <option value="pivot">Industry / Role Pivot</option>
                      <option value="relocate">Relocation Analysis</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── ANALYSIS LOADING STATE ───────────────────────── */}
            {currentStep === 4 && isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-slate-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-24 h-24 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Analyzing Your Profile</h3>
                <p className="text-secondary mb-6">Matching your skills against market data<LoadingDots /></p>
                <div className="w-64 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-accent h-full rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div>
            )}

            {/* ── STEP 4: REPORT ──────────────────────────────── */}
            {currentStep === 4 && !isAnalyzing && report && (
              <div className="animate-fadeIn">
                {/* Report Header */}
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

                {/* ── SAMPLE REPORT OVERLAY ────────────────────── */}
                {report.customized && (
                  <div className="relative overflow-hidden rounded-2xl border-2 border-warning/30 mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 p-5">
                    <div className="absolute -top-6 -right-6 w-28 h-28 bg-warning/10 rounded-full blur-2xl"></div>
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-warning flex items-center justify-center shrink-0 shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-primary text-lg">Sample Report Preview</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          This is a curated sample report matched to your industry profile. <span className="font-semibold text-warning">80% of detailed insights are hidden</span> — including full skill-gap analysis, salary tables, and personalized career roadmap.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-primary shadow-sm border border-slate-200">
                            <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Salary benchmarks
                          </span>
                          <span className="inline-flex items-center gap-1 bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-primary shadow-sm border border-slate-200">
                            <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Skill gap analysis
                          </span>
                          <span className="inline-flex items-center gap-1 bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-primary shadow-sm border border-slate-200">
                            <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Career roadmap
                          </span>
                          <span className="inline-flex items-center gap-1 bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-primary shadow-sm border border-slate-200">
                            <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Relocation cost analysis
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Report Sections */}
                <div className="space-y-2">
                  {report.sections.map(section => renderSection(section))}
                </div>

                {/* ── RESUME GAP ANALYSIS ──────────────────────── */}
                {report.resumeAnalysis && report.resumeAnalysis.hasResume && (
                  <div className="mt-10 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary">Resume Gap Analysis</h3>
                        <p className="text-sm text-secondary">For: <span className="font-semibold text-gray-700">{report.resumeAnalysis.targetRole}</span> → <span className="text-accent font-semibold">{report.resumeAnalysis.targetNextRole}</span></p>
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div className="bg-gradient-to-r from-primary to-slate-800 rounded-2xl p-6 text-white mb-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-300 uppercase tracking-wider font-semibold">Overall Match Score</p>
                          <p className="text-4xl font-extrabold mt-1">{report.resumeAnalysis.overallScore}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-300">Gap Level</p>
                          <span className={`inline-block mt-1 px-4 py-1.5 rounded-full text-sm font-bold ${
                            report.resumeAnalysis.gap === 'none' ? 'bg-accent text-white' :
                            report.resumeAnalysis.gap === 'low' ? 'bg-green-500 text-white' :
                            report.resumeAnalysis.gap === 'medium' ? 'bg-warning text-primary' :
                            'bg-red-500 text-white'
                          }`}>
                            {report.resumeAnalysis.gap.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skill Categories */}
                    <div className="space-y-6">
                      {report.resumeAnalysis.categories.map((cat, ci) => (
                        <div key={ci} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                            <h4 className="font-bold text-primary text-base">{cat.category}</h4>
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div className={`h-full rounded-full ${
                                  cat.gap === 'none' ? 'bg-accent' :
                                  cat.gap === 'low' ? 'bg-green-500' :
                                  cat.gap === 'medium' ? 'bg-warning' : 'bg-red-500'
                                }`} style={{ width: `${cat.overallScore}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-gray-500 w-10 text-right">{cat.overallScore}%</span>
                            </div>
                          </div>
                          <div className="p-5 space-y-3">
                            {cat.skills.map((skill, si) => {
                              const gapColors = {
                                none: 'text-emerald-600 bg-emerald-50',
                                low: 'text-green-600 bg-green-50',
                                medium: 'text-amber-600 bg-amber-50',
                                high: 'text-orange-600 bg-orange-50',
                                major: 'text-red-600 bg-red-50'
                              };
                              const barGradients = {
                                none: 'linear-gradient(90deg, #00b894, #00d2a0)',
                                low: 'linear-gradient(90deg, #00b894, #55efc4)',
                                medium: 'linear-gradient(90deg, #fdcb6e, #f8a825)',
                                high: 'linear-gradient(90deg, #f39c12, #e67e22)',
                                major: 'linear-gradient(90deg, #e74c3c, #c0392b)'
                              };
                              return (
                                <div key={si} className="flex items-center gap-3 py-1">
                                  <span className="text-sm font-medium text-gray-700 w-1/3 shrink-0">{skill.name}</span>
                                  <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="h-full rounded-full transition-all"
                                      style={{ width: `${skill.score}%`, background: barGradients[skill.gap] || barGradients.major }}>
                                    </div>
                                  </div>
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-20 text-center shrink-0 ${gapColors[skill.gap] || gapColors.major}`}>
                                    {skill.score}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Top Strengths */}
                    {report.resumeAnalysis.topStrengths.length > 0 && (
                      <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                        <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Top Strengths
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {report.resumeAnalysis.topStrengths.map((s, i) => (
                            <span key={i} className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-700 shadow-sm border border-emerald-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Top Gaps */}
                    {report.resumeAnalysis.topGaps.length > 0 && (
                      <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-5">
                        <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Priority Gaps to Close
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {report.resumeAnalysis.topGaps.map((s, i) => (
                            <span key={i} className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-red-700 shadow-sm border border-red-200">
                              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div className="mt-6 bg-accent bg-opacity-5 border border-accent border-opacity-20 rounded-xl p-5">
                      <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Actionable Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {report.resumeAnalysis.recommendations.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* ── CONVERSION CTAs ──────────────────────────── */}
                <div className="mt-10 pt-8 border-t border-slate-200">
                  {/* Generated By */}
                  <div className="text-center mb-8">
                    <p className="text-xs text-secondary">
                      Generated by <span className="font-semibold text-primary">PathPilot</span> &mdash; $15 automated career analysis
                    </p>
                  </div>

                  {/* Payment CTAs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
                    {/* One-Time Report */}
                    <div className="group relative bg-white rounded-2xl border-2 border-accent/20 p-6 hover:border-accent hover:shadow-xl transition-all duration-300 text-center">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-accent text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">Most Popular</span>
                      </div>
                      <div className="mt-3">
                        <div className="text-4xl font-extrabold text-primary">$15</div>
                        <p className="text-sm text-secondary mt-1">one-time</p>
                      </div>
                      <h4 className="font-bold text-primary text-lg mt-4">Full Career Report</h4>
                      <ul className="mt-3 space-y-2 text-left">
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Complete salary benchmarking
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Full skill gap analysis
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Career trajectory map
                        </li>
                      </ul>
                      <button
                        onClick={purchaseFullReport}
                        className="mt-5 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 hover:shadow-lg transition-all shadow-md cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Upgrade to Full Report — $15
                      </button>
                    </div>

                    {/* Subscription */}
                    <div className="relative bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-primary hover:shadow-xl transition-all duration-300 text-center">
                      <div className="mt-3">
                        <div className="text-4xl font-extrabold text-primary">$9</div>
                        <p className="text-sm text-secondary mt-1">per month</p>
                      </div>
                      <h4 className="font-bold text-primary text-lg mt-4">Ongoing Monitoring</h4>
                      <ul className="mt-3 space-y-2 text-left">
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Monthly market updates
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Skill-gap alerts
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Salary trend tracking
                        </li>
                      </ul>
                      <button
                        onClick={purchaseSubscription}
                        className="mt-5 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 hover:shadow-lg transition-all shadow-md cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Subscribe $9/mo
                      </button>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-8 bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                    <p className="text-xs text-secondary">
                      This analysis is based on aggregated market data and your self-reported information.
                      For personalized career coaching, consider a premium consultation.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ── NAVIGATION BUTTONS ─────────────────────────────── */}
          <div className="px-8 sm:px-10 pb-8 sm:pb-10 flex items-center justify-between">
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={prevStep}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-gray-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            {currentStep < 4 && (
              <button
                onClick={nextStep}
                disabled={currentStep === 3 && !formData.location}
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md ${
                  currentStep === 3 && !formData.location
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-accent text-white hover:bg-accent/90 hover:shadow-lg'
                } ml-auto`}
              >
                {currentStep === 3 ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Generate Analysis
                  </>
                ) : (
                  <>
                    Continue
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
            {currentStep === 4 && !isAnalyzing && (
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md ml-auto"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Run New Analysis
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-secondary">
          <span className="font-semibold text-primary">PathPilot</span> &mdash; Automated Career Trajectory Analysis
        </div>
      </div>
    </div>
  );
}

export default App;
