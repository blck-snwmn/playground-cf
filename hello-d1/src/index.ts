export interface Env {
	DB: D1Database
}

type memo = {
	content: string,
	user: string,
	tag: string,
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		switch (request.method) {
			case "GET":
				return list(env);
			case "POST":
				const { content, user, tag } = await request.json() as memo;
				return postMemo(env, content, user, tag);
			default:
				return new Response("Method not allowed", { status: 405 });
		}
	},
};

async function list(env: Env): Promise<Response> {
	const { results } = await env.DB.prepare("SELECT * FROM memos").all();
	return Response.json(results);
}

async function postMemo(env: Env, content: string, user: string, tag: string) {
	const { success } = await env.DB.
		prepare(`INSERT INTO memos (content, user, tag) VALUES (?, ?, ?)`).
		bind(content, user, tag).
		run();
	if (success) {
		return new Response("OK", { status: 200 });
	}
	return new Response("Internal Server Error", { status: 500 });
}
