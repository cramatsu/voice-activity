import type { Snowflake } from 'discord.js';

export const keyspaces = {
	voiceSince: (userId: Snowflake) => `voice:${userId}:since`,
} as const;
