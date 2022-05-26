/**

 * @author cramatsu
 * (´｡• ω •｡`) ♡
 * @Date 22.05.2022

 */

import { Get, Router } from '@discordx/koa';
import { PrismaClient } from '@prisma/client';
import type { RouterContext } from 'koa-router';
import { inject, injectable } from 'tsyringe';
import { kPrisma } from '../../tokens';

@Router({
	name: 'UserRouter',
	description: 'Путь для получения данных о пользователях',
})
@injectable()
export class UserRouter {
	public constructor(@inject(kPrisma) public readonly prisma: PrismaClient) {}

	@Get('/user/:id/voice')
	async getVoiceTime(ctx: RouterContext): Promise<void> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: ctx.params.id,
			},
			select: {
				voiceTime: true,
				voiceToday: true,
			},
		});

		if (user) {
			ctx.res.statusCode = 200;
			ctx.body = user;
		} else {
			ctx.res.statusCode = 404;
		}
	}
}
