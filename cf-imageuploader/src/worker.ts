import { Hono } from 'hono'

type Bindings = {
	IMAGE_TOKEN: string
	ACCOUNT_ID: string
	UPLOAD_BUCKET: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

// app.use(async (c, next) => {
// 	console.log('before')
// 	if (c.req.method === 'POST') {
// 		console.log(`POST ${c.req.url} ${JSON.stringify(c.req.body)}`)
// 	}
// 	await next()
// 	console.log('after')
// })


app.get('/images', async (c) => {
	const fd = new FormData()
	fd.append('requireSignedURLs', 'false') // access uploaded image without signed url if false 
	fd.append('metadata', JSON.stringify({ uploader: 'images' }))

	console.log('account_id', c.env.ACCOUNT_ID)
	const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/images/v2/direct_upload`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${c.env.IMAGE_TOKEN}`,
		},
		body: fd
	})
	if (resp.status !== 200) {
		const txt = await resp.text()
		console.log(resp.status, txt)
		return c.json({ error: txt }, 500)
	}
	const jresp = await resp.json<{
		result: {
			id: string
			uploadURL: string
		}
	}>()
	const url = jresp.result.uploadURL

	return c.html(`
		<html>
			<body>
				<form action="${url}" method="post" enctype="multipart/form-data">
					<input type="file" id="myFile" name="file" />
					<input type="submit" />
				</form>
			</body>
		</html>
	`)
})


app.get('/r2', async (c) => {
	return c.html(`
		<html>
			<body>
				<form action="http://127.0.0.1:8787/r2" method="post" enctype="multipart/form-data">
					<input type="file" id="myFile" name="file" />
					<input type="submit" />
				</form>
			</body>
		</html>
	`)
})

app.post('/r2', async (c) => {
	const body = await c.req.parseBody();
	const f = body['file']

	// f が string の場合、bad requestにする
	if (typeof f === 'string') {
		return c.json({ error: 'bad request' }, 400)
	}
	try {
		// ファイルタイプはここでは気にしない
		const putobj = await c.env.UPLOAD_BUCKET.put("image", await f.arrayBuffer())
		const getonj = await c.env.UPLOAD_BUCKET.get(putobj.key)
		if (!getonj) {
			return c.json({ error: 'not found' }, 404)
		}
		return c.newResponse(getonj.body)
	} catch (e: any) {
		return c.json({ error: e.message }, 500)
	}
})

export default app
