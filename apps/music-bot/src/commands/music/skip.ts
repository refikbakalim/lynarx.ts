import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";

export const data: CommandData = {
	name: "skip",
	description: "Skip to the next track",
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const queue = useQueue(interaction.guildId);

	if (!queue)
		return interaction.reply({
			content: `I am **not** in a voice channel`,
			ephemeral: true,
		});
	if (!queue.currentTrack)
		return interaction.reply({
			content: `There is no track **currently** playing`,
			ephemeral: true,
		});

	queue.node.skip();

	const embed = EmbedGenerator.Success({
		title: "Track skipped!",
		description: "⏩ | I have **skipped** to the next track",
	}).withAuthor(interaction.user);

	return interaction.reply({ embeds: [embed] });
}
