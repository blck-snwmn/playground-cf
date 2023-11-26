import { XMLParser } from "fast-xml-parser";
export type Env = {
	URL: string;
};

type XMLContemt = {
	RDF: {
		item: XMLItem[];
	};
};

type XMLItem = {
	title: string;
	date: string;
	link: string;
};

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const resp = await fetch(env.URL);
		if (!resp.ok) {
			return new Response("Error");
		}
		const text = await resp.text();

		const parser = new XMLParser({
			removeNSPrefix: true,
		});
		const json: XMLContemt = parser.parse(text);

		const items: XMLItem[] = [];
		for (const i of json.RDF.item) {
			items.push({
				title: i.title,
				date: i.date,
				link: i.link,
			});
		}

		return new Response(JSON.stringify(items));
	},
};
