import {useState} from 'react';
import $ from 'jquery';

import Chips, { Chip } from 'react-chips';

const fetchAllOntologies = (updateAllOntologies, updateOntologySuggestions) => {
  $.ajax({
    url: 'https://data.bioontology.org/ontologies?include=name,acronym&display_links=false&display_context=false&apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f',
    dataType: 'JSON',
    success: data => {
      const ontologies = {};
      for (const ontology of data) {
        ontologies[ontology.name] = ontology['acronym'];
      }
      updateAllOntologies(ontologies);
      updateOntologySuggestions(Object.keys(ontologies));
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

const ManualAnnotationPopUp = (updateManualAcronyms, manualAcronyms) => {
  const [ontologyChips, updateOntologyChips] = useState([]);
  const [ontologySuggestions, updateOntologySuggestions] = useState([]);

  const [allOntologies, updateAllOntologies] = useState({});
  const [loadedAllOntologies, updateLoadedAllOntologies] = useState(false);
  if (!loadedAllOntologies) {
      fetchAllOntologies(updateAllOntologies, updateOntologySuggestions);
      updateLoadedAllOntologies(true);
  }

  // console.log(allOntologies);

  return (
    <div className="d-block">
        <Chips
          placeholder={"Enter ontology"}
          value={ontologyChips}
          onChange={chips => {updateOntologyChips(chips); console.log(allOntologies[chips[chips.length-1]]);}}
          suggestions={ontologySuggestions}
        />
      </div>
  );
}

export default ManualAnnotationPopUp;
