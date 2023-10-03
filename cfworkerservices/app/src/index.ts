export interface Env {
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		console.log("app")
		return new Response("Hello Services!");
	},
};
