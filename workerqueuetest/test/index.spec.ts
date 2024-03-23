import { afterEach, expect, it, vi } from "vitest";
import worker from "../src/index";
import {
	createExecutionContext,
	env,
	waitOnExecutionContext,
} from "cloudflare:test";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

afterEach(() => {
	vi.restoreAllMocks();
});

it("produces queue message with mocked send", async () => {
	// Intercept calls to `QUEUE_PRODUCER.send()`
	const sendSpy = vi
		.spyOn(env.WORKERTEST_QUEUE, "send")
		.mockImplementation(async () => {});

	// Enqueue job on queue
	const request = new IncomingRequest("https://example.com/key", {
		method: "POST",
		body: "value",
	});
	const ctx = createExecutionContext();
	const response = await worker.fetch(request, env, ctx);
	await waitOnExecutionContext(ctx);

	expect(response.status).toBe(202);
	expect(await response.text()).toBe("Accepted");

	// Check `QUEUE_PRODUCER.send()` was called
	expect(sendSpy).toBeCalledTimes(1);
	expect(sendSpy).toBeCalledWith({ key: "/key", value: "value" });
});

it("produces queue message with mocked consumer", async () => {
	const consumerSpy = vi
		.spyOn(worker, "queue")
		.mockImplementation(async () => {});

	const request = new IncomingRequest("https://example.com/key", {
		method: "POST",
		body: "another value",
	});
	const ctx = createExecutionContext();
	const response = await worker.fetch(request, env, ctx);
	await waitOnExecutionContext(ctx);

	expect(response.status).toBe(202);
	expect(await response.text()).toBe("Accepted");

	// Wait for consumer to be called
	await vi.waitUntil(() => consumerSpy.mock.calls.length > 0);
	expect(consumerSpy).toBeCalledTimes(1);
	const batch = consumerSpy.mock.lastCall?.[0];
	expect(batch).toBeDefined();
	expect(batch?.messages[0].body).toStrictEqual({
		key: "/key",
		value: "value",
	});
});
