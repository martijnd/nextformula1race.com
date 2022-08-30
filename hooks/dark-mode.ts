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
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleDarkMode() {
    localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    initDarkMode();
  }

  return {
    isDarkMode,
    toggleDarkMode,
    initDarkMode,
  };
}
