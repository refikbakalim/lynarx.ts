import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { useHistory, useQueue } from "discord-player";

export const data: CommandData = {
	name: "previous",
	description: "Plays the previous track",
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const queue = useQueue(interaction.guild!.id);
	const history = useHistory(interaction.guildId);

	if (!queue) {
		return interaction.reply({
			content: `I am **not** in a voice channel`,
			ephemeral: true,
		});
	}

	if (!history) {
		return interaction.reply({
			content: `There is **no** **history**`,
			ephemeral: true,
		});
	}

	if (history.isEmpty()) {
		return interaction.reply({
			content: `There is **no** previous track in the **history**`,
			ephemeral: true,
		});
	}

	await history.previous();

	const embed = EmbedGenerator.Success({
		title: "Success",
		description: "🔁 | I am **replaying** the previous track",
	}).withAuthor(interaction.user);

	return interaction.reply({ embeds: [embed] });
}
