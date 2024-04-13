//biome-ignore lint/complexity/noBannedTypes: no banned types
export type Env = {};

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		if (request.method !== "GET") {
			return new Response("Method Not Allowed", { status: 405 });
		}
		const url = new URL(request.url);

		let br = false;
		switch (url.pathname) {
			case "/":
				break;
			case "/br":
				br = true;
				break;
			default:
				return new Response("Not Found", { status: 404 });
		}

		const qURL = url.searchParams.get("url");
		if (qURL === null) {
			return new Response("Missing URL parameter", { status: 400 });
		}
		let options: RequestInitCfPropertiesImage = {
			// blur: 10,
			border: {
				color: "#43c5f5",
				width: 10,
			},
			background: "white",
		};
		if (br) {
			options = {
				...options,
				blur: 10,
			};
		}
		console.log(options);
		return await fetch(qURL, {
			cf: {
				image: options,
			},
		});
	},
};
