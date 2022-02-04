if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./misc/sw.js')
    .catch((err) => console.error(err));
}