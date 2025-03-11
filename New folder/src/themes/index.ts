export type Theme = {
  name: string;
  id: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    focus: string;
  };
};

export const themes: Theme[] = [
  {
    name: "Cyber Purple",
    id: "cyber-purple",
    colors: {
      background: "#13111C",
      foreground: "#FFFFFF",
      card: "#1C1827",
      cardForeground: "#FFFFFF",
      popover: "#1C1827",
      popoverForeground: "#FFFFFF",
      primary: "#A78BFA",
      primaryForeground: "#FFFFFF",
      secondary: "#2D2B35",
      secondaryForeground: "#FFFFFF",
      muted: "#2D2B35",
      mutedForeground: "#A1A1AA",
      accent: "#2D2B35",
      accentForeground: "#FFFFFF",
      destructive: "#FF5555",
      destructiveForeground: "#FFFFFF",
      border: "#2D2B35",
      input: "#2D2B35",
      ring: "#A78BFA",
      focus: "#A78BFA80"
    }
  },
  {
    name: "Ocean Wave",
    id: "ocean-wave",
    colors: {
      background: "#0F172A",
      foreground: "#E2E8F0",
      card: "#1E293B",
      cardForeground: "#E2E8F0",
      popover: "#1E293B",
      popoverForeground: "#E2E8F0",
      primary: "#38BDF8",
      primaryForeground: "#FFFFFF",
      secondary: "#334155",
      secondaryForeground: "#E2E8F0",
      muted: "#334155",
      mutedForeground: "#94A3B8",
      accent: "#334155",
      accentForeground: "#E2E8F0",
      destructive: "#EF4444",
      destructiveForeground: "#FFFFFF",
      border: "#334155",
      input: "#334155",
      ring: "#38BDF8",
      focus: "#38BDF880"
    }
  },
  {
    name: "Neon Future",
    id: "neon-future",
    colors: {
      background: "#09090B",
      foreground: "#ECEDEE",
      card: "#18181B",
      cardForeground: "#ECEDEE",
      popover: "#18181B",
      popoverForeground: "#ECEDEE",
      primary: "#00FF9D",
      primaryForeground: "#000000",
      secondary: "#27272A",
      secondaryForeground: "#ECEDEE",
      muted: "#27272A",
      mutedForeground: "#A1A1AA",
      accent: "#27272A",
      accentForeground: "#ECEDEE",
      destructive: "#FF0055",
      destructiveForeground: "#FFFFFF",
      border: "#27272A",
      input: "#27272A",
      ring: "#00FF9D",
      focus: "#00FF9D80"
    }
  }
];

export const defaultTheme = themes[0];