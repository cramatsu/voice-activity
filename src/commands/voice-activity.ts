/**

 * @author cramatsu
 * (´｡• ω •｡`) ♡
 * @Date 22.05.2022

 */

import { codeBlock } from '@discordjs/builders';
import { PrismaClient } from '@prisma/client';
import { BaseCommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashGroup } from 'discordx';
import Redis from 'ioredis';
import { Duration } from 'luxon';
import { inject, injectable } from 'tsyringe';
import { keyspaces } from '../keyspaces';
import { kPrisma, kRedis } from '../tokens';

@Discord()
@injectable()
@SlashGroup({
	name: 'voice',
})
@SlashGroup('voice')
export class VoiceActivity {
	constructor(@inject(kPrisma) public readonly prisma: PrismaClient, @inject(kRedis) public readonly redis: Redis) {}

	@Slash('leaders', {
		description: 'Топ-5 лидеров по голосовому онлайну',
	})
	async voiceLeaders(int: BaseCommandInteraction<'cached'>) {
		const users = await this.prisma.user.groupBy({
			by: ['voiceTime', 'id'],
			orderBy: {
				voiceTime: 'desc',
			},
			take: 5,
		});

		if (users.length < 1) {
			return int.reply({
				content: codeBlock('diff', '- Недостаточно участников для подсчета'),
			});
		}

		const leaderEmbed = new MessageEmbed();

		leaderEmbed.setColor('BLURPLE');

		const leader = await int.guild.members.fetch(users[0].id);

		if (leader) {
			leaderEmbed.setAuthor({
				name: `Лидер - ${leader.user.username}`,
				iconURL: leader.user.displayAvatarURL(),
			});
		}

		for (const user of users) {
			const member = await int.guild.members.fetch(user.id);

			if (member) {
				leaderEmbed.addField(
					member.user.username ?? 'Анонимный пользователь',
					codeBlock(
						Duration.fromObject({
							seconds: user.voiceTime,
						}).toFormat("h 'час.' m 'мин.'"),
					),
					false,
				);
			}
		}

		await int.reply({
			embeds: [leaderEmbed],
		});
	}

	@Slash('session', {
		description: 'Длительность текущего голосового сеанса',
	})
	async voiceSession(int: BaseCommandInteraction<'cached'>) {
		if (int.member.voice.channelId) {
			const voiceSince = (await this.redis.get(keyspaces.voiceSince(int.user.id))) as unknown as number;
			const spentSeconds = Math.floor((Date.now() - voiceSince) / 1000);
			await int.reply({
				embeds: [
					new MessageEmbed()
						.addField(
							'> Длительность сессии',
							codeBlock(
								Duration.fromObject({
									seconds: spentSeconds,
								}).toFormat("h 'час.' m 'мин.' s 'сек.'"),
							),
						)
						.setColor('BLURPLE'),
				],
			});
		} else {
			await int.reply({
				content: codeBlock('diff', '- Вы не находитесь в голосом канале!'),
				ephemeral: true,
			});
		}
	}

	@Slash('activity', {
		description: 'Ваше время, проведенное в голосовых каналах',
	})
	async voiceStats(int: BaseCommandInteraction<'cached'>) {
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
				voiceToday: true,
			},
		});

		await int.reply({
			embeds: [
				new MessageEmbed()
					.setAuthor({
						name: `Голосовой онлайн ${int.user.username}`,
						iconURL: int.user.displayAvatarURL(),
					})
					.addField(
						'> Общий онлайн',
						codeBlock(
							Duration.fromObject({
								seconds: user.voiceTime,
							}).toFormat("h 'час.' m 'мин.'"),
						),
						true,
					)
					.addField(
						'> Сегодня',
						codeBlock(
							Duration.fromObject({
								seconds: user.voiceToday,
							}).toFormat("h 'час.' m 'мин.'"),
						),
						true,
					)
					.setColor('BLURPLE'),
			],
		});
	}
}
