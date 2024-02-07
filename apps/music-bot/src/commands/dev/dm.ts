import type {
	CommandData,
	SlashCommandProps,
	CommandOptions,
} from "commandkit";
import { ApplicationCommandOptionType } from "discord.js";

export const data: CommandData = {
	name: "dm",
	description: "Sends direct message to a user",
	options: [
		{
			name: "target",
			description: "The user to message",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "message",
			description: "The message to send",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
};

export async function run({ interaction, client }: SlashCommandProps) {
	const target = interaction.options.getUser("target");
	const message = interaction.options.getString("message");

	if (!target) {
		return interaction.reply({
			content: `Could not find the target`,
			ephemeral: true,
		});
	}

	target.send(message!);

	return interaction.reply({
		content: `Successfully sent the message.`,
		ephemeral: true,
	});
}

export const options: CommandOptions = {
	devOnly: true,
};
