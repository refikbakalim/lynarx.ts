import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { usePlayer, useTimeline } from "discord-player";

export const data: CommandData = {
	name: "nowplaying",
	description: "View the currently playing song",
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const node = usePlayer(interaction.guildId)!;
	const timeline = useTimeline(interaction.guildId);

	// this will also verify if usePlayer's value is null
	if (!timeline?.track) {
		return interaction.reply({
			content: `There is no track **currently** playing`,
			ephemeral: true,
		});
	}

	const { track, timestamp } = timeline;

	const embed = EmbedGenerator.Info({
		title: "Now Playing",
		description: `[${track.title}](${track.url})`,
		fields: [{ name: "Progress", value: node.createProgressBar()! }],
		thumbnail: { url: track.thumbnail },
		footer: {
			text: `Requested by ${track.requestedBy?.tag} • ${timestamp.progress}%`,
			iconURL: track.requestedBy?.displayAvatarURL(),
		},
	}).withAuthor(interaction.user);

	return interaction.reply({ embeds: [embed] });
}
