import { Hono } from "hono";

type Bindings = {
	ACCOUNT_ID: string
	AUTH_TOKEN: string
}
type Variables = {
	url: string
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()
app.use("*", async (c, next) => {
	if (!c.env.AUTH_TOKEN) {
		return c.json({ error: "internal server error" }, {
			status: 500,
		})
	}
	if (!c.env.ACCOUNT_ID) {
		return c.json({ error: "internal server error" }, {
			status: 500,
		})
	}
	await next()
})

app.use("/lives", async (c, next) => {
	c.set("url", `https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/stream/live_inputs`)
	await next()
})

app.get("/lives", async (c) => {
	const resp = await fetch(c.var.url, {
		headers: {
			"Authorization": `Bearer ${c.env.AUTH_TOKEN}`
		}
	})
	const json = await resp.json()
	return c.json(json)
})

app.post("/lives", async (c) => {
	const resp = await fetch(c.var.url, {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${c.env.AUTH_TOKEN}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			meta: {
				name: "test",
				description: "test description",
			},
			mode: "off"
		}),
	})
	const json = await resp.json()
	return c.json(json)
})

export default app