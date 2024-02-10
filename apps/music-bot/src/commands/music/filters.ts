import type { CommandData, SlashCommandProps } from "commandkit";
import { useQueue, FiltersName } from "discord-player";
import { ApplicationCommandOptionType } from "discord.js";

export const data: CommandData = {
	name: "filter",
	description: "The FFmpeg filters that can be applied to tracks",
	options: [
		{
			name: "filter",
			description: "The FFmpeg filter to use",
			type: ApplicationCommandOptionType.String,
			choices: [
				{ name: "Off", value: "Off" },
				{ name: "lofi", value: "lofi" },
				{ name: "8D", value: "8D" },
				{ name: "bassboost", value: "bassboost" },
				{ name: "compressor", value: "compressor" },
				{ name: "karaoke", value: "karaoke" },
				{ name: "vibrato", value: "vibrato" },
				{ name: "vaporwave", value: "vaporwave" },
				{ name: "nightcore", value: "nightcore" },
				{ name: "tremolo", value: "tremolo" },
			],
			required: true,
		},
	],
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;
	await interaction.deferReply();

	const queue = useQueue(interaction.guildId);
	const filter = interaction.options.getString("filter") as
		| FiltersName
		| "Off";

	if (!queue)
		return interaction.editReply({
			content: `I am **not** in a voice channel`,
		});
	if (!queue.currentTrack)
		return interaction.editReply({
			content: `There is no track **currently** playing`,
		});

	if (!queue.filters.ffmpeg)
		return interaction.editReply({
			content: `The FFmpeg filters are **not available** to be used in this queue`,
		});

	if (filter === "Off") {
		await queue.filters.ffmpeg.setFilters(false);
		return interaction.editReply({
			content: `**Audio** filter has been **disabled**`,
		});
	}

	await queue.filters.ffmpeg.toggle(
		filter.includes("bassboost") ? ["bassboost", "normalizer"] : filter
	);

	return interaction.editReply({
		content: `**${filter}** filter has been **${
			queue.filters.ffmpeg.isEnabled(filter) ? "enabled" : "disabled"
		}**`,
	});
}
