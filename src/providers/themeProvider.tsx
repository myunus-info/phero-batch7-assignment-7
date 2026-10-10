"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isMounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "devjudge_theme";

const subscribers = new Set<() => void>();

function notify() {
  subscribers.forEach((cb) => {
    cb();
  });
}

function subscribe(callback: () => void) {
  subscribers.add(callback);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };

  const mediaQuery =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

  const handleMedia = () => callback();

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
    mediaQuery?.addEventListener("change", handleMedia);
  }

  return () => {
    subscribers.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
      mediaQuery?.removeEventListener("change", handleMedia);
    }
  };
}

function getSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage may be disabled
  }
  return "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

const emptySubscribe = () => () => {};

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const rawTheme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const theme: Theme = isMounted ? rawTheme : defaultTheme;

  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? getSystemTheme() : theme;

  // Synchronize with documentElement whenever resolvedTheme changes
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // localStorage may be disabled
    }
    notify();
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isMounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
