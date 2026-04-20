import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isDarkMode: false,
});

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme ?? 'dark');
  const [isLoading, setIsLoading] = useState(true);
  const [userPreference, setUserPreference] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const hasUserPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY + '_user_set');
        
        if (savedTheme && hasUserPreference) {
          // User has manually set a preference
          setTheme(savedTheme as Theme);
          setUserPreference(true);
        } else if (systemColorScheme) {
          // No user preference, follow system
          setTheme(systemColorScheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  // Update theme when system theme changes (only if user hasn't set a preference)
  useEffect(() => {
    if (!userPreference && systemColorScheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme, userPreference]);

  const toggleTheme = useCallback(async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY + '_user_set', 'true');
      setTheme(newTheme);
      setUserPreference(true);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [theme]);

  const isDarkMode = theme === 'dark';

  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
    // For Android
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }, [isDarkMode]);

  if (isLoading) {
    return null; // Or return a loading indicator if needed
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 