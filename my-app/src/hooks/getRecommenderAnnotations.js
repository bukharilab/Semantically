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

  function getKey(from, to) {}

  for (const res of results) {
    const acronym = res['acronym'];
    for (const annotation of res['annotations']) {
      let key = annotation['from'] + "-" + annotation['to'];
      annotation['acronym'] = acronym;
      if (key in formattedRes) {
        formattedRes[key].push(annotation);
      } else {
        formattedRes[key] = [annotation];
      }
    }
  }
  return formattedRes;
}

const getRecommenderAnnotations = (text, callback) => {
  $.ajax({
		url: 'https://data.bioontology.org/recommender?input=' + text + '&apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f',
    dataType: 'JSON',
		success: (data) => {
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
