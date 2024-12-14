import { Hono } from "hono";
import ogp from "open-graph-scraper-lite";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const purl = url.searchParams.get("url");
		if (!purl) {
			return new Response("Missing URL parameter", { status: 400 });
		}
		const resp = await fetch(purl);
		const body = await resp.text();
		const options = { html: body };
		const meta = await ogp(options);
		console.log(meta.result);
		return new Response("Hello World!");
	},
} satisfies ExportedHandler<Env>;
