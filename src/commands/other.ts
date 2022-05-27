/**

 * @author cramatsu
 * (´｡• ω •｡`) ♡
 * @Date 22.05.2022

 */

import { codeBlock } from '@discordjs/builders';
import { BaseCommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export class Other {
	@Slash('ping', {
		description: 'Задержка бота',
	})
	private async test(int: BaseCommandInteraction<'cached'>): Promise<void> {
		await int.reply({
			embeds: [
				new MessageEmbed().setColor('BLURPLE').addFields([
					{
						name: '> WebSocket',
						value: codeBlock('fix', `${int.client.ws.ping}`),
						inline: true,
					},
					{
						name: '> Latency',
						value: codeBlock('fix', `${Math.abs(Date.now() - int.createdTimestamp)}`),
						inline: true,
					},
				]),
			],
		});
	}
}
