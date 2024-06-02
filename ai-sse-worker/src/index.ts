import type { Ai } from "@cloudflare/ai";
import { events } from "fetch-event-stream";
import { Hono } from "hono";
import { streamText } from "hono/streaming";

type Bindings = {
	AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
	const messages = [
		{ role: "system", content: "You are a friendly assistant" },
		{
			role: "user",
			content: "What is the origin of the phrase Hello, World",
		},
	];

	const apiStream = (await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
		messages,
		stream: true,
	})) as ReadableStream;

	return streamText(c, async (stream) => {
		const chunks = events(new Response(apiStream));
		for await (const chunk of chunks) {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const data = JSON.parse(chunk.data!);
			stream.write(data.response);
		}
	});
});

export default app;
