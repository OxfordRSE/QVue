<script setup lang="ts">
import {getCurrentInstance} from "vue";
let spec_error = false;
try {
  const spec_64 = getCurrentInstance()?.proxy?.$route.query.spec;
  if (typeof spec_64 === "string") {
    const spec = atob(spec_64);
    const json = JSON.parse(spec);
  }
} catch (e) {
  console.error(e);
  spec_error = true;
}
</script>

<template>
  <div v-if="spec_error" class="text-bg-warning p-2">
    There was an error interpreting the specification used to customise this website.<br />
    Please contact whoever provided you with the link to this website and inform them of this.
  </div>
</template>

<style scoped lang="scss"></style>
