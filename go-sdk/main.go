package main

import (
	"context"
	"os"

	"github.com/cloudflare/cloudflare-go/v2"
	"github.com/cloudflare/cloudflare-go/v2/option"
	"github.com/cloudflare/cloudflare-go/v2/workers"
)

func main() {
	api := cloudflare.NewClient(option.WithAPIToken(os.Getenv("CF_API_TOKEN")))
	l, err := api.Workers.Scripts.List(
		context.Background(),
		workers.ScriptListParams{
			AccountID: cloudflare.String(os.Getenv("CF_ACCOUNT_ID")),
		},
	)
	if err != nil {
		panic(err)
	}
	for _, s := range l.Result {
		println(s.ID)
	}
}
