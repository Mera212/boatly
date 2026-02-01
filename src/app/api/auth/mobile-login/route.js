import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users } from '../auth/[...nextauth]/route';

const SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '7d' });

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
