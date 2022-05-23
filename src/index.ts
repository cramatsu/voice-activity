import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { DIService } from 'discordx';
import Redis from 'ioredis';
import { container } from 'tsyringe';
import { VAClient } from './VAClient';
import { logger } from './logger';
import { kPrisma, kRedis } from './tokens';

DIService.container = container;

const bot = new VAClient();

bot.init();

const prisma = new PrismaClient();
const redis = new Redis();

prisma.$connect();

container.register(kRedis, {
	useValue: redis,
});

container.register(kPrisma, {
	useValue: prisma,
});

process.on('unhandledRejection', (err: Error) => {
	logger.error({
		message: `Необработанная ошибка ${err.message}`,
	});
});
