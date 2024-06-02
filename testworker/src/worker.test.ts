import { SELF } from "cloudflare:test";
import { describe, expect, it, test } from "vitest";

import "./worker";

describe("Wrangler", () => {
	it("Should return Hello World", async () => {
		const res = await SELF.fetch("http://localhost:8787/");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello World!");
	});

	it("Should return the environment variable", async () => {
		const res = await SELF.fetch("http://localhost:8787/env");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Cloudflare");
	});

	// it("Should return 404", async () => {
	// 	const res = await worker.fetch("/buket");
	// 	expect(res.status).toBe(404);
	// 	expect(await res.text()).toBe("Not found");
	// });

	it("Should return 200 before put", async () => {
		const res = await SELF.fetch("http://localhost:8787/buket", {
			method: "PUT",
		});
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("OK");

		const res2 = await SELF.fetch("http://localhost:8787/buket");
		expect(res2.status).toBe(200);
		expect(await res2.text()).toBe("value");
	});
});
