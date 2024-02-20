import { useState } from "hono/jsx";

export default function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div>
			<p>{count}</p>
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button onClick={() => setCount(count + 1)}>Increment</button>
		</div>
	);
}
