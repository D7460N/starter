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
// https://6987f917780e8375a6874dcf.mockapi.io/nav
// https://6987f917780e8375a6874dcf.mockapi.io/home
// https://6987f917780e8375a6874dcf.mockapi.io/about
// https://6987f917780e8375a6874dcf.mockapi.io/events
// https://6987f917780e8375a6874dcf.mockapi.io/products
// https://6987f917780e8375a6874dcf.mockapi.io/contact

// https://6987f917780e8375a6874dcf.mockapi.io/banner-top
// https://6987f917780e8375a6874dcf.mockapi.io/header
// https://6987f917780e8375a6874dcf.mockapi.io/footer
// https://6987f917780e8375a6874dcf.mockapi.io/banner-bottom
