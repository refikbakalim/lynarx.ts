import { EmbedGenerator } from "#bot/utils/EmbedGenerator";
import type {
	CommandData,
	SlashCommandProps,
	AutocompleteProps,
} from "commandkit";
import { useQueue } from "discord-player";
import { ApplicationCommandOptionType } from "discord.js";

export const data: CommandData = {
	name: "remove",
	description: "Removes the given track",
	options: [
		{
			name: "track",
			description: "The track you want to remove",
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			required: true,
			autocomplete: true,
		},
	],
};

export async function autocomplete({ interaction }: AutocompleteProps) {
	const queue = useQueue(interaction.guild!.id);
	const track = interaction.options.getInteger("track");
	const remove = queue?.tracks.at(track!);
	const position = queue?.node.getTrackPosition(remove!);

	const tracks = queue!.tracks.map((t, idx) => ({
		name: t.title,
		value: ++idx,
	}));

	if (remove?.title && !tracks.some((t) => t.name === remove.title)) {
		tracks.unshift({
			name: remove.title,
			value: position!,
		});
	}

	let slicedTracks = tracks.slice(0, 5);
	if (track) {
		slicedTracks = tracks.slice(track - 1, track + 4);
		if (slicedTracks.length > 5) {
			slicedTracks = slicedTracks.slice(0, 5);
		}
	}

	return interaction.respond(slicedTracks);
}

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const queue = useQueue(interaction.guild!.id);

	if (!queue)
		return interaction.reply({
			content: `I am **not** in a voice channel`,
			ephemeral: true,
		});

	if (!queue.tracks)
		return interaction.reply({
			content: `There are **no tracks** to **remove** to`,
			ephemeral: true,
		});

	const remove = interaction.options.getInteger("track")! - 1;
	const trackResolvable = queue.tracks.at(remove!);

	if (!trackResolvable)
		return interaction.reply({
			content: `The **requested track** doesn't **exist**`,
			ephemeral: true,
		});

	queue.node.remove(trackResolvable);

	const embed = EmbedGenerator.Success({
		title: "Success",
		description: `⏩ | I have **removed** the track: **${trackResolvable.title}**`,
	}).withAuthor(interaction.user);

	return interaction.reply({ embeds: [embed] });
}
