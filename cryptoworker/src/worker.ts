// biome-ignore lint/complexity/noBannedTypes: sample
export type Env = {};

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		return new Response(crypto.randomUUID());
	},
};
