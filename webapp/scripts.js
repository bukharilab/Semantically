// var annotatingEnabled = false;
$('#annotate').click(() => showAnnotations());

function showAnnotations() {
  //annotatingEnabled = true;
  showLoader();
  getRecommenderAnnotations(getText(), (data) => {
    console.log(data);
    showDownloadButton();
    hideLoader();
  });
}

function getLineEnds() {
  const text = getText();

  let prevIdx = 0;
  let currIdx = 0;
  const editor = document.querySelector("trix-editor").editor;

  return Array.from(Array(text.length).keys()).reduce((lineEnds, idx) => {
    let curr = editor.getClientRectAtPosition(idx);
    if (idx === text.length-1) {
      lineEnds[curr.top] = idx;
      return lineEnds;
    } else if (idx === 0) return lineEnds;

    let prev = editor.getClientRectAtPosition(idx-1);
    if (prev.top !== curr.top) {
      lineEnds[prev.top] = idx-1;
    }
    return lineEnds;
  }, {});
}

function multiHighlight(start, end, startPos, endPos) {
  const editor = document.querySelector("trix-editor").editor;
  const lines = (endPos.top - startPos.top) / 28;
  const lineEnds = getLineEnds();

  // First line
  let firstLineEnd = lineEnds[startPos.top];
  mark(start, firstLineEnd, startPos, editor.getClientRectAtPosition(firstLineEnd));

  // Middle lines
  let lastLineEnd = firstLineEnd;
  for (let i = 0; i < lines-1; i++) {
    let newStartPos = editor.getClientRectAtPosition(lastLineEnd+1);
    let newEnd = lineEnds[newStartPos.top];
    let newEndPos = editor.getClientRectAtPosition(newEnd);
    mark(lastLineEnd+1, newEnd, newStartPos, newEndPos);
    lastLineEnd = newEnd;
  }

  // Last line
  let newStartPos = editor.getClientRectAtPosition(lastLineEnd+1);
  mark(lastLineEnd+1, end, newStartPos, endPos);
}

function mark(start, end, startPos, endPos) {
  let elem = $('<span class="highlight"></span>');

  // console.log(startPos);
  // console.log(endPos);
  let width = endPos.left - startPos.left;
  elem.css({
    left: startPos.left + 'px',
    top: (startPos.top + 22) + 'px',
    with: '5px'
  });

  $('body').append(elem);
  setTimeout(() => {
    elem.css({
      width: width + 'px'
    });
  }, 100);
}

function highlight(start, end) {
  $('body').children('.highlight').remove();

  const editor = document.querySelector("trix-editor").editor;
  const startPos = editor.getClientRectAtPosition(start);
  const endPos = editor.getClientRectAtPosition(end);

  if (startPos.top !== endPos.top) {
    multiHighlight(start, end, startPos, endPos);
    return;
  }
  mark(start, end, startPos, endPos);
  return;



    // elem.hover(() => {
    //
    // }, () => {
    //   elem.css({
    //     width: '5px'
    //   });
    // });
  // } else {
  //   console.log(2);
  //   elem = $('#highlight');
  //
  //
  //   const startPos = editor.getClientRectAtPosition(start);
  //   const endPos = editor.getClientRectAtPosition(end);
  //
  //   let width = endPos.left - startPos.left;
  //   elem.css({
  //     left: startPos.left + 'px',
  //     top: (start.top + 26) + 'px'
  //   });
  //
  //   $('body').append(elem);
  //
  //   elem.css({
  //     width: width + 'px'
  //   });
  // }
  // elem.addClass('active');
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
}

function hideLoader() {
  console.log('loader hidden');
  $('.loader-container').css('display', 'none');
  $('.sidebar-block').css('display', 'block');
}

function getText() {
  return document.querySelector("trix-editor").editor.getDocument().toString().trim();
}

async function getAnnotations(enableHighlighting) {
  // if(enableHighlighting === true) {
  //   PropertiesService.getScriptProperties().setProperty('highlightingEnabled', true);
  // }

  annotations = [];

  // Getting Annotations
  var url = 'https://data.bioontology.org/annotator';
  var result = await $.ajax({
    url: url,
    data: {
      text: getText(),
      include: 'prefLabel,definition',
      display_context: 'false',
      apikey: '8b5b7825-538d-40e0-9e9e-5ab9274a9aeb'
    }
  });
  //console.log(result);
  for(i = 0; i < result.length; i++) {
    annotations.push(
      {
        id: result[i]['annotatedClass']['@id'],
        prefLabel: result[i]['annotatedClass']['prefLabel'].replace(/^\w/, c => c.toUpperCase()),
        definition: ((typeof result[i]['annotatedClass']['definition'] !== 'undefined') ?
          result[i]['annotatedClass']['definition'][0].split(/<p>|<\/p>/).join('') :
          ''),
        ontology: result[i]['annotatedClass']['links']['ontology'].replace(/http[s]?:\/\/data.bioontology.org\/ontologies\//g, ''),
        link: result[i]['annotatedClass']['links']['self'],
        annotations: result[i]['annotations']
      }
    );
  }
  //console.log(JSON.stringify(annotations));
  return JSON.stringify(annotations);
}



function getRecommenderAnnotations(text, callback) {
  // Check if callback is given
	if(typeof callback !== "function") {
		return;
	}

  let activeRequestsToBioPortal = 0;
  let bioPortalRecommenderCache = {};

	// Initializing counter for active requests to the Bioportal (if not initialized)
	if(typeof activeRequestsToBioPortal != "number") {
		activeRequestsToBioPortal = 0;
	}
	if(typeof bioPortalRecommenderCache[text] === "undefined") {
		// Performing the request
		$.ajax({
			url: 'https://data.bioontology.org/recommender?input=' + text + '&include=ontologies&display_links=false&display_context=false&apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f',
		    dataType: 'JSON',
		    cache: true,
		    beforeSend: function() {
		    	activeRequestsToBioPortal++;
		    },
			success: function(data) {
				// Converting retrieved data to an array of ontology ids
		        for(i = 0; i < data.length; i++) {
					data[i] = data[i]['ontologies'][0]['acronym'];
				}

				// Caching the response data
				bioPortalRecommenderCache[text] = data;

				// Executing a callback function, passing an array of ontology IDs
				callback(data);
		    },
		    error: function() {
		    	// Executing callback function, passing an empty array
				callback([]);
		    },
		    complete: function() {
		    	activeRequestsToBioPortal--;
		    }
		});
	} else {
		activeRequestsToBioPortal++;
		setTimeout(function() {
			callback(bioPortalRecommenderCache[text]);
			activeRequestsToBioPortal--;
		}, 250);
	}
}


function unhighlightAnnotation(a,b) {
  var text = DocumentApp.getActiveDocument().getBody().editAsText();
  text.setBackgroundColor(a , b , null);
}


function unhighlightAnnotations() {
  PropertiesService.getScriptProperties().setProperty('highlightingEnabled', false);

  var text = DocumentApp.getActiveDocument().getBody().editAsText();
  text.setBackgroundColor(0, text.getText().length - 1, null);
}
