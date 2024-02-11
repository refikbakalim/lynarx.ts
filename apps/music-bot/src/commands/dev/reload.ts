import { ApplicationCommandOptionType } from "discord.js";
import type {
	CommandData,
	SlashCommandProps,
	CommandOptions,
	ReloadType,
} from "commandkit";

export const data: CommandData = {
	name: "reload",
	description: "Reloads commands, events or validations.",
	options: [
		{
			name: "commands",
			description: "Reload commands",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "type",
					description: "Command type to reload",
					type: ApplicationCommandOptionType.String,
					choices: [
						{
							name: "dev",
							value: "dev",
						},
						{
							name: "global",
							value: "global",
						},
					],
				},
			],
		},
		{
			name: "events",
			description: "Reload events",
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: "validations",
			description: "Reload validations",
			type: ApplicationCommandOptionType.Subcommand,
		},
	],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
	await interaction.deferReply({ ephemeral: true });

	if (interaction.options.getSubcommand() === "events") {
		await handler.reloadEvents();
		return interaction.followUp("Reloaded all events!");
	} else if (interaction.options.getSubcommand() === "validations") {
		await handler.reloadValidations();
		return interaction.followUp("Reloaded all validations!");
	} else if (interaction.options.getSubcommand() === "commands") {
		const type = interaction.options.getString("type") as ReloadType;

		if (!type) {
			await handler.reloadCommands();
			return interaction.followUp(`Reloaded all commands!`);
		} else {
			await handler.reloadCommands(type);
			return interaction.followUp(`Reloaded ${type} commands!`);
		}
	}
}

export const options: CommandOptions = {
	devOnly: true,
};
