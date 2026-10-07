import { getCollection, type CollectionEntry } from "astro:content";
import { existsSync } from "node:fs";
import { join } from "node:path";
import categoriesData from "../data/categories.json";
import scheduleData from "../data/schedule.json";

export type Post = CollectionEntry<"blog">;
export type Category = { slug: string; label: string; description: string };
export const categories: Category[] = categoriesData;

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug)!;

type Schedule = { enabled?: boolean; startDate?: string; skipWeekends?: boolean; posts?: string[] };
const schedule = scheduleData as Schedule;

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Publishing schedule (admin: Publishing schedule). When enabled, the nth post in the list goes live
 * n days after the start date (optionally skipping weekends). Returns slug -> publish date (UTC midnight).
 */
function scheduledDates(): Map<string, Date> {
	const out = new Map<string, Date>();
	if (!schedule.enabled || !schedule.startDate) return out;
	const day = new Date(`${schedule.startDate}T00:00:00Z`);
	if (Number.isNaN(day.valueOf())) return out;
	for (const slug of schedule.posts ?? []) {
		while (schedule.skipWeekends && [0, 6].includes(day.getUTCDay())) day.setUTCDate(day.getUTCDate() + 1);
		out.set(slug, new Date(day));
		day.setUTCDate(day.getUTCDate() + 1);
	}
	return out;
}

/** The post with its scheduled date applied, if it is on the schedule. */
function withSchedule(post: Post, dates: Map<string, Date>): Post {
	const date = dates.get(post.id);
	return date ? { ...post, data: { ...post.data, pubDate: date } } : post;
}

/**
 * Posts that are live. Drafts never publish in production, and a scheduled post stays hidden until its
 * day. `astro dev` shows everything so you can preview. The site is rebuilt daily to pick up new days.
 */
export async function getPosts(): Promise<Post[]> {
	const dates = scheduledDates();
	const today = dayKey(new Date());
	const all = await getCollection("blog", ({ data, id }) => {
		if (import.meta.env.DEV) return true;
		if (data.draft) return false;
		const when = dates.get(id);
		return !when || dayKey(when) <= today;
	});
	return all.map((p) => withSchedule(p, dates)).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Includes drafts and unpublished days; only for the internal plan page. */
export async function getAllPostsIncludingDrafts(): Promise<Post[]> {
	const dates = scheduledDates();
	const all = await getCollection("blog");
	return all.map((p) => withSchedule(p, dates)).sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
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

/** Cover path: explicit heroImage, else the /images/covers/<slug>.jpg convention. */
export const coverPath = (post: Post) => post.data.heroImage || `/images/covers/${post.id}.jpg`;

/** True when a file exists under /public (checked at build time). */
export function publicFileExists(path?: string): boolean {
	if (!path) return false;
	return existsSync(join(process.cwd(), "public", path.replace(/^\//, "")));
}

export function absoluteUrl(path: string, site: URL | string = "https://sumankondla.com") {
	return new URL(path, site).toString();
}
