// lib/kv.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!
});

export interface RosterMember {
  name: string;
  rank: string[];
  chapters: string;
  joinDate: string;
  projectGroups: string[];
  tags: string[];
  contacts: {
    email: string;
    phone: string;
    instagram: string;
  };
}

export async function initializeRoster(members: RosterMember[]) {
  try {
    await redis.set('roster:all', members);
    return true;
  } catch (error) {
    console.error('Failed to initialize roster:', error);
    return false;
  }
}

export async function getAllMembers(): Promise<RosterMember[]> {
  try {
    const members = await redis.get<RosterMember[]>('roster:all');
    return members || [];
  } catch (error) {
    console.error('Failed to get members:', error);
    return [];
  }
}

export async function updateMember(member: RosterMember) {
  const members = await getAllMembers();
  const index = members.findIndex(m => m.name === member.name);
  
  if (index !== -1) {
    members[index] = member;
    await redis.set('roster:all', members);
    return true;
  }
  return false;
}