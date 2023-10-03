import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

export interface Env {
  SEB: SendEmail
  FROM: string
  TO: string
}
export default {
  async fetch(request: Request, env: Env) {
    const msg = createMimeMessage();
    msg.setSender(env.FROM);
    msg.setRecipient(env.TO);
    msg.setSubject("Look! No servers");
    msg.addMessage({
      contentType: "text/plain",
      data: "And no email service accounts and all for free too!",
    })

    const message = new EmailMessage(
      env.FROM,
      env.TO,
      msg.asRaw(),
    );

    try {
      await env.SEB.send(message);
    } catch (e: any) {
      new Response(e.message)
    }
    return new Response("Hello Send Email World!")
  }
}