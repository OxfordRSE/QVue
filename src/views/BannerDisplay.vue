<script setup lang="ts">
import { useURLStore } from "@/stores/url_settings";
import { computed } from "vue";
import md from "markdown-it";
import attrs from "markdown-it-attrs";
const store = useURLStore();

defineProps<{ questionnaire_name: string }>();

const md_instance = md();
md_instance.use(attrs, { allowedAttributes: ['class'] });

const markdown = computed(() => {
  //@ts-ignore
  if (!store.branding?.banner_markdown) return "";
  try {
    //@ts-ignore
    return md_instance.render(store.branding.banner_markdown);
  } catch (e) {
    console.error(e);
    return "";
  }
});
</script>
<template>
  <header class="banner flex-sm-wrap">
    <div v-if="store.branding?.banner_img_src" class="navbar">
      <a v-if="store.branding.banner_href" :href="store.branding.banner_href">
        <img
          :src="store.branding.banner_img_src"
          :alt="store.branding.banner_img_alt || ''"
          :title="
            store.branding.banner_img_title ||
            store.branding.banner_img_alt ||
            ''
          "
        />
      </a>
      <img
        v-else
        :src="store.branding.banner_img_src"
        :alt="store.branding.banner_img_alt || ''"
        :title="
          store.branding.banner_img_title || store.branding.banner_img_alt || ''
        "
      />
    </div>
    <div v-else-if="store.branding?.banner_text" class="navbar">
      <a v-if="store.branding.banner_href" :href="store.branding.banner_href">
        {{ store.branding.banner_text }}
      </a>
      <span v-else>{{ store.branding.banner_text }}</span>
    </div>
    <div
      v-else-if="store.branding?.banner_markdown"
      v-html="markdown"
    />
    <h1 v-else>{{ questionnaire_name }}</h1>
  </header>
</template>
<style lang="scss">
header.banner {
  min-height: 3em;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  a:not(:hover) {
    color: inherit;
    text-decoration: none;
  }
  img {
    max-width: min(576px, 90vw);
  }
  h1 {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    img {
      max-height: 2em;
    }
  }
}
</style>
