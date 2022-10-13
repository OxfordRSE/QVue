<script setup lang="ts">
// @ts-ignore
import CogIcon from "vue-material-design-icons/Cog.vue";
import { useURLStore } from "@/stores/url_settings";

defineProps<{ show_continue: boolean }>();

defineEmits<{
  (e: "okay"): void;
  (e: "resume"): void;
}>();

const url_settings = useURLStore();
</script>

<template>
  <main class="container-sm">
    <header class="card-header text-center">
      <h1>Welcome to the CIS-R</h1>
    </header>
    <div class="card-body">
      <h2>About the tool:</h2>
      <p>
        This tool will guide you through completing the CIS-R. The CIS-R is a
        questionnaire used by researchers to characterise mental health
        difficulties.
      </p>
      <h2>Using the tool:</h2>
      <p>
        You will be asked a series of questions. You can answer these questions
        by clicking on the relevant answer, or pressing the key on the keyboard
        that corresponds to the symbol next to the answer. For example, when you
        have read this page, you can use the
        <kbd>B</kbd> key to continue. Some questions require you to type in a
        response.
      </p>
      <p>
        When you enter a response, the next question will appear after a short
        delay. You can customise this delay at any time during the questionnaire
        using the <CogIcon title="settings" /> icon.
      </p>
      <h2>Data collection:</h2>
      <p>
        The tool will not collect any data itself, but it will create some data
        you need to know about:
      </p>
      <details v-if="url_settings.fetch?.url">
        <summary><h3>Sending Data</h3></summary>
        <p>
          When you have completed the questionnaire the data will be sent to
          <mark>{{
            url_settings.fetch?.url?.replace(/.+:\/\/([^/]+)\/?.*/, "$1")
          }}</mark
          >. This address should look similar to the email address or website
          address that you got this link from. It should also make sense with
          the banner you see at the top of the page while doing the
          questionnaire.
        </p>
        <p>
          <strong
            >If you do not trust the source of the link that brought you to this
            site, do not continue.</strong
          >
        </p>
      </details>
      <details v-if="url_settings.content?.download">
        <summary><h3>Saveable Data</h3></summary>
        <p>
          When you have completed the questionnaire, you will be able to
          download and save a copy of the data it generates.
        </p>
      </details>
      <details>
        <summary><h3>Temporary Data</h3></summary>
        <p>
          This site stores a small amount of information on your computer to
          track your progress through the questionnaire. When you complete the
          questionnaire this information is removed.
        </p>
      </details>
      <h2>Note:</h2>
      <p>
        Once you pass this page, your user experience will be customised by
        whoever provided the link to this website.
      </p>
      <p>
        <strong
          >If you do not trust the source of the link that brought you to this
          site, do not continue.</strong
        >
      </p>
    </div>
    <footer class="card-footer d-flex justify-content-around pb-2">
      <button
        class="btn"
        :class="show_continue ? 'btn-outline-primary' : 'btn-primary'"
        data-click-on-key="b"
        @click="$emit('okay')"
      >
        <kbd>B</kbd>egin
      </button>
      <button
        v-if="show_continue"
        class="btn btn-primary"
        data-click-on-key="r"
        @click="$emit('resume')"
      >
        <kbd>R</kbd>esume
      </button>
    </footer>
  </main>
</template>

<style scoped lang="scss">
h3 {
  display: inline-block;
  font-size: calc(0.9rem + 0.6vw);
}
</style>
