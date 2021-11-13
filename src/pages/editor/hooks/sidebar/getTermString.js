const getTermStr = (term, content) => {
  console.log(term);
  const divider = term.indexOf('-');
  const from = Number(term.substring(0, divider))-1;
  const to = Number(term.substring(divider+1, term.length));
  return content.substring(from, to);
}

export default getTermStr;
