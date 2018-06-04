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
      .addItem('Open helper', 'showSidebar')
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
  
  var url = 'https://data.bioontology.org/annotator?text=' + encodeURIComponent(DocumentApp.getActiveDocument().getBody().getText()) + '&apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f&include=prefLabel,definition';
  var result = JSON.parse(UrlFetchApp.fetch(url, {'muteHttpExceptions': true}));
  
  for(i = 0; i < result.length; i++) {
    annotations.push({prefLabel: result[i]['annotatedClass']['prefLabel'].capitalize(), definition: ((typeof result[i]['annotatedClass']['definition'] !== 'undefined') ? result[i]['annotatedClass']['definition'][0] : ''), ontology: result[i]['annotatedClass']['links']['ontology'].replace(/http[s]?:\/\/data.bioontology.org\/ontologies\//g, ''), link: result[i]['annotatedClass']['links']['self'], annotations: result[i]['annotations']});
  }

  Logger.log(PropertiesService.getScriptProperties().getProperty('automaticHighlighting'));
  if(PropertiesService.getScriptProperties().getProperty('automaticHighlighting') == 'true') {
    highlightAnnotations(annotations);
  }
  
  return JSON.stringify(annotations);
}

function getCurrentPosition() {
  return DocumentApp.getActiveDocument().getCursor().getOffset();
}

function highlightAnnotations(annotations) {
  //Logger.log(annotations.length);
  var text = DocumentApp.getActiveDocument().getBody().editAsText();
  for(i = 0; i < annotations.length; i++) {
    for(j = 0; j < annotations[i]['annotations'].length; j++) {
      text.setBackgroundColor(annotations[i]['annotations'][j]['from'] - 1, annotations[i]['annotations'][j]['to'] - 1, '#FCFC00');
    }
  }
}

function changeAutomaticHighlightingProperty(value) {
  PropertiesService.getScriptProperties().setProperty('automaticHighlighting', (value ? 'true' : 'false'));
}