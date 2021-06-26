import getText from './getText';

const getTermStr = term => {
  console.log(term);
  const divider = term.indexOf('-');
  const from = Number(term.substring(0, divider))-1;
  const to = Number(term.substring(divider+1, term.length));
  return getText().substring(from, to);
}

export default getTermStr;
