export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		await env.WORKERTEST_QUEUE.send({
			key: "/key",
			value: "value",
		});
		return new Response("Accepted", { status: 202 });
	},

	async queue(batch, env, ctx) {
		for (const message of batch.messages) {
			message.ack();
		}
	},
} satisfies ExportedHandler<Env, QueueMessage>;
