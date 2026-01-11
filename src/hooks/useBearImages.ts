import { useState, useEffect } from 'react';

interface BearImages {
    watchBearImages: string[];
    hideBearImages: string[];
    peakBearImages: string[];
}

export function useBearImages(): BearImages {
    const [watchBearImages, setWatchBearImages] = useState<string[]>([]);
    const [hideBearImages, setHideBearImages] = useState<string[]>([]);
    const [peakBearImages, setPeakBearImages] = useState<string[]>([]);

    useEffect(() => {
        type ImageModule = { default: string };

        // Use absolute paths from project root to ensure correct URL resolution
        const watchImages = import.meta.glob<ImageModule>("/src/assets/watch_bear_*.png", { eager: true });
        const hideImages = import.meta.glob<ImageModule>("/src/assets/hide_bear_*.png", { eager: true });
        const peakImages = import.meta.glob<ImageModule>("/src/assets/peak_bear_*.png", { eager: true });

        const sortImages = (images: Record<string, ImageModule>) => {
            return Object.values(images)
                .map(img => img.default)
                .sort((a, b) => {
                    const aNum = parseInt(a.match(/\d+/)?.[0] || "0");
                    const bNum = parseInt(b.match(/\d+/)?.[0] || "0");
                    return aNum - bNum;
                });
        };

        setWatchBearImages(sortImages(watchImages));
        setHideBearImages(sortImages(hideImages));
        setPeakBearImages(sortImages(peakImages));
    }, []);

    return {
        watchBearImages,
        hideBearImages,
        peakBearImages
    };
}
