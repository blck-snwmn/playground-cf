export interface Env {
	VECTORIZE_INDEX: VectorizeIndex;
}


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		let path = new URL(request.url).pathname;
		if (path.startsWith("/favicon")) {
			return new Response('', { status: 404 });
		}

		if (path.startsWith("/insert")) {
			const sampleVectors: Array<VectorizeVector> = [
				{ id: '1', values: [22.4, 74.1, 3.2], metadata: { url: '/item/official/123123' } },
				{ id: '2', values: [15.1, 19.2, 15.8], metadata: { url: 'item/users/412321' } },
				{ id: '3', values: [54.8, 5.5, 23.1], metadata: { url: 'item/official/3343123' } },
				{ id: '4', values: [1.1, 2.2, 83.3], metadata: { url: 'item/official/443431' } },
				{ id: '5', values: [199, 43.2, 10.3], metadata: { url: 'choice/dogs/2333' } },
			];

			let inserted = await env.VECTORIZE_INDEX.upsert(sampleVectors);

			return Response.json(inserted);
		}

		const queryVector: Array<number> = [17.8, 5.5, 3.1];

		const matches = await env.VECTORIZE_INDEX.query(queryVector, { topK: 3, returnVectors: true });

		return Response.json({
			matches: matches,
		});
	},
};