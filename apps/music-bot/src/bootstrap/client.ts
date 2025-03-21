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

const cleanDevUsers = DevIds.users?.filter(id => id.trim().length > 0) ?? [];
const cleanDevGuilds = DevIds.guilds?.filter(id => id.trim().length > 0) ?? [];

const options: ConstructorParameters<typeof CommandKit>[0] = {
	client,
	bulkRegister: true,
	commandsPath: CommandsPath,
	eventsPath: EventsPath,
	skipBuiltInValidations: false,
	validationsPath: ValidationsPath,
	...(cleanDevUsers.length > 0 ? { devUserIds: cleanDevUsers } : {}),
	...(cleanDevGuilds.length > 0 ? { devGuildIds: cleanDevGuilds } : {}),
};

const commandkit = new CommandKit(options);

export { client, commandkit };
