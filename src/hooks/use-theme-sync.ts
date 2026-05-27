import { useEffect } from "react";

export const useThemeSync = (theme: "dark" | "light") => {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
};
