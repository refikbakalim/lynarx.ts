import { PlayerMetadata } from "#bot/player/PlayerMetadata";
import { fetchPlayerOptions } from "#bot/player/playerOptions";
import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { QueueRepeatMode, useMainPlayer } from "discord-player";
import { ApplicationCommandOptionType } from "discord.js";

export const data: CommandData = {
	name: "pplay",
	description: "Play a playlist",
	options: [
		{
			name: "url",
			description: "The url of the playlist",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	await interaction.deferReply();

	const url = interaction.options.getString("url", true);
	const channel = interaction.member.voice.channel!;
	const player = useMainPlayer();

	const data = await player.search(url, { requestedBy: interaction.user });

	if (!data.hasTracks())
		return interaction.editReply("No track found in the given url");

	try {
		const playerOptions = await fetchPlayerOptions(interaction.guildId);
		const options = {
			nodeOptions: {
				metadata: PlayerMetadata.create(interaction),
				volume: playerOptions.volume,
				a_filter: playerOptions.filters as (
					| "8D"
					| "Tremolo"
					| "Vibrato"
				)[],
				equalizer: playerOptions.equalizer.map((eq, i) => ({
					band: i,
					gain: eq,
				})),
				noEmitInsert: true,
				leaveOnStop: false,
				leaveOnEmpty: true,
				leaveOnEmptyCooldown: 60000,
				leaveOnEnd: true,
				leaveOnEndCooldown: 60000,
				pauseOnEmpty: true,
				preferBridgedMetadata: true,
				disableBiquad: true,
			},
			requestedBy: interaction.user,
			connectionOptions: {
				deaf: true,
			},
		};

		await player.play(channel, data, options);

		const embed = EmbedGenerator.Success({
			title: "Success",
			description: `${data.tracks.length} tracks added to queue!`,
		}).withAuthor(interaction.user);

		return interaction.editReply({ embeds: [embed] });
	} catch (e) {
		console.error(e);

		const embed = EmbedGenerator.Error({
			title: "Something went wrong",
			description: `Something went wrong while getting tracks`,
		}).withAuthor(interaction.user);

		return interaction.editReply({ embeds: [embed] });
	}
}
