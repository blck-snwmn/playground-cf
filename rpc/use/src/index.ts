import type { EnvService } from "../../rpctarget/src/index";

export type Env = {
	RPC: Service<EnvService>;
};

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		return new Response(await env.RPC.envStr());
	},
};
