// src/hooks/useTheme.ts

/**
 * 다크모드 적용 훅
 */

import { useEffect } from "react";
import { useThemeStore, getEffectiveTheme } from "@/store/themeStore";

export function useTheme() {
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        const root = window.document.documentElement;
        const effectiveTheme = getEffectiveTheme(theme);

        // dark 클래스 토글
        root.classList.remove("light", "dark");
        root.classList.add(effectiveTheme);

        // OS 테마 변경 감지 (system 모드일 때)
        if (theme === "system") {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)",
            );

            const handleChange = () => {
                root.classList.remove("light", "dark");
                root.classList.add(mediaQuery.matches ? "dark" : "light");
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

    return { theme, setTheme };
}
