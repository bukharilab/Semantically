import $ from 'jquery';

const parseRecommenderData = (data) => {
  const results = [];
  for(let i = 0; i < data.length; i++) {
    results[i] = {};
    results[i]['acronym'] = data[i]['ontologies'][0]['acronym'];
    results[i]['annotations'] = [];
    for (const annotation of data[i]['coverageResult']['annotations']) {
      results[i]['annotations'].push(annotation);
    }
  }
  return results;
}

const formatAnnotations = (results) => {
  const formattedRes = {};

  for (const res of results) {
    const acronym = res['acronym'];
    for (const annotation of res['annotations']) {
      let key = annotation['from'] + "-" + annotation['to'];
      annotation['acronym'] = acronym;
      annotation['link'] = annotation['annotatedClass']['links']['self'];
      annotation['id'] = annotation['annotatedClass']['@id'];

      if (key in formattedRes) {
        formattedRes[key].push(annotation);
      } else {
        formattedRes[key] = [annotation];
      }
    }
  }
    console.log(formattedRes);
  // remove overlapping annotations
  for (const res in formattedRes) {
      for (const res1 in formattedRes) {
          if (res !== res1) {
              const from1 = res.substring(0, res.indexOf("-"));
              const from2 = res1.substring(0, res1.indexOf("-"));
              const to1 = res.substring(res.indexOf("-")+1, res.length);
              const to2 = res1.substring(res1.indexOf("-")+1, res1.length);

              if (Number(from1) >= Number(from2) && Number(to1) <= Number(to2)) formattedRes[res] = [];
              else if (Number(from2) >= Number(from1) && Number(to2) <= Number(to1)) formattedRes[res1] = [];
          }
      }
  }
  for (const res in formattedRes) {
      if (formattedRes[res].length == 0) delete formattedRes[res];
  }

  console.log(formattedRes);
  return formattedRes;
}

const getRecommenderAnnotations = (text, ontologies, callback) => {
  let ontologyUrl = '';
  if (ontologies !== undefined) {
    ontologyUrl += '&ontologies=';
    for (const ontology of ontologies) {
      ontologyUrl += ontology + ',';
    }
  }
  console.log(encodeURI(text));
  const url = 'https://data.bioontology.org/recommender?input='
    + encodeURIComponent(text)
    + ontologyUrl
    + '&apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f'
  $.ajax({
		url: url,
    dataType: 'JSON',
    xhrFields: {
        withCredentials: false
    },
		success: (data) => {
      console.log(data);
//           console.log(data);
		  // Converting retrieved data to an array of ontology ids
      const results = parseRecommenderData(data);
			// Executing a callback function, passing an array of ontology IDs
      callback(formatAnnotations(results));
    },
    error: () => {
    	// Executing callback function, passing an empty array
		  callback({});
    }
	});
}

export default getRecommenderAnnotations;
