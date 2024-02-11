import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";

export const data: CommandData = {
	name: "shuffle",
	description: "Shuffles the tracks in the queue",
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const queue = useQueue(interaction.guildId);

	if (!queue)
		return interaction.reply({
			content: `I am **not** in a voice channel`,
			ephemeral: true,
		});

	if (queue.tracks.size < 2)
		return interaction.reply({
			content: `There are not **enough tracks** in queue to **shuffle**`,
			ephemeral: true,
		});

	const status = queue.toggleShuffle();

	const embed = EmbedGenerator.Success({
		title: "Track skipped!",
		description: `I have **${
			status ? "shuffled" : "unshuffled"
		}** the queue`,
	}).withAuthor(interaction.user);

	return interaction.reply({ embeds: [embed] });
}
