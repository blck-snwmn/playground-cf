## Migration(local)

```bash
$ npx prisma migrate dev --create-only
$ npx prisma migrate deploy
$ npx prisma generate
```

## Migration(remote)
```bash
$ ./script.sh 
$ npx wrangler d1 migrations apply prisma-kysely-sample
```
