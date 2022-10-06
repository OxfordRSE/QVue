function addKeyDown() {
  document.body.addEventListener("keydown", (evt) => {
    document
      .querySelectorAll(`[data-click-on-key="${evt.key.toLowerCase()}"]`)
      .forEach((e) => {
        e.click();
      });
  });
}
