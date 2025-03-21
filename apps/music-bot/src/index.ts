import 'dotenv/config';
import './bootstrap/database.js';
import redis from './bootstrap/redis.js';
import './bootstrap/web.js';
import { client } from './bootstrap/client.js';
import { Player } from 'discord-player';
import { registerPlayerEvents } from './player/registerEvents.js';
import { RedisQueryCache } from './player/QueryCache.js';
import { CustomPlaylistExtractor } from './player/CustomPlaylistExtractor.js';
import { DefaultExtractors } from '@discord-player/extractor';
import { YoutubeiExtractor } from 'discord-player-youtubei';

const player = new Player(client, {
  skipFFmpeg: false,
  queryCache: new RedisQueryCache(redis),
});

if (process.env.NODE_ENV !== 'production') {
  player.on('debug', (message) => console.log(`[Player] ${message}`));
  player.events.on('debug', (queue, message) =>
    console.log(`[${queue.guild.name}: ${queue.guild.id}] ${message}`)
  );
}

await registerPlayerEvents();

const ytExtOptions = { streamOptions: {} };
await player.extractors.register(YoutubeiExtractor, {
  ...ytExtOptions,
});

await player.extractors.loadMulti(DefaultExtractors);

await player.extractors.register(CustomPlaylistExtractor, {});

await client.login();

// prevent crash on unhandled promise rejection
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

// prevent crash on uncaught exception
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
