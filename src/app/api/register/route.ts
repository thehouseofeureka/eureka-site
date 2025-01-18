// app/api/register/route.ts
import { getAllMembers } from '@/lib/kv';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!
});

export async function POST(req: Request) {
  try {
    const newMember = await req.json();
    
    // Get existing members
    const members = await getAllMembers();
    
    // Add new member
    members.push(newMember);
    
    // Update Redis
    await redis.set('roster:all', members);
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to register' }, { status: 500 });
  }
}