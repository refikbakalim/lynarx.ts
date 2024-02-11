import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import type { CommandData, SlashCommandProps } from "commandkit";
import { useQueue, useHistory } from "discord-player";

export const data: CommandData = {
	name: "history",
	description: "Display the queue history",
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const queue = useQueue(interaction.guild!.id);
	const history = useHistory(interaction.guild!.id);

	if (!queue)
		return interaction.reply({
			content: `I am **not** in a voice channel`,
			ephemeral: true,
		});

	if (!history?.tracks)
		return interaction.reply({
			content: `There is **no** queue history to **display**`,
			ephemeral: true,
		});

	let pagesNum = Math.ceil(queue.tracks.size / 5);

	if (pagesNum <= 0) pagesNum = 1;

	const tracks = history.tracks.map(
		(track, idx) => `**${++idx})** [${track.title}](${track.url})`
	);

	const paginatedMessage = new PaginatedMessage();

	if (pagesNum > 25) pagesNum = 25;

	for (let i = 0; i < pagesNum; i++) {
		const list = tracks.slice(i * 5, i * 5 + 5).join("\n");

		paginatedMessage.addPageEmbed((embed) =>
			embed
				.setColor("Red")
				.setDescription(
					`**Queue history** for **session** in **${queue.channel
						?.name}:**\n${
						list === ""
							? "\n*• No more queued tracks*"
							: `\n${list}`
					}
						\n`
				)
				.setFooter({
					text: `${queue.tracks.size} track(s) in queue`,
				})
		);
	}

	return paginatedMessage.run(interaction);
}
