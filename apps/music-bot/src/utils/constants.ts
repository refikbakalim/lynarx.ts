import { GatewayIntentBits, Partials } from "discord.js";
import { getDirname } from "./location.js";
import { join } from "node:path";
import { QueueRepeatMode } from 'discord-player';

export const ClientIntents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.DirectMessages,
] as const;

export const ClientPartials = [Partials.Channel];

export const RedisConfig = {
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
	password: process.env.REDIS_PASSWORD,
} as const;

export const CommandsPath = join(getDirname(import.meta.url), "..", "commands");
export const EventsPath = join(getDirname(import.meta.url), "..", "events");
export const ValidationsPath = join(
	getDirname(import.meta.url),
	"..",
	"validators"
);
export const PlayerEventsPath = join(
	getDirname(import.meta.url),
	"..",
	"player",
	"events"
);

export const EmbedColor = {
	Success: 0x00fa9a,
	Error: 0xff2a16,
	Warning: 0xffd700,
	Info: 0x00bfaf,
} as const;

export const DevIds = {
	users: [process.env.DEV_USER_ID!],
	guilds: [process.env.DEV_GUILD_ID!],
};

export const loopModes = [
	QueueRepeatMode.OFF,
	QueueRepeatMode.TRACK,
	QueueRepeatMode.QUEUE,
	QueueRepeatMode.AUTOPLAY,
  ];
  
  export const loopModeLabels = ['OFF', 'TRACK', 'QUEUE', 'AUTOPLAY'];