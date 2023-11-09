export interface Env {
	TAIL_SAMPLE: KVNamespace
}

export default {
	async tail(events: TraceItem[], env: Env, ctx: ExecutionContext) {
		await env.TAIL_SAMPLE.put('trace', JSON.stringify(events));
	},
};
