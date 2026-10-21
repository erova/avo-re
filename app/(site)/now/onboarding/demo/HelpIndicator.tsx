'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface HelpIndicatorProps {
  targetSelector: string;
  onClick?: () => void;
}

/**
 * HelpIndicator - Pulsing badge showing which elements have help
 * 
 * Shows a pulsing pink badge with ? icon on elements that have onboarding.
 * Positioned at top-right corner of the target element.
 */
export function HelpIndicator({ targetSelector, onClick }: HelpIndicatorProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const element = document.querySelector(targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.top - 8,
          left: rect.right - 8,
        });
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    // Use MutationObserver to detect if element appears/disappears
    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      observer.disconnect();
    };
  }, [targetSelector]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-[9997] pointer-events-auto cursor-pointer"
      style={{ top: position.top, left: position.left }}
      onClick={onClick}
    >
      <div className="relative">
        {/* Pulsing ring */}
        <div className="absolute inset-0 w-6 h-6 rounded-full bg-[rgb(var(--accent)/0.4)] animate-ping"></div>
        
        {/* Solid badge */}
        <div className="relative w-6 h-6 rounded-full bg-[rgb(var(--accent))] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <AlertCircle size={14} className="text-white" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}