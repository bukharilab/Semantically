const sortKeys = (keys) => {
  return keys.sort((a, b) => {
    const from1 = a.substring(0, a.indexOf("-"));
    const from2 = b.substring(0, b.indexOf("-"));
    if (Number(from1) > Number(from2)) return 1;
    else if (Number(from2) > Number(from1)) return -1;
    else {
      const to1 = a.substring(a.indexOf("-")+1, a.length);
      const to2 = b.substring(b.indexOf("-")+1, b.length);
      if (Number(to1) > Number(to2)) return 1;
      if (Number(to2) > Number(to1)) return -1;
      else return -1;
    }
  });
}

export default sortKeys;
