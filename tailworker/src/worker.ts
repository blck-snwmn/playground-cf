export interface Env {
	TAIL_SAMPLE: KVNamespace;
	SQUEUE: Queue;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		return new Response("Hello World!");
	},

	async tail(events: TraceItem[], env: Env, ctx: ExecutionContext) {
		await env.TAIL_SAMPLE.put("trace", JSON.stringify(events));

		await env.SQUEUE.send({
			type: "chat.postMessage",
			body: {
				channel: "channel_id",
				text: "hello",
			},
		});
	},
};
