
export interface Env {
	app: Fetcher
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		console.log("gateway")
		return env.app.fetch(request.clone());
	},
};
