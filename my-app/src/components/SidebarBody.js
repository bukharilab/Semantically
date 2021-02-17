import SidebarLoader from './SidebarLoader';
import SidebarAccordion from './SidebarAccordion';

const SidebarBody = ({ showLoader, showAccordion, annotations, updateAnnotations }) => {
  return (
    <div className="py-3 pl-3">
      {showLoader ? <SidebarLoader /> : null}
      {showAccordion ? <SidebarAccordion annotations={annotations} updateAnnotations={updateAnnotations} /> : null}
    </div>
  );
}

export default SidebarBody;
