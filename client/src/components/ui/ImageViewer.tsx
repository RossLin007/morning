import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

interface ImageViewerProps {
    images: string[];
    initialIndex?: number;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * WeChat Moments-style Image Viewer
 * Features:
 * - Full-screen black background
 * - Swipe left/right to navigate
 * - Pinch to zoom
 * - Tap to close
 * - Page indicator
 */
export const ImageViewer: React.FC<ImageViewerProps> = ({
    images,
    initialIndex = 0,
    isOpen,
    onClose,
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Touch handling
    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
    const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
    const pinchStartDistanceRef = useRef<number | null>(null);
    const initialPinchScaleRef = useRef<number>(1);
    const lastTapTimeRef = useRef<number>(0);

    // Reset state when opening or changing initial index
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setScale(1);
            setPosition({ x: 0, y: 0 });
            setIsClosing(false);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, initialIndex]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 200);
    }, [onClose]);

    const goToNext = useCallback(() => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
    }, [currentIndex, images.length]);

    const goToPrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
    }, [currentIndex]);

    // Calculate pinch distance
    const getPinchDistance = (touches: React.TouchList) => {
        if (touches.length < 2) return 0;
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            // Single touch - for swipe/tap
            touchStartRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                time: Date.now(),
            };
            lastTouchRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
            if (scale > 1) {
                setIsDragging(true);
            }
        } else if (e.touches.length === 2) {
            // Pinch start
            pinchStartDistanceRef.current = getPinchDistance(e.touches);
            initialPinchScaleRef.current = scale;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 1 && lastTouchRef.current) {
            const deltaX = e.touches[0].clientX - lastTouchRef.current.x;
            const deltaY = e.touches[0].clientY - lastTouchRef.current.y;

            if (scale > 1 && isDragging) {
                // Pan when zoomed
                setPosition(prev => ({
                    x: prev.x + deltaX,
                    y: prev.y + deltaY,
                }));
            }

            lastTouchRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
        } else if (e.touches.length === 2 && pinchStartDistanceRef.current) {
            // Pinch zoom
            const currentDistance = getPinchDistance(e.touches);
            const scaleChange = currentDistance / pinchStartDistanceRef.current;
            const newScale = Math.max(1, Math.min(4, initialPinchScaleRef.current * scaleChange));
            setScale(newScale);

            if (newScale <= 1) {
                setPosition({ x: 0, y: 0 });
            }
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        setIsDragging(false);

        if (touchStartRef.current && e.changedTouches.length === 1) {
            const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
            const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
            const deltaTime = Date.now() - touchStartRef.current.time;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Tap to close (small movement, short time)
            if (distance < 10 && deltaTime < 300 && scale === 1) {
                handleClose();
                return;
            }

            // Swipe to navigate (only when not zoomed)
            if (scale === 1 && Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100 && deltaTime < 500) {
                if (deltaX > 0) {
                    goToPrev();
                } else {
                    goToNext();
                }
            }

            // Swipe down to close
            if (scale === 1 && deltaY > 100 && Math.abs(deltaX) < 50 && deltaTime < 500) {
                handleClose();
            }
        }

        touchStartRef.current = null;
        pinchStartDistanceRef.current = null;
    };

    // Handle background click (single tap to close on desktop)
    const handleBackgroundClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const now = Date.now();
        if (now - lastTapTimeRef.current < 300) {
            // Double tap - toggle zoom
            if (scale > 1) {
                setScale(1);
                setPosition({ x: 0, y: 0 });
            } else {
                setScale(2);
            }
        } else {
            // Single tap - close (only on desktop, mobile uses touch events)
            // We check if it's a real click, not from touch
            if (e.detail === 1 && scale === 1) {
                handleClose();
            }
        }
        lastTapTimeRef.current = now;
    };

    if (!isOpen) return null;

    const viewerContent = (
        <div
            className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'
                }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleBackgroundClick}
        >
            {/* Close button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                }}
                className="absolute top-safe right-4 z-10 p-2 text-white/80 hover:text-white"
                style={{ top: 'max(16px, env(safe-area-inset-top))' }}
            >
                <Icon name="close" className="text-[28px]" />
            </button>

            {/* Image container */}
            <div
                className="w-full h-full flex items-center justify-center overflow-hidden"
                style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
            >
                <img
                    src={images[currentIndex]}
                    alt=""
                    className="max-w-full max-h-full object-contain select-none"
                    draggable={false}
                />
            </div>

            {/* Page indicator - Bottom of screen */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-[13px] font-medium"
                    style={{ bottom: 'max(16px, env(safe-area-inset-bottom))' }}>
                    {currentIndex + 1} / {images.length}
                </div>
            )}

            {/* Navigation arrows (desktop) */}
            {images.length > 1 && (
                <>
                    {currentIndex > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrev();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white hidden md:block"
                        >
                            <Icon name="chevron_left" className="text-[40px]" />
                        </button>
                    )}
                    {currentIndex < images.length - 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white hidden md:block"
                        >
                            <Icon name="chevron_right" className="text-[40px]" />
                        </button>
                    )}
                </>
            )}
        </div>
    );

    return createPortal(viewerContent, document.body);
};
