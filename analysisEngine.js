import sampleReports from '../sample-reports.json';

/**
 * Match a user's profile to the best sample report.
 * Uses keyword matching on industry, job title, and skills.
 */
function matchSample(formData) {
  const samples = sampleReports.samples;
  const industry = (formData.industry || '').toLowerCase();
  const jobTitle = (formData.jobTitle || '').toLowerCase();
  const skills = (formData.skills || '').toLowerCase();

  // Score each sample based on keyword matches
  const scored = samples.map(sample => {
    let score = 0;

    // Report 1: Technology / Software Engineer
    if (industry.includes('tech') || industry.includes('software') || industry.includes('engineer') ||
        jobTitle.includes('engineer') || jobTitle.includes('developer') || jobTitle.includes('sde') ||
        jobTitle.includes('swe') || jobTitle.includes('software')) {
      if (sample.report_id === "PP-2025-0001") score += 3;
    }

    // Report 2: Financial Services / Analyst
    if (industry.includes('financ') || industry.includes('bank') || industry.includes('invest') ||
        jobTitle.includes('analyst') || jobTitle.includes('finance') || jobTitle.includes('account')) {
      if (sample.report_id === "PP-2025-0002") score += 3;
    }

    // Report 3: Product Manager / SaaS
    if (jobTitle.includes('product manager') || jobTitle.includes('pm') ||
        jobTitle.includes('product') || industry.includes('saas') ||
        skills.includes('product strategy') || skills.includes('stakeholder')) {
      if (sample.report_id === "PP-2025-0003") score += 3;
    }

    // Report 4: Healthcare IT / Administration
    if (industry.includes('health') || industry.includes('hospital') || industry.includes('clinical') ||
        industry.includes('medical') || jobTitle.includes('health') ||
        jobTitle.includes('hospital') || skills.includes('ehr') || skills.includes('hipaa') ||
        skills.includes('epic')) {
      if (sample.report_id === "PP-2025-0004") score += 3;
    }

    // Fallback: check skills for closeness
    if (skills.includes('system design') && sample.report_id === "PP-2025-0001") score += 1;
    if (skills.includes('financial modeling') && sample.report_id === "PP-2025-0002") score += 1;
    if (skills.includes('a/b testing') && sample.report_id === "PP-2025-0003") score += 1;
    if (skills.includes('ehr') && sample.report_id === "PP-2025-0004") score += 1;

    return { sample, score };
  });

  // Sort by score descending, pick the best match
  scored.sort((a, b) => b.score - a.score);
  return scored[0].score > 0 ? scored[0].sample : null;
}

/**
 * Estimate years of experience from the free-text experience summary
 * and job title. Looks for an explicit "N years" figure first, then
 * falls back to seniority keywords in the title, then a neutral
 * mid-level default. Deterministic: same input always yields the same
 * estimate.
 */
function extractYearsOfExperience(experienceText, jobTitle) {
  const text = `${experienceText || ''} ${jobTitle || ''}`.toLowerCase();

  const yearsMatch = text.match(/(\d+)\+?\s*years?/);
  if (yearsMatch) return Math.min(parseInt(yearsMatch[1], 10), 20);

  if (/\b(principal|staff|director|vp|vice president|head of)\b/.test(text)) return 12;
  if (/\b(senior|sr\.?|lead)\b/.test(text)) return 7;
  if (/\b(junior|jr\.?|associate|entry)\b/.test(text)) return 1;
  return 4;
}

/**
 * Market match percentile, derived from estimated experience and the
 * breadth of listed skills rather than chance. Capped at 92 so this
 * reads as an estimate, not a guarantee.
 */
function computeMarketMatchScore(years, skillCount) {
  const experienceComponent = Math.min(years, 15) * 0.8;
  const breadthComponent = Math.min(skillCount, 6) * 0.5;
  return Math.min(75 + Math.round(experienceComponent + breadthComponent), 92);
}

/**
 * Maps estimated years of experience to a 1-4 proficiency level. Used
 * as the "current level" baseline for every listed skill, since the
 * generic fallback (unlike the resume-based analyzer) has no
 * per-skill signal to differentiate on.
 */
function computeSkillLevel(years) {
  if (years >= 8) return 4;
  if (years >= 4) return 3;
  if (years >= 1) return 2;
  return 1;
}

/** Gap label derived directly from the level vs. requirement gap, so the two numbers can never contradict each other. */
function gapFromLevels(currentLevel, requiredLevel) {
  const diff = requiredLevel - currentLevel;
  if (diff <= 0) return 'none';
  if (diff === 1) return 'medium';
  return 'high';
}

/**
 * Build a generic fallback report when no sample matches.
 */
function buildFallbackReport(formData) {
  const skills = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
  const primarySkill = skills[0] || 'your core expertise';
  const years = extractYearsOfExperience(formData.experience, formData.jobTitle);
  const marketMatchScore = computeMarketMatchScore(years, skills.length);
  const numericSalary = parseInt(formData.targetSalary.replace(/[^0-9]/g, '')) || 100000;
  const avgSalary = Math.floor(numericSalary * 0.92);

  const requiredLevel = 4;
  const currentSkillLevel = computeSkillLevel(years);
  const skillGaps = skills.slice(0, 6).map(skill => ({
    name: skill,
    level: currentSkillLevel,
    required: requiredLevel,
    gap: gapFromLevels(currentSkillLevel, requiredLevel)
  }));

  return {
    report_id: `PP-GEN-${Date.now()}`,
    title: `${formData.jobTitle || 'Professional'} — ${formData.location || 'Market'} Analysis`,
    userName: formData.name,
    industry: formData.industry,
    customized: false,
    sections: [
      {
        id: "salary_benchmark",
        title: "Salary Benchmark",
        type: "single_table",
        headers: ["Metric", "Value"],
        rows: [
          ["Market Median (P50)", `$${avgSalary.toLocaleString()}`],
          ["Market Range (P25–P75)", `$${(avgSalary * 0.8).toLocaleString()} – $${(avgSalary * 1.2).toLocaleString()}`],
          ["Your Target", formData.targetSalary || '$100,000'],
          ["Percentile", `${marketMatchScore}th (${marketMatchScore > 50 ? 'above' : 'below'} market median)`]
        ],
        insight: `Your target is ${marketMatchScore > 50 ? 'above' : 'below'} the local median. Achieving this may require highlighting your ${primarySkill} expertise.`
      },
      {
        id: "skill_gap",
        title: "Skill Gap Analysis",
        type: "skill_gaps",
        skills: skillGaps.length > 0 ? skillGaps : [
          { name: primarySkill, level: 3, required: 4, gap: "medium" },
          { name: "Communication", level: 3, required: 3, gap: "none" },
          { name: "Leadership", level: 2, required: 4, gap: "high" }
        ],
        actions: [
          `Develop your ${primarySkill} expertise to reach market-leading level.`,
          `The ${formData.industry || 'current'} market in ${formData.location || 'your area'} is evolving; stay updated on regional trends.`,
          `Expand your professional network to increase visibility for new opportunities.`
        ]
      },
      {
        id: "trajectory",
        title: "Career Trajectory Map",
        type: "branching_paths",
        paths: [
          { name: "Senior / Lead Role", timeline: "12–24 months", salary_target: `$${(avgSalary * 1.25).toLocaleString()} – $${(avgSalary * 1.5).toLocaleString()}` },
          { name: "Management Track", timeline: "24–36 months", salary_target: `$${(avgSalary * 1.4).toLocaleString()} – $${(avgSalary * 1.7).toLocaleString()}` },
          { name: "Strategic Pivot", timeline: "6–18 months", salary_target: `$${(avgSalary * 1.1).toLocaleString()} – $${(avgSalary * 1.35).toLocaleString()}` }
        ]
      },
      {
        id: "recommendations",
        title: "Strategic Recommendations",
        type: "numbered_list",
        items: [
          `Highlight your ${primarySkill} experience in your next performance review.`,
          `Research salary trends in ${formData.location || 'your target market'} to benchmark your compensation.`,
          `Consider certifications or courses to close skill gaps identified above.`,
          `Build visibility by contributing to industry events and online communities.`
        ]
      }
    ]
  };
}

/**
 * Main report generation function.
 * First attempts to match against a curated sample report,
 * then falls back to a dynamically generated report.
 */
export const generateReport = (formData) => {
  const matchedSample = matchSample(formData);

  if (matchedSample) {
    return {
      ...matchedSample,
      userName: formData.name || formData.jobTitle || 'Professional',
      customized: true
    };
  }

  return buildFallbackReport(formData);
};