import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', changeTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('sim-theme');
    const t = saved === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    return t;
  });

  const changeTheme = (next) => {
    if (next !== 'dark' && next !== 'light') return;
    document.documentElement.classList.add('transitioning');
    setTimeout(() => document.documentElement.classList.remove('transitioning'), 350);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sim-theme', next);
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
