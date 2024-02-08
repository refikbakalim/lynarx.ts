import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";

export const data: CommandData = {
	name: "clear",
	description: "Clear song queue",
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	await interaction.deferReply();

	const queue = useQueue(interaction.guildId);
	const size = queue?.size;

	queue?.clear();

	const embed = EmbedGenerator.Success({
		title: "Queue cleared!",
		description: `I have successfully cleared ${size} tracks.`,
	}).withAuthor(interaction.user);

	return interaction.editReply({ embeds: [embed] });
}
