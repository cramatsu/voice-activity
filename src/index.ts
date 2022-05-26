import 'reflect-metadata';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import Bree from 'bree';
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
const redis = new Redis(process.env.REDISHOST ?? 'localhost');

prisma.$connect();

container.register(kRedis, {
	useValue: redis,
});

container.register(kPrisma, {
	useValue: prisma,
});

const bree = new Bree({
	root: true,
	logger: false,
	jobs: [
		{
			name: 'Сброс дневного онлайна',
			path: join(__dirname, 'jobs', 'reset-today-voice.js'),
			interval: 'at 12:00 am',
		},
	],
	errorHandler: (error: Error, workerMetadata) => {
		logger.error({
			message: `Ошибка выполнения работы ${workerMetadata.name}: ${error.message}`,
		});
	},
});

bree.start();

bree.on('worker created', (name: string) => {
	logger.info({
		message: `Запущена работа: ${name}`,
	});
});
bree.on('worker deleted', (name: string) => {
	logger.info({
		message: `Удалена работа: ${name}`,
	});
});
process.on('unhandledRejection', (err: Error) => {
	logger.error({
		message: `Необработанная ошибка ${err.message}\n${err.stack}`,
	});
});
