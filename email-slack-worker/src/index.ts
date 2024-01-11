
export interface Env {
  WEBHOOK_URL: string
  FORWARD_EMAIL: string
}

export default {
  async email(message: EmailMessage, env: Env, ctx: ExecutionContext) {
    const slack_resp = await fetch(env.WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(
        {
          response_type: "in_channel",
          blocks: [
            {
              type: "section",
              text: {
                type: "plain_text",
                text: `recieved an email from ${message.from}`
              }
            }
          ]
        }),
    })
    await message.forward(env.FORWARD_EMAIL);
  }
}