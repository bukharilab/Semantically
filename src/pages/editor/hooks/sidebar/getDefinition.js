import $ from 'jquery';

const getDefinition = url => new Promise((resolve, reject) =>
  $.ajax({
    method: "GET",
    url: url + "?apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f",
    dataType: "JSON",
    success: res => resolve(res['definition'][0] ? res['definition'][0] : 'No definitions found.'),
    error: res => resolve('Error retrieving definition.')
  })
);

export default getDefinition;