import type {
	CommandData,
	SlashCommandProps,
	CommandOptions,
} from "commandkit";
import { ApplicationCommandOptionType } from "discord.js";
import { OpenAI } from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const data: CommandData = {
	name: "gpt",
	description: "Get answer from ChatGPT with given query",
	options: [
		{
			name: "query",
			description: "Query to send to ChatGPT",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
};

export async function run({ interaction, client }: SlashCommandProps) {
	const query = interaction.options.getString("query") || "";

	await interaction.deferReply();

	const params: OpenAI.Chat.ChatCompletionCreateParams = {
		messages: [{ role: "user", content: query }],
		model: "gpt-3.5-turbo",
	};
	const chatCompletion: OpenAI.Chat.ChatCompletion =
		await openai.chat.completions.create(params);

	const response = chatCompletion.choices[0].message.content;

	if (response) {
		if (response?.length <= 2000) {
			return interaction.editReply(response);
		} else {
			for (let i = 0; i < Math.ceil(response?.length / 2000); i++) {
				interaction.followUp(response.slice(i * 2000, i * 2000 + 2000));
			}
			return;
		}
	}
	return interaction.editReply("Something went wrong.");
}

export const options: CommandOptions = {
	devOnly: true,
};
