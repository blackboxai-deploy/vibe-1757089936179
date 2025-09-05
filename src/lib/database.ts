import { User, Artwork, Commission, Order, Message, Review } from '@/types';

// In-memory database simulation (in a real app, this would be a proper database)
class Database {
  private users: User[] = [];
  private artworks: Artwork[] = [];
  private commissions: Commission[] = [];
  private orders: Order[] = [];
  private messages: Message[] = [];
  private reviews: Review[] = [];

  constructor() {
    this.initializeSampleData();
  }

  // Initialize with sample data
  private initializeSampleData() {
    // Sample artists
    this.users.push({
      id: 'artist1',
      email: 'emma.waters@example.com',
      name: 'Emma Waters',
      role: 'artist',
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e339d44d-5d66-4210-af8b-f648b3d46dd3.png',
      createdAt: new Date().toISOString(),
      profile: {
        bio: 'Passionate watercolor artist specializing in landscapes and botanical illustrations. I find inspiration in nature\'s ever-changing moods and colors.',
        specialties: ['Landscape', 'Botanical', 'Seascape'],
        experience: '8 years',
        location: 'Portland, Oregon',
        website: 'www.emmawaters.art',
        socialMedia: {
          instagram: '@emmawaters_art',
          facebook: 'Emma Waters Art'
        },
        commissionSettings: {
          isAccepting: true,
          priceRange: { min: 150, max: 800 },
          turnaroundTime: '2-3 weeks',
          styles: ['Realistic', 'Impressionistic', 'Contemporary']
        },
        portfolio: []
      }
    });

    this.users.push({
      id: 'artist2',
      email: 'david.brush@example.com',
      name: 'David Brushworth',
      role: 'artist',
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/edd2dafc-a73e-4d40-baca-a88d619a43b2.png',
      createdAt: new Date().toISOString(),
      profile: {
        bio: 'Abstract watercolor painter exploring emotions through fluid forms and vibrant color combinations. Each piece tells a unique story.',
        specialties: ['Abstract', 'Contemporary', 'Experimental'],
        experience: '12 years',
        location: 'San Francisco, California',
        socialMedia: {
          instagram: '@davidbrush_art',
          twitter: '@brushworth'
        },
        commissionSettings: {
          isAccepting: true,
          priceRange: { min: 200, max: 1200 },
          turnaroundTime: '3-4 weeks',
          styles: ['Abstract', 'Contemporary', 'Expressive']
        },
        portfolio: []
      }
    });

    // Sample customer
    this.users.push({
      id: 'customer1',
      email: 'sarah.collector@example.com',
      name: 'Sarah Collector',
      role: 'customer',
      createdAt: new Date().toISOString(),
      profile: {
        favoriteStyles: ['Landscape', 'Abstract'],
        purchaseHistory: [],
        wishlist: []
      }
    });

    // Sample artworks
    this.artworks.push({
      id: 'artwork1',
      artistId: 'artist1',
      artistName: 'Emma Waters',
      title: 'Misty Mountain Dawn',
      description: 'A serene watercolor capturing the ethereal beauty of mountains shrouded in morning mist. Painted with transparent washes and delicate brushwork.',
      price: 350,
      images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2a2883d7-0c43-4e88-bd76-217287fe3920.png'],
      category: 'landscape',
      style: 'Realistic',
      medium: 'Watercolor on paper',
      dimensions: { width: 40, height: 30, unit: 'cm' },
      availability: 'available',
      tags: ['mountain', 'mist', 'dawn', 'nature', 'peaceful'],
      createdAt: new Date().toISOString(),
      featured: true
    });

    this.artworks.push({
      id: 'artwork2',
      artistId: 'artist1',
      artistName: 'Emma Waters',
      title: 'Wild Rose Garden',
      description: 'Delicate botanical study featuring wild roses in full bloom. Each petal is carefully rendered with attention to light and shadow.',
      price: 280,
      images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a36c71ad-1976-4e84-9870-3183dab97303.png'],
      category: 'floral',
      style: 'Realistic',
      medium: 'Watercolor on paper',
      dimensions: { width: 35, height: 25, unit: 'cm' },
      availability: 'available',
      tags: ['roses', 'flowers', 'botanical', 'garden', 'romantic'],
      createdAt: new Date().toISOString(),
      featured: false
    });

    this.artworks.push({
      id: 'artwork3',
      artistId: 'artist2',
      artistName: 'David Brushworth',
      title: 'Emotional Storm',
      description: 'An abstract expression of turbulent emotions using bold color washes and dynamic brushstrokes. The interplay of warm and cool tones creates depth.',
      price: 450,
      images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3f393f9d-4509-4880-9c66-2a12802f2024.png'],
      category: 'abstract',
      style: 'Abstract',
      medium: 'Watercolor on paper',
      dimensions: { width: 50, height: 35, unit: 'cm' },
      availability: 'available',
      tags: ['abstract', 'emotions', 'storm', 'dynamic', 'expressive'],
      createdAt: new Date().toISOString(),
      featured: true
    });

    this.artworks.push({
      id: 'artwork4',
      artistId: 'artist2',
      artistName: 'David Brushworth',
      title: 'Ocean Depths',
      description: 'Flowing watercolor interpretation of deep ocean currents. The painting captures the mysterious beauty of underwater landscapes.',
      price: 520,
      images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fad5cea1-1593-4eb1-9bb8-471ae2f56f4b.png'],
      category: 'seascape',
      style: 'Abstract',
      medium: 'Watercolor on paper',
      dimensions: { width: 45, height: 32, unit: 'cm' },
      availability: 'available',
      tags: ['ocean', 'water', 'depths', 'blue', 'flowing'],
      createdAt: new Date().toISOString(),
      featured: false
    });
  }

  // User methods
  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  // Artwork methods
  async getAllArtworks(): Promise<Artwork[]> {
    return [...this.artworks];
  }

  async getArtworksByArtist(artistId: string): Promise<Artwork[]> {
    return this.artworks.filter(artwork => artwork.artistId === artistId);
  }

  async getFeaturedArtworks(): Promise<Artwork[]> {
    return this.artworks.filter(artwork => artwork.featured);
  }

  async getArtworkById(id: string): Promise<Artwork | null> {
    return this.artworks.find(artwork => artwork.id === id) || null;
  }

  async createArtwork(artworkData: Omit<Artwork, 'id' | 'createdAt'>): Promise<Artwork> {
    const artwork: Artwork = {
      ...artworkData,
      id: `artwork_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    this.artworks.push(artwork);
    return artwork;
  }

  // Artist methods
  async getAllArtists(): Promise<User[]> {
    return this.users.filter(user => user.role === 'artist');
  }

  // Order methods
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const order: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.orders.push(order);
    return order;
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return this.orders.filter(order => order.customerId === customerId);
  }

  // Commission methods
  async createCommission(commissionData: Omit<Commission, 'id' | 'createdAt' | 'updatedAt'>): Promise<Commission> {
    const commission: Commission = {
      ...commissionData,
      id: `commission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.commissions.push(commission);
    return commission;
  }

  async getCommissionsByArtist(artistId: string): Promise<Commission[]> {
    return this.commissions.filter(commission => commission.artistId === artistId);
  }

  async getCommissionsByCustomer(customerId: string): Promise<Commission[]> {
    return this.commissions.filter(commission => commission.customerId === customerId);
  }

  // Message methods
  async createMessage(messageData: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<Message> {
    const message: Message = {
      ...messageData,
      id: `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.messages.push(message);
    return message;
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return this.messages.filter(
      message => 
        (message.senderId === userId1 && message.recipientId === userId2) ||
        (message.senderId === userId2 && message.recipientId === userId1)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Review methods
  async createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const review: Review = {
      ...reviewData,
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    this.reviews.push(review);
    return review;
  }

  async getReviewsForArtist(artistId: string): Promise<Review[]> {
    return this.reviews.filter(review => review.artistId === artistId);
  }

  async getReviewsForArtwork(artworkId: string): Promise<Review[]> {
    return this.reviews.filter(review => review.artworkId === artworkId);
  }
}

// Singleton database instance
const db = new Database();
export default db;