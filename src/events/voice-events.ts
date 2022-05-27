import type { ArgsOf } from 'discordx';
import { Discord, On } from 'discordx';
import Redis from 'ioredis';
import { inject, injectable } from 'tsyringe';
import { keyspaces } from '../keyspaces';
import { saveTime } from '../lib/functions/save-time';
import { kRedis } from '../tokens';

@Discord()
@injectable()
export class Voice {
	public constructor(@inject(kRedis) public readonly redis: Redis) {}
	@On('voiceStateUpdate')
	private async voiceStateChanged([oldState, newState]: ArgsOf<'voiceStateUpdate'>) {
		/*
		 * Стоп-условие, исключающее события, не связанные с выходом/входом
		 * */
		if (oldState.channelId === newState.channelId) return;

		if (newState.channel) {
			if (oldState.channel) return;
			await this.redis.set(keyspaces.voiceSince(newState.id), Date.now());
		} else {
			const joinedAt = (await this.redis.get(keyspaces.voiceSince(oldState.id))) as unknown as number;
			await saveTime(oldState.id, joinedAt);
			await this.redis.del(keyspaces.voiceSince(oldState.id));
		}
	}
}
