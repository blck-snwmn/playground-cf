//biome-ignore lint/complexity/noBannedTypes: no banned types
export type Env = {};

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const resp = await fetch("https://cloudflare.com");
		const text = await resp.text();
		return new Response(text, { status: resp.status });
	},
};
