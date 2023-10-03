## Local
### Put object
```bash
wrangler r2 object get p-cache-bucket/key-id-xxxxxx.png -f key-id-xxxxxx.png --local
```

### Run
```bash
wrangler dev
```

## Remote(not local)
### Create buckets
```bash
wrangler r2 bucket create cache-bucket
```

### Put object
```bash
wrangler r2 object get cache-bucket/key-id-xxxxxx.png -f key-id-xxxxxx.png
```

### Deploy
```bash
wrangler deploy
```