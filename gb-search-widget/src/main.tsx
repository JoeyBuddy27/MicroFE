// src/main.tsx
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { createRoot, type Root } from "react-dom/client";
import { SearchWidget } from "./SearchWidget";

class GbSearchWidget extends HTMLElement {
  private root?: Root;
  private cacheElement?: HTMLStyleElement;

  private theme = createTheme({
    palette: {
      primary: { main: "#0f7a52" },
      secondary: { main: "#0f4264" },
      background: {
        default: "#f4fbf8",
        paper: "#ffffff",
      },
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily: '"Nunito", "Segoe UI", sans-serif',
    },
  });

  connectedCallback() {
    if (this.root) return;

    const mountPoint = document.createElement("div");
    const shadow = this.attachShadow({ mode: "open" });
    this.cacheElement = document.createElement("style");

    shadow.appendChild(this.cacheElement);
    shadow.appendChild(mountPoint);

    this.root = createRoot(mountPoint);
    const cache = createCache({
      key: "gb-search-widget",
      prepend: true,
      container: this.cacheElement,
    });

    this.root.render(
      <CacheProvider value={cache}>
        <ThemeProvider theme={this.theme}>
          <CssBaseline />
          <SearchWidget brand={this.getAttribute("brand") ?? undefined} />
        </ThemeProvider>
      </CacheProvider>,
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = undefined;
  }
}

if (!customElements.get("gb-search-widget")) {
  customElements.define("gb-search-widget", GbSearchWidget);
}
