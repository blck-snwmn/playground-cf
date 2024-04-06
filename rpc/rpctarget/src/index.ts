import { RpcTarget, WorkerEntrypoint } from "cloudflare:workers";

export type Env = {
	ENV: string;
};

export class EnvService extends WorkerEntrypoint<Env> {
	async envStr() {
		return this.env.ENV;
	}
}

export default {
	// An error occurs when deploying this worker without register event handlers as default export.
	async fetch() {
		return new Response("Healthy!");
	},
};
