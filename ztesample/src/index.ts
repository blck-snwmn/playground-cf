import { Hono } from "hono";
import * as jose from "jose";

type Bindings = {
	TEAM_NAME: string;
	APP_AUD: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/jwt", async (c) => {
	console.log("jwt");
	const token = c.req.raw.headers.get("cf-access-jwt-assertion");
	if (!token) {
		return c.json({ error: "no token" }, { status: 400 });
	}
	const jwksURL = new URL(
		`https://${c.env.TEAM_NAME}.cloudflareaccess.com/cdn-cgi/access/certs`,
	);
	const jwks = jose.createRemoteJWKSet(jwksURL);
	try {
		const { payload, protectedHeader } = await jose.jwtVerify(token, jwks, {
			algorithms: ["RS256"],
			audience: c.env.APP_AUD,
		});
		console.log("jwt verified");
		return c.json({ message: "success" });
	} catch (error) {
		console.log(error);
		return c.json({ error: "invalid token" }, { status: 400 });
	}
});

export default app;
