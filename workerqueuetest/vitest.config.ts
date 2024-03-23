import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
	test: {
		restoreMocks: true,
		poolOptions: {
			workers: {
				singleWorker: true,
				miniflare: {
					// Required to use `SELF.queue()`. This is an experimental
					// compatibility flag, and cannot be enabled in production.
					compatibilityFlags: ["service_binding_extra_handlers"],
					queueConsumers: {
						// queue name
						workerqueuetest: { maxBatchTimeout: 0.05 /* 50ms */ },
					},
				},
				wrangler: {
					configPath: "./wrangler.toml",
				},
			},
		},
	},
});
