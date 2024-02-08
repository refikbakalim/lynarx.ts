# Music Bot

A complete example of a discord music bot including database, web dashboard, and more powered by [discord.js](https://discord.js.org/#/) and [discord-player](https://discord-player.js.org).

# Features

- Easy to use
- Customizable
- Covers most of the concepts as well as best practices of discord-player
- Slash commands
- Web dashboard
- Custom playlists management
- Queue management
- Persistent configurations
- Equalizer

and more...

# Setting up the bot

## Setup with Docker

- TODO

## Manual setup

- Run `pnpm install --frozen-lockfile` to install all dependencies

### Starting the bot

- Rename `.env.example` to `.env` and fill out the values
- Put your bot token in `DISCORD_TOKEN`
- Put mongodb database credentials in `DATABASE_URL` (You can get one for free from [Mongodb Atlas](https://www.mongodb.com/atlas))
- Put your redis config in `REDIS_*` (you can use memurai for windows)
- Run `pnpm bot dev` to start the bot in development mode

### Starting the website

- Rename `.env.example` to `.env` and fill out the values
- Run `pnpm run --filter web dev` to start the website in development mode

You can now use `/web` command to get magic link to the website. You are able to add songs to the queue, skip songs, change volume and more from the website itself. You can also do this from Discord using slash commands.

![Web Interface](https://github.com/twlite/music-bot/blob/main/assets/image.png?raw=true)
