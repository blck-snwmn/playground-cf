//biome-ignore lint/complexity/noBannedTypes: no banned types
export type Env = {};

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		return new Response("Hello World!");
	},
};