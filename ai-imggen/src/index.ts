export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const inputs = {
			prompt:
				"Icon of a British Shorthair cat in profile warming up in a room.",
		};

		const response = await env.AI.run(
			"@cf/bytedance/stable-diffusion-xl-lightning",
			inputs,
		);

		return new Response(response, {
			headers: {
				"content-type": "image/png",
			},
		});
	},
};
