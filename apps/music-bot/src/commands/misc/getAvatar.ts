import { type CommandData, type ContextMenuCommandProps } from "commandkit";
import { ApplicationCommandType } from "discord.js";

export const data: CommandData = {
	name: "Get Avatar",
	type: ApplicationCommandType.User,
};

export async function run({ interaction, client }: ContextMenuCommandProps) {
	const target = await client.users.fetch(interaction.targetId);

	return interaction.reply(
		`${target.username}'s avatar: ${target.displayAvatarURL()}`
	);
}
