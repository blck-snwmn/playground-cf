import {
	type LoaderFunctionArgs,
	type MetaFunction,
	json,
	redirect,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{
			name: "description",
			content: "Welcome to Remix! Using Vite and Cloudflare!",
		},
	];
};

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
	// context.cloudflare.env
	console.log("in loader");
	return json({ message: "Hello, World!" });
};
export const action = async ({ context, params }: LoaderFunctionArgs) => {
	console.log("in action");
	return redirect("/");
};

export default function Index() {
	const result = useLoaderData<typeof loader>();
	console.log(`${JSON.stringify(result)} in index`);

	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Welcome to Remix (with Vite and Cloudflare)</h1>
			<ul>
				<li>
					<a
						target="_blank"
						href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
						rel="noreferrer"
					>
						Cloudflare Pages Docs - Remix guide
					</a>
				</li>
				<li>
					<a target="_blank" href="https://remix.run/docs" rel="noreferrer">
						Remix Docs
					</a>
				</li>
			</ul>
			<div>loader response: {JSON.stringify(result)}</div>
			<form action="/?index" method="post">
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
