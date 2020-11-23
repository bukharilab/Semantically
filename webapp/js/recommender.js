function getText() {
  return document.querySelector("trix-editor").editor.getDocument().toString().trim();
}

function fillSidebarAccordion(formattedRes) {
  const accordion = $('#sidebar-accordion');
  const fullText = getText();

  function sortKeys(keys) {
    return keys.sort((a, b) => {
      const from1 = a.substring(0, a.indexOf("-"));
      const from2 = b.substring(0, b.indexOf("-"));
      if (Number(from1) > Number(from2)) return 1;
      else if (Number(from2) > Number(from1)) return -1;
      else {
        const to1 = a.substring(a.indexOf("-")+1, a.length);
        const to2 = b.substring(b.indexOf("-")+1, b.length);
        if (Number(to1) > Number(to2)) return 1;
        if (Number(to2) > Number(to1)) return -1;
        else return -1;
      }
    });
  }

  let count = 0;
  for (const key of sortKeys(Object.keys(formattedRes))) {
    const divider = key.indexOf('-');
    const from = Number(key.substring(0, divider))-1;
    const to = Number(key.substring(divider+1, key.length));

    highlight(from, to);
    const text = fullText.substring(from, to);

    let annotationTabs = '<div class="accordion" id="sidebar-accordion-' + count + '">';
    let count1 = 0;
    for (const annotation of formattedRes[key]) {
      const acronym = annotation['acronym'];
      annotationTabs += '<div class="card"><div class="card-header d-flex" id="heading-' + count + '-' + count1 + '"><h2 class="mb-0 d-inline-block flex-grow-1"><button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse-' + count + '-' + count1 + '" aria-expanded="false" aria-controls="collapse-' + count + '-' + count1 + '">' + acronym + '</button></h2><button class="btn btn-primary btn-sm" type="submit">select</button></div><div id="collapse-' + count + '-' + count1 + '" class="collapse" aria-labelledby="heading-' + count + '-' + count1 + '" data-parent="#sidebar-accordion-' + count + '"><div class="card-body">' + acronym + '</div></div></div>'

      count1++;
    }

    const card = $('<div class="card"><div class="card-header" id="heading-' + count + '"><h2 class="mb-0"><button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse-' + count + '" aria-expanded="false" aria-controls="collapse-' + count + '">' + text + '</button></h2></div><div id="collapse-' + count + '" class="collapse" aria-labelledby="heading-' + count + '" data-parent="#sidebar-accordion"><div class="card-body">' + annotationTabs + '</div></div></div>');
    accordion.append(card);
    count++;
  }
}

function formatAnnotations(results) {
  const formattedRes = {};

  function getKey(from, to) {}

  for (const res of results) {
    const acronym = res['acronym'];
    for (const annotation of res['annotations']) {
      // console.log(annotation);
      let key = annotation['from'] + "-" + annotation['to'];
      annotation['acronym'] = acronym;
      if (key in formattedRes) {
        formattedRes[key].push(annotation);
      } else {
        formattedRes[key] = [annotation];
      }
    }
  }
  // console.log(formattedRes);
  return formattedRes;
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
			url: 'https://data.bioontology.org/recommender?input=' + text + '&apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f',
		    dataType: 'JSON',
		    cache: true,
		    beforeSend: function() {
		    	activeRequestsToBioPortal++;
		    },
			success: function(data) {
				  // Converting retrieved data to an array of ontology ids

          const results = [];
	        for(i = 0; i < data.length; i++) {
            results[i] = {};
            results[i]['acronym'] = data[i]['ontologies'][0]['acronym'];
            results[i]['annotations'] = [];
            for (const annotation of data[i]['coverageResult']['annotations']) {
              results[i]['annotations'].push(annotation);
            }
				  }

				// Caching the response data
				bioPortalRecommenderCache[text] = data;

				// Executing a callback function, passing an array of ontology IDs
				callback(formatAnnotations(results));
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
