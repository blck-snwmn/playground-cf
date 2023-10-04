import { Ai } from '@cloudflare/ai';

export interface Env {
	TEXT_EMBEDDINGS: VectorizeIndex;
	AI: any;
}

interface EmbeddingResponse {
	shape: number[];
	data: number[][];
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const ai = new Ai(env.AI);
		let path = new URL(request.url).pathname;
		if (path.startsWith('/favicon')) {
			return new Response('', { status: 404 });
		}

		if (path === '/insert') {
			const stories = [
				'There is one sword here.',
				'This sword is very sharp.',
				'There is one shield here.',
				'This shield is very heavy.',
				'There is one helmet here.',
				'This helmet is very light.',
				'There is one dagger here.',
				'This dagger is very small.',
				'There is one axe here.',
				'This axe is very big.',
				'There is one bow here.',
				'This bow is very long.',
				'There is one arrow here.',
				'This arrow is very thin.',
				'There is one spear here.',
				'This spear is very long.',
				'These weapons had no owners.',
				'These weapons were very old.',
			];
			const modelResp: EmbeddingResponse = await ai.run('@cf/baai/bge-base-en-v1.5', {
				text: stories,
			});

			let vectors: VectorizeVector[] = [];
			let id = 1;
			modelResp.data.forEach((vector) => {
				vectors.push({ id: `${id}`, values: vector, metadata: { story: stories[id - 1] } });
				id++;
			});

			let inserted = await env.TEXT_EMBEDDINGS.upsert(vectors);
			return Response.json(inserted);
		}

		let userQuery = 'owners';
		const queryVector: EmbeddingResponse = await ai.run('@cf/baai/bge-base-en-v1.5', {
			text: [userQuery],
		});

		const matches = await env.TEXT_EMBEDDINGS.query(queryVector.data[0], { topK: 1 });
		// get the metadata for the top match
		const vector = await env.TEXT_EMBEDDINGS.getByIds([matches.matches[0].vectorId]);
		return Response.json({
			matches: matches,
			metadata: vector[0].metadata,
		});
	},
};
