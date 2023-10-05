import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";

export default {
	async fetch(request, env, ctx) {
		const loader = new CheerioWebBaseLoader(
			"https://en.wikipedia.org/wiki/QUIC"
		);
		const docs = await loader.loadAndSplit();
		const store = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: env.OPENAI_API_KEY }));

		const model = new OpenAI({ openAIApiKey: env.OPENAI_API_KEY });
		const chain = RetrievalQAChain.fromLLM(model, store.asRetriever());

		const { searchParams } = new URL(request.url);
		const question = searchParams.get('question') ?? "Who developed the QUIC?";

		try {
			const res = await chain.call({
				query: question,
			});

			return new Response(res.text);
		} catch (e) {
			return new Response(e.message);
		}
	},
};
