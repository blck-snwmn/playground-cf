
export interface Env {
	CACHE_BUCKET: R2Bucket;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		const r2Key = 'key-id-xxxxxx.png'
		const cacheKey = `${url.origin}/${r2Key}`

		const cache = caches.default;
		const cacheObj = await cache.match(cacheKey)
		if (cacheObj) {
			return cacheObj
		}
		const object = await env.CACHE_BUCKET.get(r2Key);
		if (object === null) {
			return new Response('Not Found', { status: 404 });
		}
		const resp = new Response(object.body, {
			status: 200,
			headers: {
				'Content-Type': object.httpMetadata?.contentType ?? "application/octet-stream"
			}
		});
		await cache.put(cacheKey, resp.clone())
		return resp
	},
};
