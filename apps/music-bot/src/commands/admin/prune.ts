import type {
	CommandData,
	SlashCommandProps,
	CommandOptions,
} from "commandkit";
import { ApplicationCommandOptionType } from "discord.js";
import type { TextChannel, NewsChannel, ThreadChannel } from "discord.js";

type GuildTextBasedChannel = TextChannel | NewsChannel | ThreadChannel;

export const data: CommandData = {
	name: "prune",
	description: "Prune up to 99 messages.",
	options: [
		{
			name: "value",
			description: "Number of message to delete",
			min_value: 1,
			max_value: 99,
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
	],
};

export async function run({ interaction, client }: SlashCommandProps) {
	const amount = interaction.options.getInteger("value", true);

	await (interaction.channel as GuildTextBasedChannel)
		.bulkDelete(amount, true)
		.catch((error) => {
			console.error(error);
			interaction.reply({
				content:
					"There was an error trying to prune messages in this channel!",
				ephemeral: true,
			});
		});

	return interaction.reply({
		content: `Successfully pruned \`${amount}\` messages.`,
		ephemeral: true,
	});
}

export const options: CommandOptions = {
	userPermissions: ["Administrator", "ManageMessages"],
	botPermissions: ["Administrator", "ManageMessages"],
};
