'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Artwork, ArtworkCategory } from '@/types';
import db from '@/lib/database';

const CATEGORIES: ArtworkCategory[] = [
  'landscape', 'portrait', 'abstract', 'still-life', 
  'floral', 'animal', 'seascape', 'cityscape', 'other'
];

const PRICE_RANGES = [
  { label: 'Under $200', min: 0, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: 'Over $1000', min: 1000, max: Infinity }
];

function MarketplacePageContent() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState('newest');
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const allArtworks = await db.getAllArtworks();
        setArtworks(allArtworks);
        setFilteredArtworks(allArtworks);
        
        // Handle URL search parameter
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
          setSearchQuery(urlSearch);
        }
      } catch (error) {
        console.error('Error loading artworks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworks();
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...artworks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(artwork => 
        artwork.title.toLowerCase().includes(query) ||
        artwork.description.toLowerCase().includes(query) ||
        artwork.artistName.toLowerCase().includes(query) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(artwork => 
        selectedCategories.includes(artwork.category)
      );
    }

    // Apply price range filter
    if (selectedPriceRange) {
      const priceRange = PRICE_RANGES.find(range => range.label === selectedPriceRange);
      if (priceRange) {
        filtered = filtered.filter(artwork => 
          artwork.price >= priceRange.min && artwork.price <= priceRange.max
        );
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artistName.localeCompare(b.artistName);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredArtworks(filtered);
  }, [artworks, searchQuery, selectedCategories, selectedPriceRange, sortBy]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedPriceRange('');
    setSortBy('newest');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading artworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
        <p className="text-lg text-gray-600">Discover beautiful watercolor artworks from talented artists</p>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <Label htmlFor="search" className="text-sm font-medium mb-2 block">Search</Label>
                <Input
                  id="search"
                  placeholder="Search artworks, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Categories</Label>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category, checked as boolean)
                        }
                      />
                      <Label htmlFor={category} className="text-sm capitalize cursor-pointer">
                        {category.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Price Range</Label>
                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((range) => (
                      <SelectItem key={range.label} value={range.label}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing {filteredArtworks.length} of {artworks.length} artworks
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="text-sm">Sort by:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="artist">Artist A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Artworks Grid */}
          {filteredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredArtworks.map((artwork) => (
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
                      {artwork.availability !== 'available' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive" className="text-white">
                            {artwork.availability.toUpperCase()}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {artwork.artistName}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{artwork.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {artwork.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
                    </div>
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
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-4xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">No artworks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategories.length > 0 || selectedPriceRange
                  ? 'Try adjusting your filters to see more results.'
                  : 'No artworks are currently available.'}
              </p>
              {(searchQuery || selectedCategories.length > 0 || selectedPriceRange) && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading marketplace...</div>}>
      <MarketplacePageContent />
    </Suspense>
  );
}