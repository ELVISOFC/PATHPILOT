import ComparisonTable from './sections/ComparisonTable';
import SkillGaps from './sections/SkillGaps';
import BranchingPaths from './sections/BranchingPaths';
import TreeDiagram from './sections/TreeDiagram';
import NumberedList from './sections/NumberedList';
import Certifications from './sections/Certifications';

function SectionRenderer({ section }) {
  switch (section.type) {
    case 'comparison_table':
    case 'single_table':
      return <ComparisonTable section={section} />;
    case 'skill_gaps':
      return <SkillGaps section={section} />;
    case 'branching_paths':
      return <BranchingPaths section={section} />;
    case 'tree_diagram':
      return <TreeDiagram section={section} />;
    case 'numbered_list':
      return <NumberedList section={section} />;
    case 'certifications':
      return <Certifications section={section} />;
    default:
      return null;
  }
}

export default SectionRenderer;
