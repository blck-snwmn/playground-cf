# hello-d1
Cloudflare D1 sample

## Migrate(Local)
```bash
$ wrangler d1 execute sample --local --file=./db/db.sql 
```

check
```bash
$ wrangler d1 execute sample --local --command='SELECT * FROM memos'
```

## Deply
```bash
$ wrangler publish
```
