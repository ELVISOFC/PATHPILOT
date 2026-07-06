import ReportHeader from './ReportHeader';
import SampleReportBanner from './SampleReportBanner';
import SectionRenderer from './SectionRenderer';
import ResumeGapAnalysis from './ResumeGapAnalysis';
import PricingCards from './PricingCards';

function AnalysisReport({ report }) {
  return (
    <div className="animate-fadeIn">
      <ReportHeader report={report} />
      {report.customized && <SampleReportBanner />}
      <div className="space-y-2">
        {report.sections.map(section => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
      <ResumeGapAnalysis resumeAnalysis={report.resumeAnalysis} />
      <PricingCards />
    </div>
  );
}

export default AnalysisReport;
