function getOntologyDefinitions(formattedRes, callback) {
  let count = 0;
  for (const key of Object.keys(formattedRes)) {
    const ontologies = formattedRes[key];
    for (const ontology of ontologies) {
      count++;
      const url = ontology['annotatedClass']['links']['self'];
      $.ajax({
        method: "GET",
        url: url,
        dataType: "JSON",
        success: res => {
          ontology['definition'] = res['definition'][0];
          count--;
        },
        error: res => {
          count--;
        }
      });
    }
  }

  var intervalID;

  intervalID = setInterval(() => {
    if (count == 0) {
      clearInterval(intervalID);
      callback(formattedRes);
    }
  }, 500);
}
