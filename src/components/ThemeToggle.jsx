import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "group fixed fixed-max-sm:hidden top-5 right-4 z-50", // 👈 spacing fix
        "flex flex-col items-center gap-1",
        "p-2 rounded-full",
        "transition-all duration-300",
        "focus:outline-hidden"
      )}
    >
      {/* Icon with subtle glow */}
      <span
        className={cn(
          "relative",
          "transition-transform duration-300",
          "group-hover:scale-110",
          isDarkMode
            ? "drop-shadow-[0_0_8px_rgba(253,224,71,0.35)]"
            : "drop-shadow-[0_0_8px_rgba(59,130,246,0.35)]"
        )}
      >
        {isDarkMode ? (
          <Sun className="h-6 w-6 text-yellow-300" />
        ) : (
          <Moon className="h-6 w-6 text-blue-900 dark:text-blue-300" />
        )}
      </span>

      {/* Fade + slide text */}
      <span
        className={cn(
          "text-[10px] font-medium text-foreground/60",
          "opacity-0 translate-y-1",
          "group-hover:opacity-100 group-hover:translate-y-0",
          "transition-all duration-300 ease-out"
        )}
      >
        {isDarkMode ? "Light Mode" : "Try Dark Mode"}
      </span>
    </button>
  );
};
