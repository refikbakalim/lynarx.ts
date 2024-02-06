import type { CommandData, SlashCommandProps } from "commandkit";
import { ApplicationCommandOptionType } from "discord.js";
import { EmbedGenerator } from "#bot/utils/EmbedGenerator";

export const data: CommandData = {
	name: "info",
	description: "Get informations about a user or server",
	options: [
		{
			name: "user",
			description: "Get user info",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "target",
					description: "The user to display info about",
					type: ApplicationCommandOptionType.User,
				},
			],
		},
		{
			name: "server",
			description: "Get server info",
			type: ApplicationCommandOptionType.Subcommand,
		},
	],
};

export async function run({ interaction, client }: SlashCommandProps) {
	if (interaction.options.getSubcommand() === "user") {
		const target = interaction.options.getUser("target");
		const user = target || interaction.user;

		if (!user) {
			return interaction.reply(`Can not get the user info`);
		}

		const embed = EmbedGenerator.Info({
			title: "User Info",
			fields: [
				{
					name: "Username",
					value: user.username,
				},
				{
					name: "ID",
					value: user.id,
				},
				{
					name: "Created At",
					value: String(user.createdAt),
				},
				{
					name: "Is Bot?",
					value: String(user.bot),
				},
				{
					name: "Avatar",
					value: "",
				},
			],
			image: { url: user.displayAvatarURL() },
		});

		return interaction.reply({ embeds: [embed] });
	} else if (interaction.options.getSubcommand() === "server") {
		if (!interaction.guild) {
			return interaction.reply(`Can not get the server info`);
		}

		const embed = EmbedGenerator.Info({
			title: "Server Info",
			fields: [
				{
					name: "Server Name",
					value: interaction.guild.name,
				},
				{
					name: "ID",
					value: interaction.guild.id,
				},
				{
					name: "Total Members",
					value: String(interaction.guild.memberCount),
				},
				{
					name: "Created At",
					value: String(interaction.guild.createdAt),
				},
				{
					name: "Icon",
					value: "",
				},
			],
			image: { url: interaction.guild.iconURL() || "" },
		});

		return interaction.reply({ embeds: [embed] });
	}

	return interaction.reply(`Something went wrong!`);
}
