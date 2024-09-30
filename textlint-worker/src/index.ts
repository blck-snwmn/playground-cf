import { TextlintKernel } from "@textlint/kernel";
import markdownPlugin from "@textlint/textlint-plugin-markdown";
// @ts-ignore
import textlint from "textlint-rule-no-todo";

const kernel = new TextlintKernel();
const options = {
	filePath: "request.md",
	ext: ".md",
	plugins: [
		{
			pluginId: "@textlint/textlint-plugin-markdown",
			plugin: markdownPlugin,
			options: true,
		},
	],
	rules: [
		{
			ruleId: "no-todo",
			rule: textlint,
		},
	],
};

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const text = await request.text();
		const t = await kernel.lintText(text, options);
		console.debug(
			`linted: ${t.messages.length} messages. messages='${t.messages}'`,
		);

		return new Response(JSON.stringify(t.messages));
	},
} satisfies ExportedHandler<Env>;
