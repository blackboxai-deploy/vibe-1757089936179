'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { Artwork, User } from '@/types';
import db from '@/lib/database';

export default function ArtworkPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [artist, setArtist] = useState<User | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtworkData = async () => {
      try {
        if (!params.id) return;

        const artworkData = await db.getArtworkById(params.id as string);
        
        if (!artworkData) {
          setError('Artwork not found');
          return;
        }

        setArtwork(artworkData);

        // Load artist info
        const artistData = await db.findUserById(artworkData.artistId);
        setArtist(artistData);

        // Load related artworks by same artist
        const artistArtworks = await db.getArtworksByArtist(artworkData.artistId);
        const related = artistArtworks
          .filter(a => a.id !== artworkData.id)
          .slice(0, 3);
        setRelatedArtworks(related);

      } catch (error) {
        console.error('Error loading artwork:', error);
        setError('Failed to load artwork');
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworkData();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'customer') {
      alert('Only customers can add items to cart');
      return;
    }

    // TODO: Implement cart functionality
    alert('Added to cart! (Cart functionality coming soon)');
  };

  const handleContactArtist = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    // TODO: Implement messaging functionality
    alert('Message artist feature coming soon!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (error || !artwork || !artist) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Artwork Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'The artwork you\'re looking for doesn\'t exist.'}
          </p>
          <Button asChild>
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Artwork Image */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={artwork.images[0]}
              alt={artwork.title}
              fill
              className="object-cover"
              priority
            />
            {artwork.availability !== 'available' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-white text-lg px-4 py-2">
                  {artwork.availability.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Artwork Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">{artwork.category}</Badge>
              {artwork.featured && (
                <Badge variant="default">Featured</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
            <p className="text-xl text-primary font-semibold">${artwork.price}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{artwork.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Medium:</span>
                  <span>{artwork.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Style:</span>
                  <span>{artwork.style}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span>
                    {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <span className="capitalize">{artwork.availability}</span>
                </div>
              </div>
            </div>

            {artwork.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {artwork.availability === 'available' && (
              <Button 
                onClick={handleAddToCart} 
                size="lg" 
                className="w-full"
                disabled={user?.role === 'artist'}
              >
                {user?.role === 'artist' ? 'Artists Cannot Purchase' : 'Add to Cart'}
              </Button>
            )}
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleContactArtist} className="flex-1">
                Message Artist
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/commission">Commission Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Artist Info */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-bold">About the Artist</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={artist.avatar} alt={artist.name} />
              <AvatarFallback className="text-lg">
                {artist.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{artist.name}</h3>
              {artist.profile && 'bio' in artist.profile && (
                <p className="text-gray-600 mb-3">{artist.profile.bio}</p>
              )}
              {artist.profile && 'specialties' in artist.profile && artist.profile.specialties.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {artist.profile.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button asChild variant="outline">
                <Link href={`/artist/${artist.id}`}>View Full Profile</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Artworks */}
      {relatedArtworks.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">More from {artist.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArtworks.map((relatedArtwork) => (
              <Card key={relatedArtwork.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={relatedArtwork.images[0]}
                    alt={relatedArtwork.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{relatedArtwork.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{relatedArtwork.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">${relatedArtwork.price}</span>
                    <Button asChild size="sm">
                      <Link href={`/artwork/${relatedArtwork.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}