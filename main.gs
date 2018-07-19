String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  DocumentApp.getUi().createMenu("Semantically")
      .addItem('Launch Semantically Workspace', 'showSidebar')
      .addToUi();
  init();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

function init() {
  if(PropertiesService.getScriptProperties().getProperty('automaticHighlighting') == null) {
    PropertiesService.getScriptProperties().setProperty('automaticHighlighting', 'false');
  }
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('sidebar').setTitle('Semantically');
  DocumentApp.getUi().showSidebar(ui);
}

function getAnnotations() {
  annotations = [];
  
  // Getting Annotations
  var url = 'https://data.bioontology.org/annotator?text=' + encodeURIComponent(DocumentApp.getActiveDocument().getBody().getText()) + '&include=prefLabel,definition&display_context=false&apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f';
  var result = JSON.parse(UrlFetchApp.fetch(url, {'muteHttpExceptions': true}));
  
  for(i = 0; i < result.length; i++) {
    annotations.push({id: result[i]['annotatedClass']['@id'], prefLabel: result[i]['annotatedClass']['prefLabel'].capitalize(), definition: ((typeof result[i]['annotatedClass']['definition'] !== 'undefined') ? result[i]['annotatedClass']['definition'][0].split(/<p>|<\/p>/).join('') : ''), ontology: result[i]['annotatedClass']['links']['ontology'].replace(/http[s]?:\/\/data.bioontology.org\/ontologies\//g, ''), link: result[i]['annotatedClass']['links']['self'], annotations: result[i]['annotations']});
  }
  
  return JSON.stringify(annotations);
}

function getRecommenderAnnotations() {
  // Getting Recommender Annotations
  var url = 'https://data.bioontology.org/recommender?input=' + encodeURIComponent(DocumentApp.getActiveDocument().getBody().getText()) + '&display_context=false&display_links=false&apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f';
  var result = UrlFetchApp.fetch(url, {'muteHttpExceptions': true}).getContentText();
  
  var ontologyId = /"ontologies":\[[\S ]*?"acronym":"([\S ]*?)"/g.exec(result)[1];
  recommenderAnnotations = JSON.parse(/"annotations":(\[[\S ]*?\])/g.exec(result)[1]);
  for(i = 0; i < recommenderAnnotations.length; i++) {
    recommenderAnnotations[i].ontology = ontologyId;
  }
  
  highlightAnnotations();
  
  return JSON.stringify(recommenderAnnotations);
}

function getCurrentPosition() {
  return DocumentApp.getActiveDocument().getCursor().getOffset();
}

function highlightAnnotations() {
  //Logger.log(annotations.length);
  
  Logger.log(recommenderAnnotations.length);
  var text = DocumentApp.getActiveDocument().getBody().editAsText();
  text.setBackgroundColor(0, text.getText().length - 1, null);
  for(i = 0; i < recommenderAnnotations.length; i++) {
    text.setBackgroundColor(recommenderAnnotations[i]['from'] - 1, recommenderAnnotations[i]['to'] - 1, '#FCFC00');
  }
}

function unhighlightAnnotations() {
  var text = DocumentApp.getActiveDocument().getBody().editAsText();
  text.setBackgroundColor(0, text.getText().length - 1, null);
}

function changeAutomaticHighlightingProperty(value) {
  PropertiesService.getScriptProperties().setProperty('automaticHighlighting', (value ? 'true' : 'false'));
  if(!value) {
    var text = DocumentApp.getActiveDocument().getBody().editAsText();
    text.setBackgroundColor(0, text.getText().length - 1, null);
  }
}

function getAutomaticHighlightingProperty() {
  return PropertiesService.getScriptProperties().getProperty('automaticHighlighting') == 'true' ? true : false;
}

function getHtml() {
  return DocumentApp.getActiveDocument().getBody().getText();
}