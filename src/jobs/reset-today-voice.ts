import 'reflect-metadata';
import { parentPort } from 'worker_threads';
import { PrismaClient } from '@prisma/client';

(async () => {
	const prisma = new PrismaClient();

	await prisma.user.updateMany({
		data: {
			voiceToday: 0,
		},
	});

	if (parentPort) parentPort.postMessage('done');
	else process.exit(0);
})();
