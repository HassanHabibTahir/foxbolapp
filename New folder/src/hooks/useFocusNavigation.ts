// hooks/useFocusNavigation.ts
import { useRef, useEffect } from 'react';
import { focusFirstInput } from '../config/focusUtils';

export function useFocusNavigation(refs: React.RefObject<HTMLElement>[]) {
  const currentIndex = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex.current = (currentIndex.current + 1) % refs.length;
        focusFirstInput(refs[currentIndex.current].current);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex.current = (currentIndex.current - 1 + refs.length) % refs.length;
        focusFirstInput(refs[currentIndex.current].current);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [refs]);
}