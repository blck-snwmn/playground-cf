import { SELF, fetchMock } from "cloudflare:test";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
	fetchMock.activate();
	fetchMock.disableNetConnect();
});

afterEach(() => fetchMock.assertNoPendingInterceptors());

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Hello World worker", () => {
	it("mocks GET requests", async () => {
		fetchMock
			.get("https://cloudflare.com")
			.intercept({ path: () => true })
			.reply(200, "😉");

		// Host `example.com` will be rewritten to `cloudflare.com` by the Worker
		const response = await SELF.fetch("https://example.com/once");
		expect(response.status).toBe(200);
		expect(await response.text()).toBe("😉");
	});
});
