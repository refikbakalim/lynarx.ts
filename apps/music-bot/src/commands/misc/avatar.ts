import type { CommandData, SlashCommandProps } from "commandkit";
import {
	ApplicationCommandOptionType,
	ImageExtension,
	ImageSize,
} from "discord.js";

export const data: CommandData = {
	name: "avatar",
	description: "Get the avatar of the selected user.",
	options: [
		{
			name: "target",
			description: "The user's avatar to show",
			type: ApplicationCommandOptionType.User,
		},
		{
			name: "extension",
			description: "The extension to use for the image URL",
			type: ApplicationCommandOptionType.String,
			choices: [
				{ name: "webp", value: "webp" },
				{ name: "png", value: "png" },
				{ name: "jpg", value: "jpg" },
				{ name: "jpeg", value: "jpeg" },
				{ name: "gif", value: "gif" },
			],
		},
		{
			name: "static",
			description:
				"Whether or not to prefer the static version of an image asset",
			type: ApplicationCommandOptionType.Boolean,
		},
		{
			name: "size",
			description: "The size specified in the image URL",
			type: ApplicationCommandOptionType.Integer,
			choices: [
				{ name: "16", value: 16 },
				{ name: "32", value: 32 },
				{ name: "64", value: 64 },
				{ name: "128", value: 128 },
				{ name: "256", value: 256 },
				{ name: "512", value: 512 },
				{ name: "1024", value: 1024 },
				{ name: "2048", value: 2048 },
				{ name: "4096", value: 4096 },
			],
		},
	],
};

export async function run({ interaction, client }: SlashCommandProps) {
	const target = interaction.options.getUser("target");
	const extension = interaction.options.getString(
		"extension"
	) as ImageExtension;
	let forceStatic = interaction.options.getBoolean("static") as boolean;
	const size = interaction.options.getInteger("size") as ImageSize;
	const user = target || interaction.user;

	if (extension && extension != "gif") {
		forceStatic = true;
	}

	return interaction.reply(
		`${user.username}'s avatar: ${user.displayAvatarURL({
			...(extension && { extension }),
			...(forceStatic && { forceStatic }),
			...(size && { size }),
		})}`
	);
}
