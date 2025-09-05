import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    const artists = await db.getAllArtists();
    return NextResponse.json({ artists });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}