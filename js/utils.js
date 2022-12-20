function addKeyDown() {
  document.body.addEventListener("keydown", (evt) => {
    document
      .querySelectorAll(`.kbd-nav [data-click-on-key="${evt.key.toLowerCase()}"]`)
      .forEach((e) => {
        e.click();
      });
  });
}
