import type {
	CommandData,
	SlashCommandProps,
	CommandOptions,
} from "commandkit";
import {
	ApplicationCommandOptionType,
	ActivityType,
	PresenceStatusData,
} from "discord.js";

export const data: CommandData = {
	name: "presence",
	description: "Changes bot's activity",
	options: [
		{
			name: "activity",
			description: "The activity to set",
			type: ApplicationCommandOptionType.Integer,
			required: true,
			choices: [
				{ name: "play", value: 0 },
				{ name: "stream", value: 1 },
				{ name: "listen", value: 2 },
				{ name: "watch", value: 3 },
				{ name: "custom", value: 4 },
				{ name: "compete", value: 5 },
				{ name: "reset", value: -1 },
			],
		},
		{
			name: "value",
			description: "The value of the activity",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "state",
			description: "state",
			type: ApplicationCommandOptionType.String,
		},
		{
			name: "status",
			description: "status",
			type: ApplicationCommandOptionType.String,
			choices: [
				{ name: "online", value: "online" },
				{ name: "idle", value: "idle" },
				{ name: "dnd", value: "dnd" },
			],
		},
		{
			name: "url",
			description: "url",
			type: ApplicationCommandOptionType.String,
		},
	],
};

export async function run({ interaction, client }: SlashCommandProps) {
	const type = interaction.options.getInteger("activity") as ActivityType;
	const name = interaction.options.getString("value") || "";
	const status = interaction.options.getString(
		"status"
	) as PresenceStatusData;
	const state = interaction.options.getString("state");
	const url = interaction.options.getString("url");

	client.user.setPresence({
		activities: [
			{
				name: name,
				...(type && { type }),
				...(state && { state }),
				...(url && { url }),
			},
		],
		...(status && { status }),
	});

	return interaction.reply({
		content: `Changed bot presence.`,
		ephemeral: true,
	});
}

export const options: CommandOptions = {
	devOnly: true,
};
