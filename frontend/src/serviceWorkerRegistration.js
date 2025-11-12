export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log("Service Worker registered:", registration.scope);
        })
        .catch(error => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .then(() => console.log("Service worker unregistered"));
  }
}