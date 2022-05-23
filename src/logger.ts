/**

 * @author cramatsu
 * (´｡• ω •｡`) ♡
 * @Date 22.05.2022

 */
import pino from 'pino';

export const logger = pino({
	name: 'VActivity',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			messageKey: 'message',
			translateTime: true,
		},
	},
});
