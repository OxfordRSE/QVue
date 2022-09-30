<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import * as cis from "@/cis-r";
import CIS_Item from "@/components/CIS_Item.vue";

const state: Ref<cis.State> = ref(cis.state);
</script>

<template>
  <main>
    <CIS_Item
      v-if="state.current_item"
      :item="state.current_item"
      @answer="record_answer"
      @next="(ans) => state.next_q(ans)"
      @back="state.last_q()"
    />
    <p v-else>No item to display.</p>
  </main>
</template>
