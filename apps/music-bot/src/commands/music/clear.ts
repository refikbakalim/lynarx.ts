import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";
import { ApplicationCommandOptionType } from "discord.js";

export const data: CommandData = {
	name: "clear",
	description: "Clear song queue",
	options: [
		{
			name: "history",
			description: "Also clear the queue history",
			type: ApplicationCommandOptionType.Boolean,
		},
	],
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const history = interaction.options.getBoolean("history");
	const queue = useQueue(interaction.guildId);

	if (!queue)
		return interaction.reply({
			content: `I am **not** in a voice channel`,
			ephemeral: true,
		});

	if (!queue.tracks)
		return interaction.reply({
			content: `There is **nothing** to clear`,
			ephemeral: true,
		});

	const size = queue?.size;

	queue.tracks.clear();
	if (history) queue.history.clear();

	const embed = EmbedGenerator.Success({
		title: "Queue cleared!",
		description: `I have successfully cleared ${size} tracks.`,
	}).withAuthor(interaction.user);

	return interaction.reply({ embeds: [embed] });
}
