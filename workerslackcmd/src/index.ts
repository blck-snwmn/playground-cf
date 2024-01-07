export interface Env {
	TOKEN: string
}

interface SlackWebhookRequest {
	team_id: string | null;
	team_domain: string | null;
	channel_id: string | null;
	channel_name: string | null;
	user_id: string | null;
	user_name: string | null;
	command: string | null;
	text: string | null;
	api_app_id: string | null;
	is_enterprise_install: string | null;
	response_url: string | null;
	trigger_id: string | null;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const form = await request.formData();
		const token = form.get("token");
		if (env.TOKEN !== token) {
			// unmatch verification token
			return new Response("failed to process", { status: 400 })
		}
		const sreq: SlackWebhookRequest = {
			team_id: form.get("team_id"),
			team_domain: form.get("team_domain"),
			channel_id: form.get("channel_id"),
			channel_name: form.get("channel_name"),
			user_id: form.get("user_id"),
			user_name: form.get("user_name"),
			command: form.get("command"),
			text: form.get("text"),
			api_app_id: form.get("api_app_id"),
			is_enterprise_install: form.get("is_enterprise_install"),
			response_url: form.get("response_url"),
			trigger_id: form.get("trigger_id"),
		};
		console.log(sreq)
		return new Response(JSON.stringify({
			response_type: "in_channel", // set ephemeral if only user who ran slack cmd can see the post
			blocks: [
				{
					type: "header",
					text: {
						type: "plain_text",
						text: "hello world"
					}
				},
				{
					type: "section",
					text: {
						type: "mrkdwn",
						text: "this is mrkdwn"
					}
				},
				{
					type: "section",
					text: {
						type: "mrkdwn",
						text: "this is mrkdwn2"
					}
				},
				{
					type: "context",
					elements: [
						{
							type: "plain_text",
							text: "left"
						},
						{
							type: "plain_text",
							text: "right"
						}
					]
				}
			],
			attachments: [
				{
					color: "#008000",
					blocks: [
						{
							type: "section",
							text: {
								type: "plain_text",
								text: "this is mrkdwn"
							}
						},
					],
				},
				{
					color: "#ffff00",
					blocks: [
						{
							type: "section",
							text: {
								type: "mrkdwn",
								text: "• a\n• b\n• c"
							}
						},
					],
				},
				{
					color: "#ff0000",
					blocks: [
						{
							type: "section",
							text: {
								type: "mrkdwn",
								text: "this is mrkdwn"
							}
						},
					],
				}
			]
		}), {
			headers: {
				"Content-type": "application/json",
			}
		});
	},
};
