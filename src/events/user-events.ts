import { PrismaClient } from '@prisma/client';
import { ArgsOf, Discord, On } from 'discordx';
import { inject, injectable } from 'tsyringe';
import { kPrisma } from '../tokens';

@Discord()
@injectable()
export class UserEvents {
	public constructor(@inject(kPrisma) public readonly prisma: PrismaClient) {}

	@On('guildMemberAdd')
	private async userJoinedGuild([user]: ArgsOf<'guildMemberAdd'>) {
		await this.prisma.user.upsert({
			where: {
				id: user.id,
			},
			create: {
				id: user.id,
			},
			update: {},
		});
	}

	@On('guildMemberRemove')
	private async userLeftGuild([user]: ArgsOf<'guildMemberRemove'>) {
		await this.prisma.user.delete({
			where: {
				id: user.id,
			},
		});
	}
}
