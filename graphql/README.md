## Get type

install get-graphql-schema
```bash
npm install -g get-graphql-schema
```

```bash
get-graphql-schema https://api.cloudflare.com/client/v4/graphql --header "Authorization=Bearer <your key>" > schema.graphql
```

## Generate typescript types
```bash
pnpm add -D typescript @graphql-codegen/cli
npx graphql-code-generator init
pnpm run codegen
```

## Run 
```bash
export API_KEY=<your key>
export ACCOUNT_TAG=<your account tag>
./node_modules/.bin/ts-node --esm ./src/index.mts 
```