<script setup lang="ts">
// @ts-ignore
import CogIcon from "vue-material-design-icons/Cog.vue";
import { RouterLink } from "vue-router";
import { useURLStore } from "@/stores/url_settings";

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
        <kbd>C</kbd> key to continue. Some questions require you to type in a
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
      <dl>
        <dt v-if="url_settings.fetch?.url">Sending Data</dt>
        <dd v-if="url_settings.fetch?.url">
          When you have completed the questionnaire the data will be sent to
          <mark>{{
            url_settings.fetch?.url?.replace(/.+:\/\/([^/]+)\/?.*/, "$1")
          }}</mark
          >. This address should look similar to the email address or website
          address that you got this link from. It should also make sense with
          the banner you see at the top of the page while doing the
          questionnaire.
          <p>
            <strong
              >If you do not trust the source of the link that brought you to
              this site, do not continue.</strong
            >
          </p>
        </dd>
        <dt v-if="url_settings.content?.download">Saveable Data</dt>
        <dd v-if="url_settings.content?.download">
          When you have completed the questionnaire, you will be able to
          download and save a copy of the data it generates.
        </dd>
        <dt>Temporary Data</dt>
        <dd>
          This site stores a small amount of information on your computer to
          track your progress through the questionnaire. When you complete the
          questionnaire this information is removed.
        </dd>
      </dl>
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
    <footer class="card-footer d-flex justify-content-end pb-2">
      <router-link
        class="btn btn-primary"
        :to="$route.fullPath.replace(/^\//, '/tool')"
        data-click-on-key="c"
        ><kbd>C</kbd>ontinue</router-link
      >
    </footer>
  </main>
</template>
<style lang="scss"></style>
