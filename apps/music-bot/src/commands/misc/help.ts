import type { CommandData, SlashCommandProps } from "commandkit";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import { ApplicationCommandOptionType } from "discord.js";

export const data: CommandData = {
	name: "help",
	description: "List available commands with descriptions.",
	options: [
		{
			name: "type",
			description: "Command type to list",
			type: ApplicationCommandOptionType.String,
			required: false,
			choices: [
				{ name: "Admin", value: "admin" },
				{ name: "Misc", value: "misc" },
				{ name: "Music", value: "music" },
			],
		},
	],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
	const commandList = handler.commands;
	const type = interaction.options.getString("type");

	if (!commandList.length)
		return interaction.reply({
			content: `No available commands`,
			ephemeral: true,
		});

	let filteredCommands;
	if (type) {
		filteredCommands = commandList.filter((el) => el.category === type);
	} else {
		filteredCommands = commandList.filter(
			(el) => el.category !== "dev" && el.category !== "contextMenu"
		);
	}

	let pagesNum = Math.ceil(filteredCommands.length / 10);
	if (pagesNum <= 0) pagesNum = 1;
	if (pagesNum > 25) pagesNum = 25;

	//typescript can't reach to command.data.description even though it exists in all command.data objects, temporary fix with eval
	const commands = filteredCommands.map(
		(command, idx) =>
			`${++idx}) **/${command.data.name}** ${eval(
				`command.data.description`
			)}`
	);

	const paginatedMessage = new PaginatedMessage();

	for (let i = 0; i < pagesNum; i++) {
		const list = commands.slice(i * 10, i * 10 + 10).join("\n");

		paginatedMessage.addPageEmbed((embed) =>
			embed
				.setColor("Red")
				.setTitle(
					(type
						? type.charAt(0).toUpperCase() + type.slice(1)
						: "All") + " Commands"
				)
				.setDescription(`${list}`)
				.setFooter({
					text: `${filteredCommands.length} commands`,
				})
		);
	}

	return paginatedMessage.run(interaction);
}
