import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";

describe("Wrangler", () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev("./src/worker.ts", {
			vars: {
				NAME: "Cloudflare",
			},
			r2: [
				{
					binding: "MY_BUCKET",
					bucket_name: "my-bucket",
					preview_bucket_name: "my-bucket-preview",
				},
			],
			experimental: { disableExperimentalWarning: true },
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it("Should return Hello World", async () => {
		const res = await worker.fetch("/");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello World!");
	});

	it("Should return the environment variable", async () => {
		const res = await worker.fetch("/env");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Cloudflare");
	});

	// it("Should return 404", async () => {
	// 	const res = await worker.fetch("/buket");
	// 	expect(res.status).toBe(404);
	// 	expect(await res.text()).toBe("Not found");
	// });

	it("Should return 200 before put", async () => {
		const res = await worker.fetch("/buket", { method: "PUT" });
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("OK");

		const res2 = await worker.fetch("/buket");
		expect(res2.status).toBe(200);
		expect(await res2.text()).toBe("value");
	});
});
