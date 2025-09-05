export interface User {
  id: string;
  email: string;
  name: string;
  role: 'artist' | 'customer';
  avatar?: string;
  createdAt: string;
  profile: ArtistProfile | CustomerProfile;
}

export interface ArtistProfile {
  bio: string;
  specialties: string[];
  experience: string;
  location: string;
  website?: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  commissionSettings: {
    isAccepting: boolean;
    priceRange: {
      min: number;
      max: number;
    };
    turnaroundTime: string;
    styles: string[];
  };
  portfolio: string[];
}

export interface CustomerProfile {
  favoriteStyles: string[];
  purchaseHistory: string[];
  wishlist: string[];
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Artwork {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: ArtworkCategory;
  style: string;
  medium: string;
  dimensions: {
    width: number;
    height: number;
    unit: 'cm' | 'inches';
  };
  availability: 'available' | 'sold' | 'reserved';
  tags: string[];
  createdAt: string;
  featured: boolean;
}

export interface Commission {
  id: string;
  customerId: string;
  customerName: string;
  artistId: string;
  artistName: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  style: string;
  medium: string;
  dimensions: {
    width: number;
    height: number;
    unit: 'cm' | 'inches';
  };
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  messages: Message[];
  referenceImages?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface OrderItem {
  artworkId: string;
  artworkTitle: string;
  artistName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface Review {
  id: string;
  orderId: string;
  artworkId: string;
  customerId: string;
  customerName: string;
  artistId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type ArtworkCategory = 
  | 'landscape'
  | 'portrait' 
  | 'abstract'
  | 'still-life'
  | 'floral'
  | 'animal'
  | 'seascape'
  | 'cityscape'
  | 'other';

export interface CartItem {
  artworkId: string;
  artwork: Artwork;
  quantity: number;
}



export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'artist' | 'customer';
}