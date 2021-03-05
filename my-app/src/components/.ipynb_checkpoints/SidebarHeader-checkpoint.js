import Button from 'react-bootstrap/Button';

import getRecommenderAnnotations from '../hooks/getRecommenderAnnotations';
import getText from '../hooks/getText';

const SidebarHeader = ({ updateShowLoader, updateShowAccordion, updateAnnotations }) => {
  const showAnnotations = () => {
    updateShowLoader(true);
    getRecommenderAnnotations(getText(), (formattedAnnotations) => {
      updateAnnotations(formattedAnnotations);
      updateShowAccordion(true);
      updateShowLoader(false);
    });
  }

  return (
    <div id="sidebar-header" className="pt-1">
      <Button variant="outline-dark" onClick={showAnnotations}>Annotate</Button>{'  '}
      <Button variant="outline-dark">Remove annotations</Button>
    </div>
  );
}

export default SidebarHeader;
