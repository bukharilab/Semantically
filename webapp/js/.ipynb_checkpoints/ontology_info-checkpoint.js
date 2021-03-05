function getOntologyDefinition(ontology, cardSelector) {
  if (ontology['definition']) return;
  const callback = def => {
    ontology['definition'] = def;
    def = def.substring(0, def.indexOf('.')+1);
    $(`${cardSelector} .card-body`).text(def);
  }
  const url = ontology['annotatedClass']['links']['self'];
  $.ajax({
    method: "GET",
    url: url + "?apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f",
    dataType: "JSON",
    success: res => callback(res['definition'][0]),
    error: res => callback("Failed to retrieve ontology definition.")
  });
}
