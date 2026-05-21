# GB Search Widget

Web component micro-frontend built with React + Vite.

## Local development

```bash
yarn install
yarn dev
```

## Build output

```bash
yarn build
```

Artifacts are generated in `dist/`:

- `dist/gb-search-widget.js` (web component script)
- `dist/index.html` (simple hosted demo page from `public/index.html`)

## Deploy to GitHub Pages

A GitHub Actions workflow is included at `.github/workflows/deploy-pages.yml`.

### One-time GitHub repo setup

1. Push this project to GitHub.
2. In GitHub: `Settings -> Pages`.
3. Set `Source` to `GitHub Actions`.
4. Make sure your default branch is `main` (or update the workflow branch trigger).

After that, every push to `main` builds and deploys `dist/` automatically.

## Use in Nuxt (host app)

Load the hosted script once on the client, then use the custom element.

```ts
// plugins/gb-search-widget.client.ts
export default defineNuxtPlugin(() => {
  const src =
    "https://<github-username>.github.io/<repo-name>/gb-search-widget.js";

  if (document.querySelector(`script[src=\"${src}\"]`)) return;

  const script = document.createElement("script");
  script.type = "module";
  script.src = src;
  document.head.appendChild(script);
});
```

```vue
<!-- components/SearchWidgetHost.vue -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

type SearchState = {
  query: string;
  filters: string[];
  source: "gb-search-widget";
  version: "1.0.0";
};

const elRef = ref<HTMLElement | null>(null);

const onStateChange = (event: Event) => {
  const detail = (event as CustomEvent<SearchState>).detail;
  // Update Pinia store here
  // e.g. searchStore.setState(detail)
  console.log("widget state", detail);
};

onMounted(() => {
  window.addEventListener("gb-search-widget-state-change", onStateChange);
});

onBeforeUnmount(() => {
  window.removeEventListener("gb-search-widget-state-change", onStateChange);
});
</script>

<template>
  <ClientOnly>
    <gb-search-widget ref="elRef" brand="Golfbreaks" />
  </ClientOnly>
</template>
```

## Event contract exposed by widget

- `gb-search-widget-state-change`
- `gb-search-state`
- `gb-search`

Each event emits:

```ts
{
  query: string;
  filters: string[];
  source: "gb-search-widget";
  version: "1.0.0";
}
```
