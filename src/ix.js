@include ("https://unpkg.com/page/page.js")
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .catch((err) => console.error(err));
}