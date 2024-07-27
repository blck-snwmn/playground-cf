import { useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form, redirect, useActionData } from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const schema = z.object({
	name: z.string({ required_error: "name is required" }).max(50),
	email: z.string({ required_error: "email is required" }).email(),
	password: z.string({ required_error: "password is required" }).min(8),
});

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });
	if (submission.status !== "success") {
		return submission.reply();
	}
	if (submission.value.email !== "example@example.com") {
		return submission.reply({
			formErrors: ["email don't allow"],
		});
	}

	return redirect("/use");
}

export default function Page() {
	const lastResult = useActionData<typeof action>();
	const [form, fields] = useForm({
		lastResult,
		constraint: getZodConstraint(schema),
	});
	return (
		<Form method="POST" className="w-2/3 m-10">
			<div>{form.errors}</div>
			<div className="my-2">
				<label htmlFor={fields.name.id}>Name</label>
				<Input
					type="text"
					name={fields.name.name}
					id={fields.name.id}
					required={fields.name.required}
					defaultValue={fields.name.initialValue as string}
				/>
				<div>{fields.name.errors}</div>
			</div>
			<div className="my-2">
				<label htmlFor={fields.email.id}>Email</label>
				<Input
					type="email"
					name={fields.email.name}
					id={fields.email.id}
					required={fields.email.required}
					defaultValue={fields.email.initialValue as string}
				/>
				<div>{fields.email.errors}</div>
			</div>
			<div className="my-2">
				<label htmlFor={fields.password.id}>Password</label>
				<Input
					type="password"
					name={fields.password.name}
					id={fields.password.id}
					required={fields.password.required}
					minLength={fields.password.minLength}
					maxLength={fields.password.maxLength}
					defaultValue={fields.password.initialValue as string}
				/>
				<div>{fields.password.errors}</div>
			</div>
			<Button type="submit">Submit</Button>
		</Form>
	);
}
