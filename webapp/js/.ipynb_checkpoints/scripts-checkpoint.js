$('#annotate').click(() => showAnnotations());
$('#remove-annotations').click(() => removeAnnotations());

function showAnnotations() {
  //annotatingEnabled = true;
  showLoader();
  getRecommenderAnnotations(getText(), (formattedRes) => {
    //getOntologyDefinitions(formattedRes, formattedResWithDef => {
      console.log(formattedRes);
      fillSidebarAccordion(formattedRes);
      showDownloadButton();
      hideLoader();
    //});
  });
}

function removeAnnotations() {
  $.post("http://data.bioontology.org/batch?apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f", {
    "http://www.w3.org/2002/07/owl#Class": {
      "collection": [
        {
          "class": "http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C3224",
          "ontology": "http://data.bioontology.org/ontologies/NCIT"
        }
      ],
      "display": "prefLabel,synonym,semanticTypes"
    }
  }).done(data => {
    console.log(data);
  });
}

function showDownloadButton() {
  $('.sidebar.bottom button#downloadAs').css('display', 'block');
  $('.sidebar.branding-below').css('bottom', '127px');
}

function hideDownloadButton() {
  $('.sidebar.bottom button#downloadAs').css('display', 'none');
  $('.sidebar.branding-below').css('bottom', '80px');
}

function show(blockName) {
  $('.sidebar-block').css('display', 'none');
  $('.' + blockName).css('display', 'block');
}

function hide(blockName) {
  $('.sidebar-block').css('display', 'block');
  $('.' + blockName).css('display', 'none');
}

function showLoader() {
  console.log('loader shown');
  $('.loader-container').css('display', 'flex');
  $('.sidebar-block').css('display', 'none');

  // Clear sidebar
  $('#sidebar-accordion').empty();
}

function hideLoader() {
  console.log('loader hidden');
  $('.loader-container').css('display', 'none');
  $('.sidebar-block').css('display', 'block');
}



// async function getAnnotations(enableHighlighting) {
//   // if(enableHighlighting === true) {
//   //   PropertiesService.getScriptProperties().setProperty('highlightingEnabled', true);
//   // }
//
//   annotations = [];
//
//   // Getting Annotations
//   var url = 'https://data.bioontology.org/annotator';
//   var result = await $.ajax({
//     url: url,
//     data: {
//       text: getText(),
//       include: 'prefLabel,definition',
//       display_context: 'false',
//       apikey: '8b5b7825-538d-40e0-9e9e-5ab9274a9aeb'
//     }
//   });
//   //console.log(result);
//   for(i = 0; i < result.length; i++) {
//     annotations.push(
//       {
//         id: result[i]['annotatedClass']['@id'],
//         prefLabel: result[i]['annotatedClass']['prefLabel'].replace(/^\w/, c => c.toUpperCase()),
//         definition: ((typeof result[i]['annotatedClass']['definition'] !== 'undefined') ?
//           result[i]['annotatedClass']['definition'][0].split(/<p>|<\/p>/).join('') :
//           ''),
//         ontology: result[i]['annotatedClass']['links']['ontology'].replace(/http[s]?:\/\/data.bioontology.org\/ontologies\//g, ''),
//         link: result[i]['annotatedClass']['links']['self'],
//         annotations: result[i]['annotations']
//       }
//     );
//   }
//   //console.log(JSON.stringify(annotations));
//   return JSON.stringify(annotations);
// }




function unhighlightAnnotation(a,b) {
  var text = DocumentApp.getActiveDocument().getBody().editAsText();
  text.setBackgroundColor(a , b , null);
}


function unhighlightAnnotations() {
  PropertiesService.getScriptProperties().setProperty('highlightingEnabled', false);

  var text = DocumentApp.getActiveDocument().getBody().editAsText();
  text.setBackgroundColor(0, text.getText().length - 1, null);
}
