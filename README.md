# CIS-R

[![Build Vue](https://github.com/OxfordRSE/CIS-R/actions/workflows/build-vue.yml/badge.svg)](https://github.com/OxfordRSE/CIS-R/actions/workflows/build-vue.yml)
[![Pages](https://github.com/OxfordRSE/CIS-R/actions/workflows/pages.yml/badge.svg)](https://tools.oxrse.uk/)

## Customising user experience

When you route people to the CIS-R tool, you will usually want to customise their experience to allow you to
collect the data, to prevent their seeing the clinical output, or to provide your own thank-you message.
This is done through HTTP GET querystring parameters.

A `spec` argument should be appended to the URL, with JSON stringified content base-64 encoded.
The JSON should correspond to the following type definition:

```typescript
type URLOptions = {
  fetch?: { 
    url: string;
    headers?: {[key: string]: string};
    display?: string;
    silent?: boolean;
  } | null;
  content?: {
    custom?: string;
    summary?: boolean;
    download?: boolean;
    silent_fetch: boolean;
  };
  display?: {
    banner_img_src: string;
    banner_href?: string;
    banner_img_alt?: string;
    banner_img_title?: string;
  } | {
    banner_text: string;
    banner_href?: string;
  };
}
```

A detailed description of those parameters is given here for reference:

* `fetch`: if present, results are sent to the `fetch.url` address in JSON format, with `fetch.headers` as the headers.
  * `fetch.url` is your endpoint for handling the data. **Required** if `fetch` is specified.
  * `fetch.headers` should be used for authorisation and user identification. Unless overridden, "Content-Type" is specified as "application/json".
  * `fetch.display` is a human-readable name for your endpoint to display to the user.
  * `silent` will suppress upload feedback if set to `true`
    * Note: this will not suppress the confirmation dialogue before dispatch
    * Note: if this is `true` the user will not be notified if the upload fails!
* `content`: allows you to customise what the user sees at the end of the instrument:
  * `custom` can contain markdown-formatted text to display
  * `thank_you` will show a default thank you text
    * Note: if no content is specified, only this is displayed.
  * `summary` will show the instrument's summary results page if set to `true`
  * `download` will offer the user a download link if set to `true`
* `display`: allows customisation of the display
  * `banner_img_src` can contain a URL for an image to be used as the banner image
  * `banner_img_alt` alt text for banner image
  * `banner_img_title` title property for banner image (uses `banner_img_alt` if unset)
  * `banner_text` text for the banner (if `banner_img_src` is not set)
  * `banner_href` URL for the banner to hyperlink to
  * Note: either `banner_text` or `banner_img_src` should be set if `display` is specified.

### Example:

If we wish to have the site upload to `https://api.example.com/endpoint/` with a user identifier, 
we could set the JSON to something like:

```json
{
   "fetch": {
      "url": "https://api.example.com/endpoint/",
      "headers": {"User-Token": "user_0001", "Authorization": "bearer tkn_user_0001_abcdef123"},
      "display": "Example API Upload"
   },
   "content": {
      "custom": "# Thank you\n\nThank you for completing the CIS-R. A summary of your results is shown below.",
      "summary": true
   }
}
```

We would then stringify and base-64 encode this:

```js
const json_str = JSON.stringify(json);
const encoded = btoa(json_str);
```

The result is then appended to the URL, giving us the final URL of:
https://oxfordrse.github.io/CIS-R/?spec=eyJmZXRjaCI6eyJ1cmwiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbS9lbmRwb2ludC8iLCJoZWFkZXJzIjp7IlVzZXItVG9rZW4iOiJ1c2VyXzAwMDEiLCJBdXRob3JpemF0aW9uIjoiYmVhcmVyIHRrbl91c2VyXzAwMDFfYWJjZGVmMTIzIn0sImRpc3BsYXkiOiJFeGFtcGxlIEFQSSBVcGxvYWQifSwiY29udGVudCI6eyJjdXN0b20iOiIjIFRoYW5rIHlvdVxuXG5UaGFuayB5b3UgZm9yIGNvbXBsZXRpbmcgdGhlIENJUy1SLiBBIHN1bW1hcnkgb2YgeW91ciByZXN1bHRzIGlzIHNob3duIGJlbG93LiIsInN1bW1hcnkiOnRydWV9fQ==

## Data upload

When a `fetch` specification is provided, data are sent to your endpoint as a JSON with the following format:

```typescript
type body = {
  summary: string,
  key_data: {
    time: string,
    primary_diagnosis_code: number,
    primary_diagnosis_text: string,
    secondary_diagnosis_code: number,
    secondary_diagnosis_text: string,
    total_score: number 
  },
  items: {
    id: string, 
     question: string, 
     answer: {value: number, text?: string, utc_time: string}
  }[],
  datetime: string 
}
```

Those fields contain the following information:
* `summary`: HTML fragment summarising the instrument results
* `key_data`: 
  * `time`: UTC time string of when the instrument was finished
  * `primary_diagnosis_code`: code for primary diagnosis
  * `primary_diagnosis_text`: text description of primary diagnosis
  * `secondary_diagnosis_code`: code for secondary diagnosis
  * `secondary_diagnosis_text`: text description of secondary diagnosis
  * `total_score`: CIS-R total score
* `items`: a list of questions that were answered, where each question has:
  * `id`: question identifier
  * `question`: text of the question
  * `answer`: 
    * `value`: the value assigned to the answer
    * `text`: text label for the answer
    * `utc_time`: UTC time string of when the answer was submitted
* `datetime`: UTC time string of when the instrument was finished

Note that `summary` and `key_data` are conveniences; 
their content can be reproduced with a knowledge of the instrument and
the information in `items`. 

**Warning**: Allowing users to upload information can be dangerous.
A user can customise the fetch request because it comes from their computer,
but good-faith uploads will conform to the spec presented here.
Please ensure your endpoint appropriately sanitizes input.

## Development

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
