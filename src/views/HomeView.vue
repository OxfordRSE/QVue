<script setup lang="ts">
import { ref } from "vue";
// import type { Ref } from "vue";
import * as cis from "@/cis-r";
import CIS_Item from "@/components/CIS_Item.vue";
import ResultSheet from "@/components/ResultSheet.vue";

const state = ref(cis.CIS());
</script>

<template>
  <main class="container-sm">
    <CIS_Item
      v-if="state.current_item"
      :item="state.current_item"
      @answer="(ans) => state.next_q(ans)"
      @next="(ans) => state.next_q(ans)"
      @back="state.last_q()"
    />
    <ResultSheet v-else :content="state.data"/>
  </main>
</template>
