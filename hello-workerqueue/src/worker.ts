export interface Env {
	MY_QUEUE: Queue<Message>;
}

type Message = {
	url: string;
	method: string;
	headers: Record<string, string>;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		let message = {
			url: request.url,
			method: request.method,
			headers: Object.fromEntries(request.headers),
		};
		await env.MY_QUEUE.send(message);

		return new Response('ok');
	},

	async queue(
		batch: MessageBatch<Message>,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {
		console.log(batch.queue)
		for (const message of batch.messages) {
			console.log(`Received:{
				id:${message.id},
				timestamp: ${message.timestamp},
				body: {
					url: ${message.body.url},
					method: ${message.body.method},
					headers: ${message.body.headers},
				}
			}`);
			message.ack();
		}
	},
};


