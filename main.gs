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

function getAnnotations(enableHighlighting) {
  if(enableHighlighting === true) {
    PropertiesService.getScriptProperties().setProperty('highlightingEnabled', true);
  }

  annotations = [];

  // Getting Annotations
  var url = 'https://data.bioontology.org/annotator';
  var result = JSON.parse(UrlFetchApp.fetch(url, {'muteHttpExceptions': true, method: 'POST', payload: {text: DocumentApp.getActiveDocument().getBody().getText(), include: 'prefLabel,definition', display_context: 'false', apikey: '89f4c54e-aee8-4af5-95b6-dd7c608f057f'}}));

  for(i = 0; i < result.length; i++) {
    annotations.push({id: result[i]['annotatedClass']['@id'], prefLabel: result[i]['annotatedClass']['prefLabel'].capitalize(), definition: ((typeof result[i]['annotatedClass']['definition'] !== 'undefined') ? result[i]['annotatedClass']['definition'][0].split(/<p>|<\/p>/).join('') : ''), ontology: result[i]['annotatedClass']['links']['ontology'].replace(/http[s]?:\/\/data.bioontology.org\/ontologies\//g, ''), link: result[i]['annotatedClass']['links']['self'], annotations: result[i]['annotations']});
  }

  return JSON.stringify(annotations);
}



function getRecommenderAnnotations(deleted) {
  // Getting Recommender Annotations
  unhighlightAnnotations();

  var url = 'https://data.bioontology.org/recommender';
  var result = UrlFetchApp.fetch(url, {'muteHttpExceptions': true, method: 'POST', payload: {input: DocumentApp.getActiveDocument().getBody().getText(), display_context: 'false', display_links: 'false', apikey: '89f4c54e-aee8-4af5-95b6-dd7c608f057f'}}).getContentText();
  Logger.log(result);
  var ontologyId = /"ontologies":\[[\S ]*?"acronym":"([\S ]*?)"/g.exec(result)[1];
  recommenderAnnotations = JSON.parse(/"annotations":(\[[\S ]*?\])/g.exec(result)[1]);
  //Logger.log(JSON.stringify(deleted));
  //recommenderAnnotations = recommenderAnnotations.filter( ( el ) => !deleted.includes( el ));


  var temp=[];
  for(i = 0; i < recommenderAnnotations.length; i++) {
    if(deleted.includes(recommenderAnnotations[i]['text'].toLowerCase())){
      unhighlightAnnotation(recommenderAnnotations[i]['from']-1,recommenderAnnotations[i]['to']-1);
    }else{
      //recommenderAnnotations[i]
      temp.push(recommenderAnnotations[i]);
    }
  }
  recommenderAnnotations=temp;

  for(i = 0; i < recommenderAnnotations.length; i++) {
    recommenderAnnotations[i].ontology = ontologyId;

  }

  highlightAnnotations();



  return JSON.stringify(recommenderAnnotations);
}

function getCurrentPosition() {
  var offset = DocumentApp.getActiveDocument().getBody().editAsText().getText().indexOf(DocumentApp.getActiveDocument().getCursor().getElement().asText().getText())
  var offsetPosition = DocumentApp.getActiveDocument().getCursor().getSurroundingTextOffset();
  return (offset == 0 && DocumentApp.getActiveDocument().getCursor().getElement().asText().getText().length == 0) ? -1 : offset + offsetPosition;
}

function highlightAnnotations() {
  //Logger.log(annotations.length);
  if(PropertiesService.getScriptProperties().getProperty('highlightingEnabled')) {
    Logger.log(recommenderAnnotations.length);
    var text = DocumentApp.getActiveDocument().getBody().editAsText();
//    text.setBackgroundColor(0, text.getText().length - 1, null);
    text.setBackgroundColor(0, 100, null);
    for(i = 0; i < recommenderAnnotations.length; i++) {
      //if(!deleted.includes(recommenderAnnotations[i]['text'].toLowerCase())){
        text.setBackgroundColor(recommenderAnnotations[i]['from'] - 1, recommenderAnnotations[i]['to'] - 1, '#FCFC00');
      //}
    }
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

function getHtml() {
  return DocumentApp.getActiveDocument().getBody().getText();
}
