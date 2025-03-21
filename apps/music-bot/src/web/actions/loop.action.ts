import { useQueue } from 'discord-player';
import { SocketUser } from '../socket.js';
import type { Socket } from 'socket.io';
import { PlayerMetadata } from '#bot/player/PlayerMetadata';
import { EmbedGenerator } from '#bot/utils/EmbedGenerator';
import { loopModes, loopModeLabels } from '#bot/utils/constants';

export async function LoopAction(
  info: SocketUser,
  socket: Socket,
  mode: 0 | 1 | 2 | 3
) {
  const queue = useQueue<PlayerMetadata>(info.guildId);
  if (!queue?.connection) return socket.disconnect(true);

  if (!loopModes[mode]) return;

  queue.setRepeatMode(mode);

  socket.to(info.guildId).emit('loop', mode);

  await queue.metadata.channel.send({
    embeds: [
      EmbedGenerator.Success({
        title: 'Loop mode updated!',
        description: `The loop mode was set to ${loopModeLabels[mode]} by ${info.displayName} (<@${info.id}>).`,
      }),
    ],
  });
}
