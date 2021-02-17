import {Accordion, Card} from 'react-bootstrap';

import sortKeys from '../hooks/sortKeys';
import getText from '../hooks/getText';

const SidebarAccordion = ({ annotations, updateAnnotations }) => {
  const annotatedTerms = sortKeys(Object.keys(annotations));
  return (
    <Accordion defaultActiveKey={annotatedTerms[0]} id="sidebar-accordion">
      {annotatedTerms.map(term => {

        const divider = term.indexOf('-');
        const from = Number(term.substring(0, divider))-1;
        const to = Number(term.substring(divider+1, term.length));
        const termStr = getText().substring(from, to);

        return (
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey={term} className="accordion-toggle">
              {termStr}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={term} className="p-2">
              <Accordion defaultActiveKey={`${term}-0`}>
                {annotations[term].map((annotation, key) => {
                  const acronym = annotation['acronym'];

                  return (
                    <Card>
                      <Accordion.Toggle as={Card.Header} eventKey={`${term}-${key}`} className="accordion-toggle">
                        {acronym}
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={`${term}-${key}`}>
                        <Card.Body>Loading...</Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  )
                })}
              </Accordion>
            </Accordion.Collapse>
          </Card>
        )
      })}
    </Accordion>
  );
}

export default SidebarAccordion;
