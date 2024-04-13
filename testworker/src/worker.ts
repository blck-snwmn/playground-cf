export type Env = {
	NAME: string;
	MY_BUCKET: R2Bucket;
};

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		if (request.url.endsWith("/env")) {
			return new Response(env.NAME);
		}
		if (request.url.endsWith("/buket")) {
			if (request.method === "PUT") {
				const x = await env.MY_BUCKET.put("key", "value");
				if (!x) {
					// 500
					return new Response("Error", { status: 500 });
				}
				return new Response("OK", { status: 200 });
			}
			const x = await env.MY_BUCKET.get("key");
			if (!x) {
				return new Response("Not found", { status: 404 });
			}
			const headers = new Headers();
			x.writeHttpMetadata(headers);
			headers.set("etag", x.etag);

			return new Response(x.body, { headers });
		}
		return new Response("Hello World!");
	},
};
