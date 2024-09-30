import { User } from "./User";

export const Users = () => {
	const names = ["Alice", "Bob", "Charlie"];
	return (
		<>
			{names.map((name) => (
				<User key={name} name={name} />
			))}
		</>
	);
};
