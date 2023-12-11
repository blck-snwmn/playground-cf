import { Hono } from "hono";
import * as jose from "jose";

type Bindings = {
	JWK_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/jwt", async (c) => {
	console.log("jwt");
	const token = c.req.raw.headers.get("cf-access-jwt-assertion");
	if (!token) {
		return c.json({ error: "no token" }, { status: 400 });
	}
	const jwks = jose.createRemoteJWKSet(new URL(c.env.JWK_URL));
	const { payload, protectedHeader } = await jose.jwtVerify(token, jwks, {
		algorithms: ["RS256"],
	});
	console.log(payload);
	console.log(protectedHeader);
	return c.json({ payload, protectedHeader });
});

export default app;
