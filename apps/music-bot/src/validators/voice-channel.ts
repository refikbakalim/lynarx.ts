import type { ValidationProps } from "commandkit";
import { EmbedGenerator } from "#bot/utils/EmbedGenerator";

export default function ({ interaction, commandObj }: ValidationProps) {
	if (commandObj.category !== "music") return false;
	if (!interaction.inCachedGuild()) return true;

	const selfChannel = interaction.guild.members.me?.voice.channel;
	const memberChannel = interaction.member.voice.channel;

	if (!selfChannel && !memberChannel) {
		if (interaction.isRepliable()) {
			const embed = EmbedGenerator.Error({
				title: "Error!",
				description:
					"You must join a voice channel to use this command.",
			}).withAuthor(interaction.user);
			interaction.reply({ embeds: [embed] });
		}
		return true;
	}

	if (
		(selfChannel && !memberChannel) ||
		(selfChannel && memberChannel && selfChannel.id !== memberChannel.id)
	) {
		if (interaction.isRepliable()) {
			const embed = EmbedGenerator.Error({
				title: "Error!",
				description: `You must join ${selfChannel.toString()} to use this command.`,
			}).withAuthor(interaction.user);

			interaction.reply({ embeds: [embed] });
		}
		return true;
	}
}
