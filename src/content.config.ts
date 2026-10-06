import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// Treat empty strings (from Keystatic / frontmatter placeholders) as unset.
const optionalString = z.preprocess((v) => (v === "" ? undefined : v), z.string().optional());

const blog = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		category: z.enum(["iac", "devops", "ai", "security", "finops", "saas", "network", "wordpress", "field"]),
		format: z.enum(["How-to", "Opinion", "War story", "Checklist"]),
		heroImage: optionalString,
		seoTitle: optionalString,
		seoDescription: optionalString,
		ogImage: optionalString,
		featured: z.boolean().default(false),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog };
