import { useState } from 'react';

export function useDarkMode(initial = true) {
  const [isDarkMode, setIsDarkMode] = useState(initial);
  function initDarkMode() {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }

  function toggleDarkMode() {
    localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light';
    setIsDarkMode((current) => !current);
    initDarkMode();
  }

  return {
    isDarkMode,
    toggleDarkMode,
    initDarkMode,
  };
}
