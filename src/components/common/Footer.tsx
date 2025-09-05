import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                AA
              </div>
              <span className="font-bold text-xl">AquaArt</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A vibrant community marketplace for watercolor artists and art enthusiasts. 
              Discover unique paintings and connect directly with talented artists.
            </p>
          </div>

          {/* Marketplace Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Marketplace</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/marketplace" className="transition-colors hover:text-foreground">
                  Browse Artworks
                </Link>
              </li>
              <li>
                <Link href="/artists" className="transition-colors hover:text-foreground">
                  Featured Artists
                </Link>
              </li>
              <li>
                <Link href="/commission" className="transition-colors hover:text-foreground">
                  Commission Art
                </Link>
              </li>
              <li>
                <Link href="/categories" className="transition-colors hover:text-foreground">
                  Art Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-foreground">
                  Art Blog
                </Link>
              </li>
              <li>
                <Link href="/events" className="transition-colors hover:text-foreground">
                  Community Events
                </Link>
              </li>
              <li>
                <Link href="/join-artists" className="transition-colors hover:text-foreground">
                  Join as Artist
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="transition-colors hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="transition-colors hover:text-foreground">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="transition-colors hover:text-foreground">
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 mt-8 border-t border-border">
          <div className="text-sm text-muted-foreground">
            © 2024 AquaArt Marketplace. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/community-guidelines" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Community Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}