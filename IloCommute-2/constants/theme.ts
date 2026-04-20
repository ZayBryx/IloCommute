interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  buttonBackground: string;
  buttonText: string;
  cardBackground: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  // Map specific colors
  logoutButton: string;
  mapControlBackground: string;
  activeButton: string;
  inactiveButton: string;
  closeButton: string;
  backgroundShape: string;
  contentBackground: string;
  iconContainerBackground: string;
  iconContainerShadow: string;
  googleButton: string;
  guestButtonBorder: string;
}

interface ThemeConfig {
  colors: ThemeColors;
}

export const lightTheme: ThemeConfig = {
  colors: {
    primary: "#008000",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    text: "#000000",
    textSecondary: "#666666",
    border: "#E0E0E0",
    buttonBackground: "#008000",
    buttonText: "#FFFFFF",
    cardBackground: "#FFFFFF",
    error: "#FF0000",
    success: "#4CAF50",
    warning: "#FFC107",
    info: "#2196F3",
    // Map specific colors
    logoutButton: "#1D3754",
    mapControlBackground: "#008000",
    activeButton: "#076d08",
    inactiveButton: "#D3D3D3",
    closeButton: "#FF0000",
    backgroundShape: "#0037a4",
    contentBackground: "#ffffffe6",
    iconContainerBackground: "#0037a41a",
    iconContainerShadow: "#000",
    googleButton: "#00c99f",
    guestButtonBorder: "#ccc",
  },
};

export const darkTheme: ThemeConfig = {
  colors: {
    primary: "#07e500",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#FFFFFF",
    textSecondary: "#AAAAAA",
    border: "#333333",
    buttonBackground: "#07e500",
    buttonText: "#FFFFFF",
    cardBackground: "#242424",
    error: "#FF6B6B",
    success: "#81C784",
    warning: "#FFD54F",
    info: "#64B5F6",
    // Map specific colors
    logoutButton: "#1D3754",
    mapControlBackground: "#07e500",
    activeButton: "#076d08",
    inactiveButton: "#2A344480",
    closeButton: "#FF6B6B",
    backgroundShape: "#07e500",
    contentBackground: "#242424e6",
    iconContainerBackground: "#07e5001a",
    iconContainerShadow: "#000",
    googleButton: "#00c99f",
    guestButtonBorder: "#333",
  },
};

export type Theme = typeof lightTheme;
