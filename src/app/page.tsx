'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { Artwork, User } from '@/types';
import db from '@/lib/database';

export default function HomePage() {
  const { user } = useAuth();
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [featuredArtists, setFeaturedArtists] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedContent = async () => {
      try {
        const [artworks, artists] = await Promise.all([
          db.getFeaturedArtworks(),
          db.getAllArtists()
        ]);
        
        setFeaturedArtworks(artworks.slice(0, 6));
        setFeaturedArtists(artists.slice(0, 3));
      } catch (error) {
        console.error('Error loading featured content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedContent();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading beautiful artworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Beautiful 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 block">
              Watercolor Art
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with talented watercolor artists, buy original paintings, 
            or commission custom artwork that speaks to your soul.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/commission">Commission Art</Link>
            </Button>
          </div>
          
          {!user && (
            <div className="mt-8 p-4 bg-white/80 backdrop-blur rounded-lg max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-3">Join our community of artists and art lovers</p>
              <div className="flex gap-2">
                <Button asChild variant="ghost" className="flex-1">
                  <Link href="/register?role=customer">Join as Art Lover</Link>
                </Button>
                <Button asChild variant="ghost" className="flex-1">
                  <Link href="/register?role=artist">Join as Artist</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Artworks</h2>
          <p className="text-lg text-gray-600">Discover stunning watercolor paintings from our talented community</p>
        </div>
        
        {featuredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredArtworks.map((artwork) => (
              <Card key={artwork.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={artwork.images[0]}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                    <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                      {artwork.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {artwork.artistName}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{artwork.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">${artwork.price}</span>
                  <Button asChild>
                    <Link href={`/artwork/${artwork.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured artworks available at the moment.</p>
          </div>
        )}

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/marketplace">View All Artworks</Link>
          </Button>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Artists</h2>
          <p className="text-lg text-gray-600">Meet the talented watercolor artists in our community</p>
        </div>
        
        {featuredArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredArtists.map((artist) => (
              <Card key={artist.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center overflow-hidden">
                    {artist.avatar ? (
                      <Image
                        src={artist.avatar}
                        alt={artist.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {artist.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{artist.name}</h3>
                  {artist.role === 'artist' && artist.profile && 'specialties' in artist.profile && (
                    <div className="mb-3">
                      {artist.profile.specialties.slice(0, 2).map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="mr-1 mb-1">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {artist.role === 'artist' && artist.profile && 'bio' in artist.profile && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {artist.profile.bio}
                    </p>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/artist/${artist.id}`}>View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured artists available at the moment.</p>
          </div>
        )}

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/artists">Discover All Artists</Link>
          </Button>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Art Journey?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Whether you're looking to buy beautiful watercolor art or showcase your own work, 
            AquaArt is the perfect place to connect with the watercolor community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href={user ? "/marketplace" : "/register"}>
                {user ? "Browse Artworks" : "Get Started"}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-gray-900">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}