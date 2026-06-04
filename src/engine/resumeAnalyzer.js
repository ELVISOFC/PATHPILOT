/**
 * Resume Gap Analysis Engine
 * Scans a user's resume against role skill configs for gap analysis.
 */
import resumeConfig from '../resume-gap-config.json';

function findMatchingRole(fd) {
  const jt = (fd.jobTitle || '').toLowerCase();
  const ind = (fd.industry || '').toLowerCase();
  const sk = (fd.skills || '').toLowerCase();
  for (const r of resumeConfig.roles) {
    if (r.alternate_titles.some(t => jt.includes(t.toLowerCase()))) return r;
    if (r.industry && ind.includes(r.industry.toLowerCase().split('/')[0].trim())) return r;
    const all = r.skill_categories.flatMap(c => c.skills);
    if (all.filter(s => s.keywords.some(k => sk.includes(k))).length >= 2) return r;
  }
  return resumeConfig.roles[0];
}

function scoreSkill(s, txt) {
  const kws = s.keywords || [];
  if (!kws.length) return 0;
  return Math.min(100, Math.round((kws.filter(k => txt.toLowerCase().includes(k)).length / kws.length) * 100));
}

function gapLevel(sc, t) {
  if (sc >= t.none.min_score) return 'none';
  if (sc >= t.low.min_score) return 'low';
  if (sc >= t.medium.min_score) return 'medium';
  if (sc >= t.high.min_score) return 'high';
  return 'major';
}

function gapL(l, t) { return t[l]?.label || l; }

export function analyzeResume(formData) {
  const txt = formData.resumeText || '';
  const role = findMatchingRole(formData);
  const th = resumeConfig.meta.scoring.gap_thresholds;
  const ww = resumeConfig.meta.scoring.weight_type_weights;

  if (!txt.trim()) {
    return {
      role, hasResume: false, targetRole: role.role_title,
      targetNextRole: role.target_next_role,
      categories: role.skill_categories.map(c => ({
        category: c.category, weight: c.weight,
        skills: c.skills.map(s => ({
          name: s.name, score: 0, gap: 'major',
          gapLabel: gapL('major', th),
          weightType: s.weight_type, minYears: s.min_years || 0
        })),
        overallScore: 0, gap: 'major'
      })),
      overallScore: 0, topStrengths: [], topGaps: [],
      recommendations: ['Paste your resume above to get your analysis.']
    };
  }

  const cats = role.skill_categories.map(c => {
    const sk = c.skills.map(s => {
      const sc = scoreSkill(s, txt);
      const g = gapLevel(sc, th);
      return {
        name: s.name, score: sc, gap: g, gapLabel: gapL(g, th),
        weightType: s.weight_type, minYears: s.min_years || 0
      };
    });
    let tw = 0, ws = 0;
    sk.forEach(s => { const w = ww[s.weightType] || 1; tw += w; ws += s.score * w; });
    const os = tw > 0 ? Math.round(ws / tw) : 0;
    return { category: c.category, weight: c.weight, skills: sk, overallScore: os, gap: gapLevel(os, th) };
  });

  let tcw = 0, wcs = 0;
  cats.forEach(c => { tcw += c.weight; wcs += c.overallScore * c.weight; });
  const os = tcw > 0 ? Math.round(wcs / tcw) : 0;
  const all = cats.flatMap(c => c.skills);
  const str = all.filter(s => s.score >= 80).sort((a, b) => b.score - a.score).slice(0, 5).map(s => s.name);
  const gps = all.filter(s => s.score < 60 && (s.weightType === 'required' || s.weightType === 'preferred')).sort((a, b) => a.score - b.score).slice(0, 5).map(s => s.name);

  const rec = [];
  gps.slice(0, 3).forEach(g => rec.push('Prioritize "' + g + '" — critical gap for ' + role.target_next_role + '.'));
  if (str.length) rec.push('Leverage ' + str.slice(0, 2).join(' and ') + ' — competitive advantages.');
  rec.push('Target: ' + role.target_next_role + '. Focus on closing gaps above.');

  return {
    role, hasResume: true, categories: cats, overallScore: os,
    gap: gapLevel(os, th), topStrengths: str, topGaps: gps,
    recommendations: rec,
    targetRole: role.role_title, targetNextRole: role.target_next_role
  };
}