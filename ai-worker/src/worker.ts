import type { Ai } from "@cloudflare/ai";

export interface Env {
	AI: Ai;
}

export default {
	async fetch(request: Request, env: Env) {
		const messages = [
			{ role: "system", content: "You are a friendly assistant" },
			{
				role: "user",
				content: "What is the origin of the phrase Hello, World",
			},
		];

		const stream = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
			messages,
			stream: true,
		});

		return new Response(stream, {
			headers: { "content-type": "text/event-stream" },
		});
	},
};
