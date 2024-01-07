import type { D1Database } from "@cloudflare/workers-types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import type { DB } from "./db/types";

export interface Env {
	DB: D1Database;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const db = new Kysely<DB>({
			dialect: new D1Dialect({ database: env.DB }),
		});
		if (request.method === "GET") {
			const posts = await db.selectFrom("Post").selectAll().execute();
			return Response.json(posts);
		}
		if (request.method === "POST") {
			await db
				.insertInto("Post")
				.values([
					{
						id: "1", // default value is not working because uuid() is not working in sqlite.
						title: "Hello, world!",
						body: "This is my first post!",
					},
				])
				.execute();
			return new Response("OK");
		}
		return new Response("Method not allowed", { status: 405 });
	},
};
