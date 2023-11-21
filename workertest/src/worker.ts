export type Env = {
	NAME: string;
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
		return new Response("Hello World!");
	},
};
