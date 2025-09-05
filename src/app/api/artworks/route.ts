import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const artistId = searchParams.get('artistId');

    let artworks;

    if (featured === 'true') {
      artworks = await db.getFeaturedArtworks();
    } else if (artistId) {
      artworks = await db.getArtworksByArtist(artistId);
    } else {
      artworks = await db.getAllArtworks();
    }

    return NextResponse.json({ artworks });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const artworkData = await request.json();
    
    // Basic validation
    if (!artworkData.title || !artworkData.price || !artworkData.artistId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const artwork = await db.createArtwork(artworkData);
    return NextResponse.json({ artwork }, { status: 201 });
  } catch (error) {
    console.error('Error creating artwork:', error);
    return NextResponse.json(
      { error: 'Failed to create artwork' },
      { status: 500 }
    );
  }
}