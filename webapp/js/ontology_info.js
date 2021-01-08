function getOntologyDefinitions(formattedRes, callback) {
  let count = 0;
  for (const key of Object.keys(formattedRes)) {
    const ontologies = formattedRes[key];
    for (const ontology of ontologies) {
      count++;
      const url = ontology['annotatedClass']['links']['self'];
      $.ajax({
        method: "GET",
        url: url + "?apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f",
        dataType: "JSON",
        success: res => {
          ontology['definition'] = res['definition'][0];
          count--;
        },
        error: res => {
          ontology['definition'] = "error";
          count--;
        }
      });
    }
  }

  // calback once all api calls completed.
  var intervalID;

  intervalID = setInterval(() => {
    if (count == 0) {
      clearInterval(intervalID);
      callback(formattedRes);
    }
  }, 500);
}
