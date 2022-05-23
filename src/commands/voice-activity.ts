/**

 * @author cramatsu
 * (´｡• ω •｡`) ♡
 * @Date 22.05.2022

 */

import { codeBlock } from '@discordjs/builders';
import { PrismaClient } from '@prisma/client';
import { BaseCommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashGroup } from 'discordx';
import { Duration } from 'luxon';
import { inject, injectable } from 'tsyringe';
import { kPrisma } from '../tokens';

@Discord()
@injectable()
@SlashGroup({
	name: 'voice',
})
@SlashGroup('voice')
export class VoiceActivity {
	constructor(@inject(kPrisma) public readonly prisma: PrismaClient) {}

	@Slash('activity', {
		description: 'Ваше время, проведенное в голосовых каналах',
	})
	async showVoiceStats(int: BaseCommandInteraction<'cached'>) {
		const user = await this.prisma.user.upsert({
			where: {
				id: int.user.id,
			},
			update: {},
			create: {
				id: int.user.id,
			},
			select: {
				voiceTime: true,
			},
		});

		await int.reply({
			embeds: [
				new MessageEmbed()
					.setDescription(
						codeBlock(
							`Голосовой онлайн ${Duration.fromObject({
								seconds: user.voiceTime,
							}).toFormat("h 'час.' m 'мин.'")}`,
						),
					)
					.setColor('BLURPLE'),
			],
		});
	}
}
