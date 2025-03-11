import { type NavItem } from './types';

interface NavigationProps {
  items: NavItem[];
}

export function Navigation({ items }: NavigationProps) {
  return (
    <div className="flex items-center space-x-4">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="text-foreground/80 hover:text-foreground transition-colors px-3 py-2 rounded-md text-sm font-medium"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}