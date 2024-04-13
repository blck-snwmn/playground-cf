import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
	test: {
		poolOptions: {
			workers: {
				miniflare: {
					bindings: {
						NAME: "Cloudflare",
					},
				},
				wrangler: { configPath: "./wrangler.toml" },
			},
		},
	},
});
