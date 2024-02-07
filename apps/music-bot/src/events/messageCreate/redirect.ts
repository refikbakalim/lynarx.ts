import type { Client, Message } from "discord.js";
import { ChannelType } from "discord.js";
import { DevIds } from "#bot/utils/constants";

export default async (message: Message, client: Client<true>) => {
	if (message.author == client.user) return;
	if (message.channel.type != ChannelType.DM) return;

	const dev = await client.users.fetch(DevIds.users[0]);

	if (!dev) return console.log("Can not find the dev");

	dev.send(`${message.author}: ${message.content}`);
};
