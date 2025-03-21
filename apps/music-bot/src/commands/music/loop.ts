import { useDatabase } from "#bot/hooks/useDatabase";
import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { QueueRepeatMode, useQueue } from "discord-player";
import { ApplicationCommandOptionType } from "discord.js";
import { loopModes, loopModeLabels } from '#bot/utils/constants';

export const data: CommandData = {
	name: "loop",
	description: "Get or manipulate the loop mode",
	options: [
		{
			name: "mode",
			description: "The loop mode to set",
			type: ApplicationCommandOptionType.Integer,
			required: false,
			choices: [
				{
					name: "Autoplay Next Track",
					value: QueueRepeatMode.AUTOPLAY,
				},
				{ name: "Repeat Current Track", value: QueueRepeatMode.TRACK },
				{ name: "Repeat Queue", value: QueueRepeatMode.QUEUE },
				{ name: "Repeat Off", value: QueueRepeatMode.OFF },
			],
		},
	],
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

	const db = useDatabase();
	const mode = interaction.options.getInteger("mode", false);

	if (mode != null) {
		queue.setRepeatMode(loopModes[mode]);

		const embed = EmbedGenerator.Success({
			title: "Repeat mode changed",
			description: `I have successfully changed the repeat mode to \`${loopModeLabels[mode]}\``,
		}).withAuthor(interaction.user);

		await interaction.reply({ embeds: [embed] });
		await db.guild
			.findOneAndUpdate(
				{ id: interaction.guildId },
				{
					id: interaction.guildId,
					loopMode: mode,
				},
				{
					new: true,
					upsert: true,
				}
			)
			.catch(() => null);
		return;
	}

	const embed = EmbedGenerator.Success({
		title: "Repeat mode",
		description: `The current repeat mode is \`${
			loopModeLabels[queue.repeatMode]
		}\`.`,
	}).withAuthor(interaction.user);

	return interaction.reply({ embeds: [embed] });
}
