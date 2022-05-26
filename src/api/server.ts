/**

 * @author cramatsu
 * (´｡• ω •｡`) ♡
 * @Date 26.05.2022

 */
import { join } from 'path';
import { importx } from '@discordx/importer';
import { Koa } from '@discordx/koa';
import { logger } from '../logger';

export class Api {
	private readonly _server: Koa;

	public constructor() {
		this._server = new Koa();
	}

	private async init() {
		await importx(join(__dirname, 'routes/**/*.js'));
		await this._server.build();
	}

	public async run(port?: number) {
		await this.init();
		this._server.listen(port ?? 3333, () => {
			logger.info({
				message: 'API запущено!',
			});
		});
	}
}
