function apiOnInput(url, options = {}) {
  return fetch(url, options)
    .then(r => r.json())
    .then(data => {
      console.log('apiOnInput: success');
      return data;
    })
    .catch(() => {
      console.error('apiOnInput: error');
      return null;
    });
}
