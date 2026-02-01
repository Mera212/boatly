import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Marina from '@/models/Marina';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import jwt from 'jsonwebtoken';

const SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

async function getUserFromRequest(request) {
  // Prefer NextAuth session
  const session = await getServerSession(authOptions);
  if (session && session.user) return { id: session.user.id, role: session.user.role };

  // Fallback: Bearer JWT in Authorization header
  try {
    const auth = request?.headers?.get?.('authorization') || '';
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      const payload = jwt.verify(token, SECRET);
      return { id: payload.id || payload.sub, role: payload.role };
    }
  } catch (e) {
    // ignore and fall through
  }
  return null;
}

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'landlord') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const marina = await Marina.findOne({ landlordId: user.id });
    return NextResponse.json(marina || {});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'landlord') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, address } = await request.json();
    
    await connectDB();
    
    let marina = await Marina.findOne({ landlordId: user.id });
    
    if (marina) {
      marina.name = name;
      marina.address = address;
      await marina.save();
    } else {
      marina = await Marina.create({
        name,
        address,
        landlordId: user.id
      });
    }

    return NextResponse.json(marina);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}