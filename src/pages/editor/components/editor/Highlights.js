import $ from 'jquery';
import React, {useEffect, useState} from 'react';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

import sortKeys from '../../hooks/sidebar/sortKeys';
import getRemovedHighlights from '../../hooks/editor/getRemovedHighlights';

const Highlights = ({ highlights, currentHighlight, setCurrentHighlight, annotationSelection, editor}) => {
  const sortedKeys = sortKeys(Object.keys(highlights));
  const [activeIndex, updateActiveIndex] = useState(0);

  const removedHighlights = getRemovedHighlights(annotationSelection);

  if (editor) {
    $(document.querySelector("trix-editor")).click(() => {
        setTimeout(() => updateActiveIndex(editor.getSelectedRange()[0]), 200);
    });
  }

  // display all highlights
  useEffect(() => {
    for (const term in highlights) {
      const divider = term.indexOf('-');
      const from = Number(term.substring(0, divider))-1;
      const to = Number(term.substring(divider+1, term.length));

      console.log(from + '-' + to);
      const start = editor.getClientRectAtPosition(from);
      const end = editor.getClientRectAtPosition(to);
      const width = end.left - start.left;

      $(`#highlight-${term}`).css({
        width: `${width}px`,
        top: `${start.top + 25}px`,
        left: `${start.left}px`
      });
    }
  });

  useEffect(() => {
    let set = false;
    for (const key of sortedKeys) {
    const divider = key.indexOf('-');
    const highlightStart = Number(key.substring(0, divider))-1;
    const highlightEnd = Number(key.substring(divider+1, key.length));
    if (activeIndex <= highlightEnd) {
//       $('.active').removeClass('active');
//       $(`#highlight-${key}`).addClass('active');
      if (activeIndex > highlightStart) {
        setCurrentHighlight(key);
        set = true;

        // show accordion card
//         const toggle = document.querySelector(`.toggle-${key}`);
//         const collapse = document.querySelector(`.toggle-${key} + .collapse`);
//         if (!collapse.classList.contains('show')) {
//             toggle.click();
//             setTimeout(() => toggle.scrollIntoView(), 300);
//         }
      }
      break;
    }
  }
  if (!set) setCurrentHighlight(null);
  }, [activeIndex]);
  return (
    <div>
      {Object.keys(highlights).map((term, key) => <div key={key} id={`highlight-${term}`}
        className={`highlight ${term === currentHighlight ? 'active' : ''} ${removedHighlights.includes(term) ? 'deleted' : ''} ${highlights[term] != -1 ? 'selected' : ''}`}/>)
      }
    </div>
  )
};

export default Highlights;
