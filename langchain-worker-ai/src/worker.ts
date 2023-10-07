// @ts-nocheck

import type {
	VectorizeIndex,
	Fetcher,
	Request,
} from "@cloudflare/workers-types";

import { Ai } from '@cloudflare/ai'
import { CloudflareVectorizeStore } from "langchain/vectorstores/cloudflare_vectorize";
import { CloudflareWorkersAIEmbeddings } from "langchain/embeddings/cloudflare_workersai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

export interface Env {
	VECTORIZE_INDEX: VectorizeIndex;
	AI: any;
}

export default {
	async fetch(request: Request, env: Env) {
		const { pathname } = new URL(request.url);
		if (pathname.startsWith("/favicon")) {
			// 404 for favicon
			return new Response('', { status: 404 });
		}

		const embeddings = new CloudflareWorkersAIEmbeddings({
			binding: env.AI,
			modelName: "@cf/baai/bge-small-en-v1.5",
		});
		const store = new CloudflareVectorizeStore(embeddings, {
			index: env.VECTORIZE_INDEX,
		});

		if (pathname === "/search") {
			const ai = new Ai(env.AI);

			const query = "What is Stream"
			const results = await store.similaritySearch(query, 5);
			console.log("results:", results);

			const pcs = results.map((result) => result.pageContent).join("\n");

			const messages = [
				{ role: 'user', content: query },
				{ role: 'system', content: "supplement\n" + pcs },
			];
			const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages });
			return Response.json(response);
		}

		if (pathname === "/load") {
			console.log("Loading documents...");
			const loader = new CheerioWebBaseLoader(
				"https://datatracker.ietf.org/doc/html/rfc9000",
				{
					selector: "#content"
				},
			);
			const docs = await loader.loadAndSplit();
			// docs.forEach((doc) => {
			// 	// show meetadata type
			// 	console.log(doc.metadata);
			// 	console.log(Object.keys(doc.metadata));
			// 	console.log("doc.metadata.loc:", doc.metadata.loc);
			// 	console.log("doc.metadata.loc keys:", Object.keys(doc.metadata.loc));
			// 	console.log("doc.metadata.loc.lines:", doc.metadata.loc.lines);
			// 	console.log("doc.metadata.loc.lines keys:", Object.keys(doc.metadata.loc.lines));

			// 	console.log(doc.pageContent);
			// 	console.log("===================")
			// });
			const nd = docs.map((doc) => {
				// remove metadata because metadata type is mismatched
				doc.metadata = null;
				return doc;
			})
			console.log("Loaded documents:", docs.length);
			const ids = await store.addDocuments(nd);
			return Response.json({ success: true });
		}

		return Response.json({ error: "Not Found" }, { status: 404 });
	},
};