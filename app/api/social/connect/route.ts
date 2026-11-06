import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { ok: false, error: 'Social OAuth is not configured. No account was connected and no token was stored. A platform-specific OAuth app and secure token storage are required.' },
    { status: 501 },
  );
}
