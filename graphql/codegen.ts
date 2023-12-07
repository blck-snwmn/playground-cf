import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: "./schema.graphql",
	generates: {
		"src/gql/": {
			preset: "client",
			plugins: [],
		},
	},
};

export default config;
