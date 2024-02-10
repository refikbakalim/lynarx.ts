import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { useHistory, useQueue } from "discord-player";

export const data: CommandData = {
	name: "previous",
	description: "Plays the previous track",
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	await interaction.deferReply();

	const queue = useQueue(interaction.guild!.id);
	const history = useHistory(interaction.guildId);

	if (!queue) {
		const embed = EmbedGenerator.Error({
			title: "Error",
			description: "I am **not** in a voice channel",
		}).withAuthor(interaction.user);

		return interaction.editReply({ embeds: [embed] });
	}

	if (!history) {
		const embed = EmbedGenerator.Error({
			title: "Error",
			description: "There is **no** **history**",
		}).withAuthor(interaction.user);

		return interaction.editReply({ embeds: [embed] });
	}

	if (history.isEmpty()) {
		const embed = EmbedGenerator.Error({
			title: "Error",
			description: "There is **no** previous track in the **history**",
		}).withAuthor(interaction.user);

		return interaction.editReply({ embeds: [embed] });
	}

	await history.previous();

	const embed = EmbedGenerator.Success({
		title: "Success",
		description: "🔁 | I am **replaying** the previous track",
	}).withAuthor(interaction.user);

	return interaction.editReply({ embeds: [embed] });
}
