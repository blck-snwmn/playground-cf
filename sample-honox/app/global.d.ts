import {} from "hono";

type Head = {
	title?: string;
};

declare module "hono" {
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	type Env = {};
	interface ContextRenderer {
		(
			content: string | Promise<string>,
			head?: Head,
		): Response | Promise<Response>;
	}
}
