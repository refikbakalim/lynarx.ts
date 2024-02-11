import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { useTimeline } from "discord-player";
import { ApplicationCommandOptionType } from "discord.js";

export const data: CommandData = {
	name: "volume",
	description: "Get or manipulate the volume",
	options: [
		{
			name: "value",
			description: "The volume to set",
			min_value: 0,
			max_value: 100,
			type: ApplicationCommandOptionType.Integer,
			required: false,
		},
	],
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const timeline = useTimeline(interaction.guildId);

	if (!timeline?.track) {
		return interaction.reply({
			content: `There is no track **currently** playing`,
			ephemeral: true,
		});
	}

	const amount = interaction.options.getInteger("value", false);

	if (amount != null) {
		timeline.setVolume(amount);

		const embed = EmbedGenerator.Success({
			title: "Volume changed",
			description: `I have successfully changed the volume to ${amount}%.`,
		}).withAuthor(interaction.user);

		return interaction.reply({ embeds: [embed] });
	}

	const embed = EmbedGenerator.Success({
		title: "Volume",
		description: `The current volume is \`${timeline.volume}%\`.`,
	}).withAuthor(interaction.user);

	return interaction.reply({ embeds: [embed] });
}
