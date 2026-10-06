import { getCollection, type CollectionEntry } from "astro:content";
import { existsSync } from "node:fs";
import { join } from "node:path";
import categoriesData from "../data/categories.json";

export type Post = CollectionEntry<"blog">;
export type Category = { slug: string; label: string; description: string };
export const categories: Category[] = categoriesData;

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug)!;

/** Drafts render in `astro dev` but never in production builds. */
export async function getPosts(): Promise<Post[]> {
	const all = await getCollection("blog", ({ data }) => import.meta.env.DEV || !data.draft);
	return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Includes drafts; only for the internal plan page. */
export async function getAllPostsIncludingDrafts(): Promise<Post[]> {
	const all = await getCollection("blog");
	return all.sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
}

/** words / 230 + code lines / 60, rounded, min 1. */
export function readMinutes(body = ""): number {
	let codeLines = 0;
	const prose = body.replace(/```[^\n]*\n([\s\S]*?)```/g, (_, code: string) => {
		codeLines += code.split("\n").length;
		return " ";
	});
	const words = prose.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 230 + codeLines / 60));
}

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const shortFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
export const formatDate = (d: Date) => dateFmt.format(d);
export const formatShortDate = (d: Date) => shortFmt.format(d);

/** True when a file exists under /public (checked at build time). */
export function publicFileExists(path?: string): boolean {
	if (!path) return false;
	return existsSync(join(process.cwd(), "public", path.replace(/^\//, "")));
}

export function absoluteUrl(path: string, site: URL | string = "https://sumankondla.com") {
	return new URL(path, site).toString();
}
