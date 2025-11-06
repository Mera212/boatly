import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Marina from '@/models/Marina';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'landlord') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const marina = await Marina.findOne({ landlordId: session.user.id });
    return NextResponse.json(marina || {});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'landlord') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, address } = await request.json();
    
    await connectDB();
    
    let marina = await Marina.findOne({ landlordId: session.user.id });
    
    if (marina) {
      marina.name = name;
      marina.address = address;
      await marina.save();
    } else {
      marina = await Marina.create({
        name,
        address,
        landlordId: session.user.id
      });
    }

    return NextResponse.json(marina);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}