export interface Env {
	DO: DurableObjectNamespace;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname !== "/do") {
			return new Response("Not Found", { status: 404 });
		}
		const id = env.DO.idFromName("sample");
		return env.DO.get(id).fetch(request);
	},
};

export class DOSample {
	state: DurableObjectState;
	storage: DurableObjectStorage;
	counter: number;
	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.storage = this.state.storage;
		this.counter = 0;
	}

	async fetch(request: Request, env: Env): Promise<Response> {
		const current = await this.storage.getAlarm();
		if (!current) {
			console.log("set alarm");
			await this.storage.setAlarm(Date.now() + 1000 * 10);
		} else {
			console.log("alarm already set");
		}
		return new Response("Hello World!");
	}

	async alarm() {
		console.log("alarm");
		this.counter += 1;
		console.log("counter", this.counter);
		if (this.counter < 3) {
			console.log("set alarm");
			await this.storage.setAlarm(Date.now() + 1000 * 10);
		} else {
			console.log("done");
		}
	}
}
