import { config, fields, collection } from "@keystatic/core";
import categories from "./src/data/categories.json";

export default config({
	// Local files in `astro dev`; GitHub in production. Publishing commits to the repo,
	// and the Cloudflare build deploys it.
	// Set PUBLIC_KEYSTATIC_STORAGE=github in `astro dev` to run the one-time GitHub App setup (see ADMIN.md).
	storage:
		import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_STORAGE === "github"
			? { kind: "github", repo: "sumankondla-88/astro-blog-starter-template" }
			: { kind: "local" },
	ui: { brand: { name: "Suman Kondla · notes" } },
	collections: {
		posts: collection({
			label: "Posts",
			slugField: "title",
			path: "src/content/blog/*",
			format: { contentField: "content" },
			entryLayout: "content",
			columns: ["pubDate", "category", "draft"],
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				description: fields.text({
					label: "Description",
					description: "Card summary, article lede, and meta fallback.",
					multiline: true,
					validation: { isRequired: true },
				}),
				pubDate: fields.date({ label: "Publish date", validation: { isRequired: true } }),
				updatedDate: fields.date({ label: "Updated date" }),
				category: fields.select({
					label: "Category",
					options: categories.map((c) => ({ label: c.label, value: c.slug })),
					defaultValue: "devops",
				}),
				format: fields.select({
					label: "Format",
					options: [
						{ label: "How-to", value: "How-to" },
						{ label: "Opinion", value: "Opinion" },
						{ label: "War story", value: "War story" },
						{ label: "Checklist", value: "Checklist" },
					],
					defaultValue: "How-to",
				}),
				heroImage: fields.image({
					label: "Cover image",
					directory: "public/images/covers",
					publicPath: "/images/covers/",
				}),
				seoTitle: fields.text({ label: "SEO title", description: "About 60 characters. Empty uses the title.", validation: { length: { max: 70 } } }),
				seoDescription: fields.text({
					label: "SEO description",
					description: "About 155 characters. Empty uses the description.",
					multiline: true,
					validation: { length: { max: 180 } },
				}),
				ogImage: fields.image({
					label: "Social share image (1200×630)",
					description: "Empty falls back to the cover image, then the site default.",
					directory: "public/images/og",
					publicPath: "/images/og/",
				}),
				featured: fields.checkbox({ label: "Featured on the home page", defaultValue: false }),
				draft: fields.checkbox({
					label: "Draft",
					description: "Drafts are not built in production.",
					defaultValue: true,
				}),
				// Kept as .md so existing posts stay put. MDX parsing means no HTML tags or imports in the body.
				content: fields.mdx({ label: "Content", extension: "md" }),
			},
		}),
	},
});
