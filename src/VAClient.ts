/**

 * @author cramatsu
 * (´｡• ω •｡`) ♡
 * @Date 22.05.2022

 */
import { join } from 'path';
import { importx } from '@discordx/importer';
import type { Interaction } from 'discord.js';
import { Intents } from 'discord.js';
import { Client } from 'discordx';
import { Api } from './api/server';
import { logger } from './logger';

export class VAClient {
	private readonly _client: Client;
	private readonly _api: Api;

	public get api(): Api {
		return this._api;
	}

	public get client(): Client {
		return this._client;
	}

	public constructor() {
		this._client = new Client({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES,
			],
			partials: ['CHANNEL', 'MESSAGE'],
			botGuilds: [process.env.GUILD_ID!],
		});

		this._api = new Api();

		this._client.on('interactionCreate', async (interaction: Interaction) => {
			await this._client.executeInteraction(interaction);
		});

		this._client.on('ready', async () => {
			await this._client.initApplicationCommands({
				global: {
					disable: {
						update: true,
						add: true,
						delete: true,
					},
					log: false,
				},
				guild: {
					log: true,
				},
			});

			await this._api.run();
			this._client.user!.setPresence({
				status: 'idle',
				activities: [
					{
						type: 'WATCHING',
						name: 'за вашей активностью (´ ω `♡)',
					},
				],
			});
		});
	}

	public async init() {
		await importx(join(__dirname, 'commands/**/*.{js,ts}'));
		await importx(join(__dirname, 'events/**/*.{js,ts}'));

		await this._client.login(process.env.DISCORD_TOKEN!).then(() => {
			logger.info({
				message: 'Бот запущен',
			});
		});
	}
}
