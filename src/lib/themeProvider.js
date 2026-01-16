// lib/themeProvider.js
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import clsx from "clsx";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Try to get theme from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "classic";
    }
    return "classic";
  });
  const [showThemeList, setShowThemeList] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      console.log("Theme changed to:", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const themes = ["void", "corpus", "grineer", "orokin", "classic"];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const selectTheme = (newTheme) => {
    console.log("Selecting theme:", newTheme);
    setTheme(newTheme);
    setShowThemeList(false);
  };

  const value = useMemo(() => ({ theme, setTheme, toggleTheme, selectTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {/* Floating theme selector icon */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowThemeList(!showThemeList)}
          className='bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors'
          aria-label="Select theme"
        >
          {/* Replace with an icon, e.g., from react-icons or lucide-react */}
          🎨 {/* Placeholder icon; import an actual icon like <PaletteIcon /> */}
        </button>
        {showThemeList && (
          <div className="absolute bottom-full right-0 mb-2 bg-classic-bg border border-classic-border rounded-lg shadow-lg p-2 min-w-[120px]">
            {["void", "corpus", "grineer", "orokin", "dark", "classic"].map((t) => (
              <button
                key={t}
                onClick={() => selectTheme(t)}
                className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 capitalize ${
                  theme === t ? "font-bold" : ""
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;