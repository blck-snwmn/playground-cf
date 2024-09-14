import * as jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

export interface Env {
	POLICY_AUD: string;
	TEAM_DOMAIN: string;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		// show each request headers
		for (const [key, value] of request.headers.entries()) {
			console.log(`${key}: ${value}`);
		}
		const token = request.headers.get("cf-access-jwt-assertion");
		if (!token) {
			return new Response("Missing token", { status: 401 });
		}
		const client = jwksClient({
			jwksUri: `${env.TEAM_DOMAIN}/cdn-cgi/access/certs`,
		});

		const getKey = (
			header: jwt.JwtHeader,
			callback: jwt.SigningKeyCallback,
		) => {
			client.getSigningKey(header.kid, (err, key) => {
				callback(err, key?.getPublicKey());
			});
		};
		const certsURL = `${env.TEAM_DOMAIN}/cdn-cgi/access/certs`;
		jwt.verify(token, getKey);
		return new Response("Hello World!");
	},
};
