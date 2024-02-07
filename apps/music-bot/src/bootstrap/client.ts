import { Client } from "discord.js";
import { HooksRegistry, Symbols } from "#bot/hooks/registry";
import {
	ClientIntents,
	ClientPartials,
	CommandsPath,
	EventsPath,
	ValidationsPath,
	DevIds,
} from "#bot/utils/constants";
import { CommandKit } from "commandkit";

const client = new Client({
	intents: ClientIntents,
	partials: ClientPartials,
});

HooksRegistry.set(Symbols.kClient, client);

const commandkit = new CommandKit({
	client,
	bulkRegister: true,
	commandsPath: CommandsPath,
	eventsPath: EventsPath,
	skipBuiltInValidations: false,
	validationsPath: ValidationsPath,
	devUserIds: DevIds.users,
	devGuildIds: DevIds.guilds,
});

export { client, commandkit };
