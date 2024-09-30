import { cookies } from "next/headers";
import { useState } from "react";

export const User = ({ name }: { name: string }) => {
	return <h1>{name}</h1>;
};
