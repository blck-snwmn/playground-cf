type Param = "none" | "foo" | "bar";

export interface Env {
	PARAM: Param;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		console.log("PARAM:", env.PARAM);
		return new Response("Hello World!");
	},
};
