export const DARK_MODE_LOGO_SRC = "/Favicon-To-Do.png";
export const LIGHT_MODE_LOGO_SRC = "/Favicon-To-Do%20Light.png";

export const getBrandLogoSrc = (isDarkMode: boolean) =>
  isDarkMode ? DARK_MODE_LOGO_SRC : LIGHT_MODE_LOGO_SRC;
