/**
 * 다크모드 토글 버튼
 */

import { useTheme } from "@/hooks/useTheme";

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        const themes = ["light", "dark", "system"] as const;
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const getIcon = () => {
        switch (theme) {
            case "light":
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                );
            case "dark":
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                );
            case "system":
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                );
        }
    };

    const getLabel = () => {
        switch (theme) {
            case "light":
                return "라이트";
            case "dark":
                return "다크";
            case "system":
                return "시스템";
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-lg
               text-gray-600 dark:text-gray-400
               hover:bg-gray-100 dark:hover:bg-gray-800
               transition-colors"
            title={`현재: ${getLabel()} 모드`}
        >
            {getIcon()}
            <span className="text-sm hidden sm:inline">{getLabel()}</span>
        </button>
    );
}

export default ThemeToggle;
