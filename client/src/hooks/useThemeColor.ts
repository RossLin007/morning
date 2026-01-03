import { useEffect } from 'react';

/**
 * Hook to dynamically update the browser's theme-color meta tag.
 * This controls the status bar color on mobile PWA apps.
 * 
 * @param color - The color to set (e.g., '#EDEDED')
 */
export const useThemeColor = (color: string) => {
    useEffect(() => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
        } else {
            // Create the meta tag if it doesn't exist
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = color;
            document.head.appendChild(meta);
        }

        // Cleanup: Optional - could reset to a default on unmount
        // But typically we want the color to persist until another page sets it
    }, [color]);
};

/**
 * Helper to get the appropriate theme color based on dark mode preference.
 * Uses the Native Header spec: #EDEDED (light) / #111 (dark)
 */
export const getNativeHeaderColor = (isDark: boolean): string => {
    return isDark ? '#111111' : '#EDEDED';
};
