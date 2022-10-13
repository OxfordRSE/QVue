<script setup lang="ts"></script>

<template>
  <hr />
  <footer class="d-flex flex-column pb-2 text-light">
    <div class="p-2">Developed by:</div>
    <div
      class="d-flex mb-2 justify-content-evenly align-content-center text-center"
    >
      <a href="https://www.ox.ac.uk/">
        <img
          src="/oxweb-logo.gif"
          alt="University of Oxford logo"
          title="University of Oxford"
        />
      </a>
      <a href="https://oxfordhealthbrc.nihr.ac.uk/our-work/oxppl/">
        <img
          src="/ppl_logo.svg"
          alt="Precision Psychiatry Lab logo"
          title="Precision Psychiatry Lab"
        />
      </a>
      <a href="https://www.rse.ox.ac.uk/about/">
        <img
          src="/oxrse_logo.svg"
          alt="Oxford Research Software Engineering"
          title="Oxford Research Software Engineering"
        />
      </a>
    </div>
    <div class="p-2">With funding support from:</div>
    <div
      class="d-flex mb-2 justify-content-evenly align-content-center text-center"
    >
      <a href="https://www.nihr.ac.uk/">
        <img
          class="nihr"
          src="/nihr-master-logo.png"
          alt="National Institute for Health and Care Research logo"
          title="National Institute for Health and Care Research"
        />
      </a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
footer {
  background-color: #002147;
  font-size: small;
}
img {
  height: 6em;
  min-height: 25px;
  min-width: 25px;
}
img.nihr {
  background-color: var(--bs-white);
  margin: 0 0.5em;
  padding: 0.5em;
  max-width: calc(100% - 1em);
  height: unset;
}
</style>
