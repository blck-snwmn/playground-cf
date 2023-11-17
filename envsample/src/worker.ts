export interface Env {
	MY_VARIABLE: string;
	SHARED_VARIABLE: string;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		console.info("MY_VARIABLE", env.MY_VARIABLE);
		console.info("SHARED_VARIABLE", env.SHARED_VARIABLE);
		return new Response("Hello World!");
	},
};
