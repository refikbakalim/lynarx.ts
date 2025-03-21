import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type { CommandData, SlashCommandProps } from "commandkit";
import { useQueue, EqualizerConfigurationPreset } from "discord-player";
import { ApplicationCommandOptionType } from "discord.js";

export const data: CommandData = {
	name: "equalizer",
	description: "Apply equalizer filter to tracks",
	options: [
		{
			name: "filter",
			description: "The equalizer filter to use",
			type: ApplicationCommandOptionType.String,
			choices: [
				...Object.keys(EqualizerConfigurationPreset).map((m) => ({
					name: m,
					value: m,
				})),
				{ name: "Vocalboost", value: "Vocalboost" },
			],
			required: true,
		},
	],
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const queue = useQueue(interaction.guildId);
	const filter = interaction.options.getString("filter");

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

	if (!queue.filters.equalizer)
		return interaction.reply({
			content: `The equalizer filter is **not available** to be used in this queue`,
			ephemeral: true,
		});

	let value;
	if (filter == "Vocalboost") {
		value = [
			{ band: 0, gain: -0.2 },
			{ band: 1, gain: -0.2 },
			{ band: 2, gain: 0.2 },
			{ band: 3, gain: 0.15 },
			{ band: 4, gain: 0.1 },
			{ band: 5, gain: -0.1 },
		];
	} else {
		value = eval(`EqualizerConfigurationPreset.${filter}`);
	}

	queue.filters.equalizer.setEQ(value);
	queue.filters.equalizer.enable();

	const embed = EmbedGenerator.Success({
		title: "Success",
		description: `I have successfully **enabled** ${filter} filter.`,
	}).withAuthor(interaction.user);

	return interaction.reply({ embeds: [embed] });
}
