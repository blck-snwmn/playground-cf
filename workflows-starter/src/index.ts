import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";

type Env = {
	// Add your bindings here, e.g. Workers KV, D1, Workers AI, etc.
	MY_WORKFLOW: Workflow;
};

// User-defined params passed to your workflow
type Params = {
	name: string;
	metadata: Record<string, string>;
};

export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
	async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
		// Can access bindings on `this.env`
		// Can access params on `event.params`

		const files = await step.do("my first step", async () => {
			// Fetch a list of files from $SOME_SERVICE
			return {
				inputParams: event,
				files: [
					"doc_7392_rev3.pdf",
					"report_x29_final.pdf",
					"memo_2024_05_12.pdf",
					"file_089_update.pdf",
					"proj_alpha_v2.pdf",
					"data_analysis_q2.pdf",
					"notes_meeting_52.pdf",
					"summary_fy24_draft.pdf",
				],
			};
		});

		const rand = await step.do("my second step", async () => {
			return {
				random: Math.random(),
			};
		});
		console.log(`Random number: ${rand.random}`);

		await step.sleep("wait on something", "10 seconds");

		const name = await step.do("return name", async () => {
			return {
				paramName: event.payload.name,
			};
		});

		await step.do(
			"make a call to write that could maybe, just might, fail",
			// Define a retry strategy
			{
				retries: {
					limit: 3,
					delay: "5 second",
					backoff: "exponential",
				},
				timeout: "15 minutes",
			},
			async () => {
				// Do stuff here, with access to the state from our previous steps
				if (Math.random() > 0.3) {
					throw new Error("API call to $STORAGE_SYSTEM failed");
				}
			},
		);
	}
}

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		const url = new URL(req.url);

		if (url.pathname.startsWith("/favicon")) {
			return Response.json({}, { status: 404 });
		}

		// Get the status of an existing instance, if provided
		const id = url.searchParams.get("instanceId");
		if (!id) {
			let name = url.searchParams.get("name");
			if (!name) {
				name = "John Doe";
			}

			// Spawn a new instance and return the ID and status
			const instance = await env.MY_WORKFLOW.create({
				params: {
					name: name,
				},
			});
			return Response.json({
				id: instance.id,
				details: await instance.status(),
			});
		}

		const instance = await env.MY_WORKFLOW.get(id);

		const retry = url.searchParams.get("retry");
		if (retry) {
			// if the instance errored, restart it
			const status = await instance.status();
			if (status.status === "errored") {
				// `restart` をしても `name` は引き継がれない
				await instance.restart();
			}
		}
		return Response.json({
			status: await instance.status(),
		});
	},
};
