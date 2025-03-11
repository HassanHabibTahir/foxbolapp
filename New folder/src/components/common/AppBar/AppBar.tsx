import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Navigation } from './Navigation';
import { UserProfile } from './UserProfile';
import { type NavItem } from './types';

interface AppBarProps {
  logo?: React.ReactNode;
  navItems?: NavItem[];
  className?: string;
}

export function AppBar({
  logo = <span className="text-xl font-bold">Logo</span>,
  navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Imbounds', href: '/' },
    { label: 'Reports', href: '/' },
    { label: 'Settings', href: '/' },
  ],
  className,
}: AppBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`bg-background border-b ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              {logo}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <Navigation items={navItems} />
            </div>
          </div>

          {/* User Profile */}
          <div className="hidden md:block">
            <UserProfile />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground/80 hover:text-foreground focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="px-4">
              <UserProfile />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}