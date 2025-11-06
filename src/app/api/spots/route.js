import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Spot from '@/models/Spot';
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
    if (!marina) {
      return NextResponse.json({ error: 'Marina not found' }, { status: 404 });
    }

    const spots = await Spot.find({ marinaId: marina._id });
    return NextResponse.json(spots);
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

    const { name, size, price } = await request.json();
    
    await connectDB();
    
    const marina = await Marina.findOne({ landlordId: session.user.id });
    if (!marina) {
      return NextResponse.json({ error: 'Marina not found' }, { status: 404 });
    }

    const spot = await Spot.create({
      name,
      size,
      price,
      marinaId: marina._id
    });

    return NextResponse.json(spot);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'landlord') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, size, price } = await request.json();
    
    await connectDB();
    
    const marina = await Marina.findOne({ landlordId: session.user.id });
    if (!marina) {
      return NextResponse.json({ error: 'Marina not found' }, { status: 404 });
    }

    const spot = await Spot.findOneAndUpdate(
      { _id: id, marinaId: marina._id },
      { name, size, price },
      { new: true }
    );

    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    return NextResponse.json(spot);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'landlord') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    
    await connectDB();
    
    const marina = await Marina.findOne({ landlordId: session.user.id });
    if (!marina) {
      return NextResponse.json({ error: 'Marina not found' }, { status: 404 });
    }

    const spot = await Spot.findOneAndDelete({ _id: id, marinaId: marina._id });
    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}