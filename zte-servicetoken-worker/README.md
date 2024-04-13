# hello-cf-servicetoken

## Setting
Please follow these steps:
1. Create a service token in the Cloudflare Zero Trust console.
2. After the service token is issued, note down the "Header and client ID" and "Header and client secret".
3. To set up the access policy for the service token, do the following:
  - Register a DNS record in the Cloudflare website settings.
  - Set the policy for the target application in the Cloudflare Zero Trust console.

## Deploy
deploy the Worker with the following command:
```bash
wrangler deploy
```

## Run
Set the "Header and client ID" and "Header and client secret" you noted down earlier in the headers and access the registered domain.
perl

```bash
curl https://<your-domain> -H 'CF-Access-Client-Id: <your-client-id>' -H 'CF-Access-Client-Secret: <your-client-secret>'
```
