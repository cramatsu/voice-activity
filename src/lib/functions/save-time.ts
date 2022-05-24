import type { PrismaClient } from '@prisma/client';
import type { Snowflake } from 'discord.js';
import { container } from 'tsyringe';
import { kPrisma } from '../../tokens';

export const saveTime = async (userId: Snowflake, joinedAt: number): Promise<void> => {
	const prisma = container.resolve<PrismaClient>(kPrisma);

	const spentSeconds = Math.floor((Date.now() - joinedAt) / 1000);

	await prisma.user.upsert({
		where: {
			id: userId,
		},
		create: {
			id: userId,
			voiceTime: spentSeconds,
			voiceToday: spentSeconds,
		},
		update: {
			voiceTime: {
				increment: spentSeconds,
			},
			voiceToday: {
				increment: spentSeconds,
			},
		},
	});
};
