import React from 'react';
import { useTheme } from './ThemeProvider';
import { themes } from '../themes';

const ThemeSelector = () => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50 bg-card p-2 rounded-lg shadow-lg border border-border">
      <select 
        value={currentTheme.id}
        onChange={(e) => {
          const theme = themes.find(t => t.id === e.target.value);
          if (theme) setTheme(theme);
        }}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
          transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          focus-visible:ring-offset-2 text-foreground"
      >
        {themes.map(theme => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;