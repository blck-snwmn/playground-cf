import { cookies } from "next/headers";
import { User } from "../_conponents/User";
import { Users } from "../_conponents/Users";

type Props = {
	searchParams: { name: string };
};

export default async function Page(props: Props) {
	console.log(props.searchParams.name);
	return (
		<>
			<Users />
			<User name={props.searchParams.name} />
		</>
	);
}
