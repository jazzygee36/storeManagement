// src/app/api/auth/verifyToken/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract token

  if (!token) {
    return NextResponse.json({ message: 'Token is missing' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return NextResponse.json({ user: decoded });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
