'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { User, ArtistProfile } from '@/types';
import db from '@/lib/database';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<User[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const allArtists = await db.getAllArtists();
        setArtists(allArtists);
        setFilteredArtists(allArtists);
      } catch (error) {
        console.error('Error loading artists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtists();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = artists.filter(artist => {
        const matchesName = artist.name.toLowerCase().includes(query);
        const matchesBio = artist.profile && 'bio' in artist.profile 
          ? artist.profile.bio.toLowerCase().includes(query)
          : false;
        const matchesSpecialties = artist.profile && 'specialties' in artist.profile
          ? artist.profile.specialties.some(specialty => 
              specialty.toLowerCase().includes(query)
            )
          : false;
        const matchesLocation = artist.profile && 'location' in artist.profile
          ? artist.profile.location.toLowerCase().includes(query)
          : false;

        return matchesName || matchesBio || matchesSpecialties || matchesLocation;
      });
      setFilteredArtists(filtered);
    } else {
      setFilteredArtists(artists);
    }
  }, [artists, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading artists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Featured Artists</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover talented watercolor artists from our community. 
          Each artist brings their unique style and perspective to create beautiful works of art.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <Label htmlFor="search" className="sr-only">Search artists</Label>
        <Input
          id="search"
          placeholder="Search artists by name, specialty, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Artists Grid */}
      {filteredArtists.length > 0 ? (
        <div>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Showing {filteredArtists.length} of {artists.length} artists
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.map((artist) => {
              const profile = artist.profile as ArtistProfile;
              
              return (
                <Card key={artist.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
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
                    <h3 className="text-xl font-semibold text-gray-900">{artist.name}</h3>
                    {profile.location && (
                      <p className="text-sm text-muted-foreground">{profile.location}</p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Specialties */}
                    {profile.specialties && profile.specialties.length > 0 && (
                      <div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {profile.specialties.slice(0, 3).map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {profile.specialties.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{profile.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {profile.bio && (
                      <p className="text-sm text-gray-600 text-center line-clamp-3">
                        {profile.bio}
                      </p>
                    )}

                    {/* Experience */}
                    {profile.experience && (
                      <div className="text-center">
                        <span className="text-xs text-muted-foreground">
                          {profile.experience} experience
                        </span>
                      </div>
                    )}

                    {/* Commission Status */}
                    {profile.commissionSettings && (
                      <div className="text-center">
                        <Badge 
                          variant={profile.commissionSettings.isAccepting ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {profile.commissionSettings.isAccepting 
                            ? "Accepting Commissions" 
                            : "Not Available for Commissions"
                          }
                        </Badge>
                        {profile.commissionSettings.isAccepting && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ${profile.commissionSettings.priceRange.min} - ${profile.commissionSettings.priceRange.max}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button asChild className="flex-1">
                        <Link href={`/artist/${artist.id}`}>View Profile</Link>
                      </Button>
                      {profile.commissionSettings?.isAccepting && (
                        <Button asChild variant="outline" className="flex-1">
                          <Link href={`/commission?artist=${artist.id}`}>Commission</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-4xl">👨‍🎨</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">No artists found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? 'Try adjusting your search to find artists.'
              : 'No artists are currently available.'}
          </p>
          {searchQuery && (
            <Button onClick={() => setSearchQuery('')} variant="outline">
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Are You an Artist?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our community of talented watercolor artists. Showcase your work, 
          connect with art lovers, and grow your creative business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register?role=artist">Join as Artist</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}