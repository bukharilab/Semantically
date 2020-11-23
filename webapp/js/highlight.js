function multiHighlight(start, end, startPos, endPos) {
  const editor = document.querySelector("trix-editor").editor;
  const lines = (endPos.top - startPos.top) / 28;
  function getLineEnds() {
    const text = getText();

    let prevIdx = 0;
    let currIdx = 0;
    const editor = document.querySelector("trix-editor").editor;

    return Array.from(Array(text.length).keys()).reduce((lineEnds, idx) => {
      let curr = editor.getClientRectAtPosition(idx);
      if (idx === text.length-1) {
        lineEnds[curr.top] = idx;
        return lineEnds;
      } else if (idx === 0) return lineEnds;

      let prev = editor.getClientRectAtPosition(idx-1);
      if (prev.top !== curr.top) {
        lineEnds[prev.top] = idx-1;
      }
      return lineEnds;
    }, {});
  }
  const lineEnds = getLineEnds();

  // First line
  let firstLineEnd = lineEnds[startPos.top];
  mark(start, firstLineEnd, startPos, editor.getClientRectAtPosition(firstLineEnd));

  // Middle lines
  let lastLineEnd = firstLineEnd;
  for (let i = 0; i < lines-1; i++) {
    let newStartPos = editor.getClientRectAtPosition(lastLineEnd+1);
    let newEnd = lineEnds[newStartPos.top];
    let newEndPos = editor.getClientRectAtPosition(newEnd);
    mark(lastLineEnd+1, newEnd, newStartPos, newEndPos);
    lastLineEnd = newEnd;
  }

  // Last line
  let newStartPos = editor.getClientRectAtPosition(lastLineEnd+1);
  mark(lastLineEnd+1, end, newStartPos, endPos);
}

function mark(start, end, startPos, endPos) {
  let elem = $('<span class="highlight"></span>');

  // console.log(startPos);
  // console.log(endPos);
  let width = endPos.left - startPos.left;
  elem.css({
    left: startPos.left + 'px',
    top: (startPos.top + 22) + 'px',
    with: '5px'
  });

  $('body').append(elem);
  setTimeout(() => {
    elem.css({
      width: width + 'px'
    });
  }, 100);
}

function highlight(start, end) {
  // $('body').children('.highlight').remove();
  if (start > end) return;

  const editor = document.querySelector("trix-editor").editor;
  const startPos = editor.getClientRectAtPosition(start);
  const endPos = editor.getClientRectAtPosition(end);

  if (startPos.top !== endPos.top) {
    multiHighlight(start, end, startPos, endPos);
    return;
  }
  mark(start, end, startPos, endPos);
  return;
}
