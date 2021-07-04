import getText from './getText';
import getTermStr from './getTermString';
import getDefinition from './getDefinition';

const download = (filename, text) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
}

const saveAsJSON = async (annotations, annotationSelection, definitions, updateDefinitions) => {
  const schemaJson = {};

  const onlySelectedAnnotations = {};
  for (const term in annotationSelection) {
    if (annotationSelection[term] !== -1)
      onlySelectedAnnotations[term] = annotations[term][annotationSelection[term]];
  }

  for(const term in onlySelectedAnnotations) {
    const annotation = onlySelectedAnnotations[term];
    const url = annotation.annotatedClass.links.self;
    const def = url in definitions ? definitions[url] : await getDefinition(url);
    updateDefinitions({...definitions, [url]: def});

    schemaJson[getTermStr(term)] = def;
  }

  download('document.json', JSON.stringify(schemaJson));
}

const saveAsHTML = async (annotations, annotationSelection, definitions, updateDefinitions, hasHighlights) => {
  const schemaJson = {
    "@context": "http://schema.org",
    "@type": "MedicalEntity",
    "code": []
  };

  const onlySelectedAnnotations = {};
  for (const term in annotationSelection) {
    if (annotationSelection[term] !== -1)
      onlySelectedAnnotations[term] = annotations[term][annotationSelection[term]];
  }

  let addedLength = 0;
  let text = getText();
  for(const term in onlySelectedAnnotations) {
    const annotation = onlySelectedAnnotations[term];

    schemaJson['code'].push({"@type": "MedicalCode", "name": getTermStr(term), "codingSystem": annotation.acronym, "link": annotation.annotatedClass['@id']});
    if(hasHighlights) {
      const url = annotation.annotatedClass.links.self;
      const def = url in definitions ? definitions[url] : await getDefinition(url);
      updateDefinitions({...definitions, [url]: def});
      text = text.substring(0, annotation.from + addedLength - 1) + `<span class="tippy" title="${def}">${text.substring(annotation.from + addedLength - 1, annotation.to + addedLength)}</span>` + text.substring(annotation.to + addedLength);
      addedLength += 36 + def.length;
    }
  }

  download('document.html', '<html><head><title><\/title><link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,600,800" rel="stylesheet">' + ((hasHighlights) ? '<script src="https://unpkg.com/tippy.js@2.5.4/dist/tippy.all.min.js"><\/script>' : '') + '<style>.container { font-family: Nunito Sans,Avenir,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Cantarell,Helvetica Neue,Helvetica,Arial,sans-serif; font-size: 1.125rem; padding: 4%; margin: 0 auto; }' + ((hasHighlights) ? ' .tippy { background: rgba(255,202,223,.5); color: #d22489; outline: 0; border-bottom: 1px solid #f27da6; padding: 0 4px; font-weight: 600; cursor: help; }' : '') + '<\/style><script type="application/ld+json">' + JSON.stringify(schemaJson) + '<\/script><\/head><body class="container"' + ((hasHighlights) ? ' onload="tippy(\'.tippy\');"' : '') + '>' + text + '<\/body><\/html>');
}

export {saveAsHTML, saveAsJSON};
