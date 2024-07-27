import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form, redirect, useActionData } from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const schema = z.object({
	name: z.string().max(50),
	email: z.string().email(),
	password: z.string().min(8),
});

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const body = Object.fromEntries(formData);
	const parsedBody = schema.safeParse(body);
	if (!parsedBody.success) {
		const error = parsedBody.error.flatten();
		return {
			body,
			formErrors: error.formErrors,
			fieldErrors: error.fieldErrors,
		};
	}
	return redirect("/none");
}

export default function Page() {
	const result = useActionData<typeof action>();
	return (
		<Form method="POST" className="w-2/3 m-10">
			<div>{result?.formErrors}</div>
			<div className="my-2">
				<label htmlFor="name">Name</label>
				<Input
					type="text"
					name="name"
					id="name"
					defaultValue={result?.body?.name as string | undefined}
				/>
				<div>{result?.fieldErrors?.name}</div>
			</div>
			<div className="my-2">
				<label htmlFor="email">Email</label>
				<Input
					type="email"
					name="email"
					id="email"
					defaultValue={result?.body?.email as string}
				/>
				<div>{result?.fieldErrors?.email}</div>
			</div>
			<div className="my-2">
				<label htmlFor="password">Password</label>
				<Input
					type="password"
					name="password"
					id="password"
					defaultValue={result?.body?.password as string}
				/>
				<div>{result?.fieldErrors?.password}</div>
			</div>
			<Button type="submit">Submit</Button>
		</Form>
	);
}
