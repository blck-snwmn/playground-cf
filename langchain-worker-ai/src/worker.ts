// @ts-nocheck

import type {
	VectorizeIndex,
	Fetcher,
	Request,
} from "@cloudflare/workers-types";

import { CloudflareVectorizeStore } from "langchain/vectorstores/cloudflare_vectorize";
import { CloudflareWorkersAIEmbeddings } from "langchain/embeddings/cloudflare_workersai";

export interface Env {
	VECTORIZE_INDEX: VectorizeIndex;
	AI: any;
}

export default {
	async fetch(request: Request, env: Env) {
		const { pathname } = new URL(request.url);
		const embeddings = new CloudflareWorkersAIEmbeddings({
			binding: env.AI,
			modelName: "@cf/baai/bge-small-en-v1.5",
		});
		const store = new CloudflareVectorizeStore(embeddings, {
			index: env.VECTORIZE_INDEX,
		});

		if (pathname === "/") {
			const results = await store.similaritySearch("hello", 1);
			return Response.json(results);
		}

		if (pathname === "/load") {
			// Upsertion by id is supported
			await store.addDocuments(
				[
					{
						pageContent: "hello",
						metadata: {
							url: "https://example.com/hello",
						},
					},
					{
						pageContent: "world",
						metadata: {
							url: "https://example.com/world",
						},
					},
					{
						pageContent: "hi",
						metadata: {
							url: "https://example.com/hi",
						},
					},
				],
				{ ids: ["id1", "id2", "id3"] }
			);
			return Response.json({ success: true });
		}

		if (pathname === "/clear") {
			await store.delete({ ids: ["id1", "id2", "id3"] });
			return Response.json({ success: true });
		}

		return Response.json({ error: "Not Found" }, { status: 404 });
	},
};