import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { useTimeline } from "discord-player";

export const data: CommandData = {
	name: "pause",
	description: "Pauses or resumes the current track",
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const timeline = useTimeline({node: interaction.guildId});

	if (!timeline?.track) {
		return interaction.reply({
			content: `There is no track **currently** playing`,
			ephemeral: true,
		});
	}

	timeline.paused ? timeline.resume() : timeline.pause();
	const state = timeline.paused;

	const embed = EmbedGenerator.Success({
		title: "Success",
		description: `**Playback** has been **${
			state ? "paused" : "resumed"
		}**`,
	}).withAuthor(interaction.user);

	return interaction.reply({ embeds: [embed] });
}
