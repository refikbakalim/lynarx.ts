import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";

export const data: CommandData = {
	name: "stop",
	description: "Stop the player",
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const queue = useQueue(interaction.guildId);

	if (!queue?.isPlaying()) {
		return interaction.reply({
			content: `There is no track **currently** playing`,
			ephemeral: true,
		});
	}

	queue.node.stop();

	const embed = EmbedGenerator.Success({
		title: "Track stopped!",
		description: "I have successfully stopped the track.",
	}).withAuthor(interaction.user);

	return interaction.reply({ embeds: [embed] });
}
