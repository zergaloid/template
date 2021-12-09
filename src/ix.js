@include ("https://cdnjs.cloudflare.com/ajax/libs/page.js/1.11.6/page.js")

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .catch((err) => console.error(err));
}