// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import cloudflare from "@astrojs/cloudflare";
import { remarkNote } from "./src/plugins/remark-note.mjs";

// https://astro.build/config
export default defineConfig({
	site: "https://sumankondla.com",
	markdown: { remarkPlugins: [remarkNote] },
	integrations: [
		expressiveCode({
			themes: ["github-dark", "github-light"],
			themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
			useDarkModeMediaQuery: false,
			styleOverrides: {
				borderColor: "var(--line)",
				borderRadius: "12px",
				codeBackground: "var(--code-bg)",
				codeFontFamily: "'JetBrains Mono', ui-monospace, monospace",
				codeFontSize: "13px",
				codeLineHeight: "1.65",
				codePaddingBlock: "16px",
				codePaddingInline: "18px",
				frames: {
					frameBoxShadowCssValue: "none",
					editorTabBarBackground: "var(--code-bg)",
					editorActiveTabBackground: "var(--code-bg)",
					editorActiveTabForeground: "var(--muted)",
					editorActiveTabBorderColor: "transparent",
					editorActiveTabIndicatorHeight: "0px",
					editorTabBarBorderBottomColor: "var(--line)",
					editorTabBorderRadius: "0",
					terminalTitlebarBackground: "var(--code-bg)",
					terminalTitlebarForeground: "var(--muted)",
					terminalTitlebarBorderBottomColor: "var(--line)",
					terminalBackground: "var(--code-bg)",
				},
			},
		}),
		mdx(),
		sitemap({ filter: (page) => !page.includes("/plan/") }),
	],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
