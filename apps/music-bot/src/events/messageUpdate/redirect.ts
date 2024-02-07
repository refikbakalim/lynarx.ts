import type { Client, Message } from "discord.js";
import { ChannelType } from "discord.js";
import { DevIds } from "#bot/utils/constants";

export default async (
	oldMessage: Message,
	newMessage: Message,
	client: Client<true>
) => {
	if (newMessage.author == client.user) return;
	if (newMessage.channel.type != ChannelType.DM) return;

	const dev = await client.users.fetch(DevIds.users[0]);

	if (!dev) return console.log("Can not find the dev");

	dev.send(
		`${newMessage.author}: "${oldMessage.content}" edited to "${newMessage.content}"`
	);
};
