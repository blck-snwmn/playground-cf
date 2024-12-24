type message = {
	id: string;
	sended_at: number;
};

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const requestedAt = new Date();
		console.log(`Requested at: ${requestedAt.toISOString()}`);

		await env.playground_queue_delay.send(
			{
				id: crypto.randomUUID(),
				sended_at: requestedAt.getTime(),
			},
			{
				delaySeconds: 60, // 1 minute
			},
		);
		return new Response("success");
	},
	async queue(batch, env, ctx) {
		console.log("Received batch");
		for (const message of batch.messages) {
			console.log(`Received message: ${message.body.id}`);
			const sendDate = new Date(message.body.sended_at);
			console.log(`Sended at: ${sendDate.toISOString()}`);
			const now = new Date();
			console.log(`Received at: ${now.toISOString()}`);
			message.ack();
		}
	},
} satisfies ExportedHandler<Env, message>;
