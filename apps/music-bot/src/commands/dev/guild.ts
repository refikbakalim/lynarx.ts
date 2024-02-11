import type {
	CommandData,
	SlashCommandProps,
	CommandOptions,
} from "commandkit";
import { useDatabase } from "#bot/hooks/useDatabase";

export const data: CommandData = {
	name: "guild",
	description: "Get guild info from database",
};

export async function run({ interaction, client }: SlashCommandProps) {
	const db = useDatabase();
	const guild = await db.guild
		.findOne({ id: interaction.guildId })
		.catch(() => null);

	return interaction.reply({
		content: `\`\`\`${guild}\`\`\``,
		ephemeral: true,
	});
}

export const options: CommandOptions = {
	devOnly: true,
};
