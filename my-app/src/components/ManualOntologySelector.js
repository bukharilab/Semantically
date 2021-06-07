import React, {useState, useEffect} from 'react';
import $ from 'jquery';
import {Button} from 'react-bootstrap';
import Chips, { Chip } from 'react-chips';

const fetchAllOntologies = (updateAllOntologies) => {
  $.ajax({
    url: 'https://data.bioontology.org/ontologies?include=name,acronym&display_links=false&display_context=false&apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f',
    dataType: 'JSON',
    success: data => {
      const ontologies = {};
      for (const ontology of data) {
        ontologies[ontology.name] = ontology['acronym'];
      }
      updateAllOntologies(ontologies);
    }});
}

const limitResults = limit => {
  if (limit < 0) return;
  const resultList = $('#react-autowhatever-1 > ul');
  const len = resultList.children().length;
  if (len > limit) {
    for (let i = limit; i < len; i++) resultList.children().remove('#react-autowhatever-1--item-' + i);
  }
}

const updateChips = (chips, allOntologies, updateManualOntologies) => {
  updateManualOntologies(chips.reduce((ontologies, chip) => {
    ontologies[`${allOntologies[chip]}`] = chip;
    return ontologies;
  }, {}));
}

const ManualAnnotationPopUp = ({manualOntologies, updateManualOntologies}) => {

  const [allOntologies, updateAllOntologies] = useState({});
  const [loadedAllOntologies, updateLoadedAllOntologies] = useState(false);
  const [hideOntologyField, updateHideOntologyField] = useState(false);

  if (!loadedAllOntologies) {
      fetchAllOntologies(updateAllOntologies);
      updateLoadedAllOntologies(true);
  }


  return (
    <div className="mb-3">
      {hideOntologyField ?
        <Button variant="outline-secondary" className="pt-1 pb-2 w-100" onClick={() => updateHideOntologyField(false)}>show ontologies</Button> :
        <React.Fragment>
          <Chips
            placeholder={"Enter ontology"}
            value={Object.values(manualOntologies)}
            onChange={chips => updateChips(chips, allOntologies, updateManualOntologies)}
            suggestions={Object.keys(allOntologies)}
            highlightFirstSuggestion={true}
          />
          <Button variant="link" onClick={() => updateHideOntologyField(true)}>hide ontologies</Button>
        </React.Fragment>
      }
      </div>
  );
}

export default ManualAnnotationPopUp;
