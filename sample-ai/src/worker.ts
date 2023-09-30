import { Ai } from '@cloudflare/ai'

export interface Env {
	AI: any;
}

export default {
	async fetch(request: Request, env: Env) {
		const url = new URL(request.url);
		const sys = url.searchParams.get('sys') ?? "math teacher"
		const user = url.searchParams.get('user') ?? "write your favorite formula"

		const ai = new Ai(env.AI);

		const messages = [
			{ role: 'system', content: sys },
			{ role: 'user', content: user }
		];
		const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages });

		return Response.json(response);
	},
};