'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { OnboardingStep } from './onboarding-engine';

interface OnboardingTooltipProps {
  step: OnboardingStep;
  stepIndex: number;
  totalSteps: number;
  completedSteps: string[];
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingTooltip({
  step,
  stepIndex,
  totalSteps,
  completedSteps,
  onNext,
  onSkip
}: OnboardingTooltipProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const updatePosition = () => {
      const target = document.querySelector(step.target);
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetRect(rect);
        
        const position = step.position || 'bottom';
        let style: React.CSSProperties = {};
        const normalOffset = 20;

        switch (position) {
          case 'top':
            style = { 
              left: rect.left + rect.width / 2, 
              top: rect.top - normalOffset, 
              transform: 'translate(-50%, -100%)' 
            };
            break;
          case 'bottom':
            // Simple: directly below target
            style = { 
              left: rect.left + rect.width / 2, 
              top: rect.bottom + normalOffset, 
              transform: 'translateX(-50%)' 
            };
            break;
          case 'left':
            // Simple: directly to the left
            style = { 
              left: rect.left - normalOffset, 
              top: rect.top + rect.height / 2, 
              transform: 'translate(-100%, -50%)' 
            };
            break;
          case 'right':
            // Analytics GIF: position directly below the Dashboard nav link
            style = { 
              left: rect.left + rect.width / 2, 
              top: rect.bottom + 20, 
              transform: 'translateX(-50%)' 
            };
            break;
          case 'bottom-left':
            style = { 
              left: rect.left, 
              top: rect.bottom + normalOffset 
            };
            break;
          case 'bottom-right':
            style = { 
              left: rect.right, 
              top: rect.bottom + normalOffset, 
              transform: 'translateX(-100%)' 
            };
            break;
        }

        setTooltipStyle(style);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step]);

  if (!targetRect) return null;

  // Get CSS triangle arrow classes based on tooltip position
  const getArrowClasses = () => {
    const pos = step.position || 'bottom';
    
    switch (pos) {
      case 'top':
        return 'bottom-[-16px] left-1/2 -translate-x-1/2 border-t-[rgb(var(--accent))] border-x-transparent border-b-transparent';
      case 'bottom':
        // Arrow points UP
        return 'top-[-16px] left-1/2 -translate-x-1/2 border-b-[rgb(var(--accent))] border-x-transparent border-t-transparent';
      case 'left':
        // Arrow points RIGHT
        return 'right-[-16px] top-1/2 -translate-y-1/2 border-l-[rgb(var(--accent))] border-y-transparent border-r-transparent';
      case 'right':
        // For GIF: arrow points UP (tooltip is below Dashboard)
        return 'top-[-16px] left-1/2 -translate-x-1/2 border-b-[rgb(var(--accent))] border-x-transparent border-t-transparent';
      case 'bottom-left':
        return 'top-[-16px] left-8 border-b-[rgb(var(--accent))] border-x-transparent border-t-transparent';
      case 'bottom-right':
        return 'top-[-16px] right-8 border-b-[rgb(var(--accent))] border-x-transparent border-t-transparent';
      default:
        return 'top-[-16px] left-1/2 -translate-x-1/2 border-b-[rgb(var(--accent))] border-x-transparent border-t-transparent';
    }
  };

  return (
    <>
      {/* Backdrop with spotlight */}
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.75)" mask="url(#spotlight-mask)" />
        </svg>
      </div>

      {/* Highlight ring */}
      {step.highlight && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: targetRect.left - 8,
            top: targetRect.top - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        >
          <div className="absolute inset-0 rounded-xl border-2 border-[rgb(var(--accent))] shadow-lg shadow-[rgb(var(--accent)/0.4)] animate-pulse"></div>
        </div>
      )}

      {/* Pulsing dot indicator */}
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{
          left: targetRect.left + targetRect.width / 2,
          top: targetRect.top + targetRect.height / 2,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--accent)/0.3)] animate-ping"></div>
          <div className="relative w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--accent))] shadow-lg shadow-[rgb(var(--accent)/0.6)]"></div>
        </div>
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-[10000] animate-in fade-in slide-in-from-bottom-2 duration-300"
        style={{ ...tooltipStyle, maxWidth: step.gifUrl ? '420px' : '380px' }}
      >
        <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl backdrop-blur-sm">
          {/* CSS Triangle Arrow */}
          <div 
            className={`absolute w-0 h-0 border-8 ${getArrowClasses()}`}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
          />
          
          {/* Gradient bar */}
          <div className="overflow-hidden rounded-t-2xl">
            <div className="h-1 bg-gradient-to-r from-[rgb(var(--accent))] via-purple-500 to-pink-400"></div>
          </div>
          
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-medium tracking-tight text-neutral-100 pr-4">
                {step.title}
              </h3>
              <button onClick={onSkip} className="text-neutral-500 hover:text-neutral-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* GIF Preview */}
            {step.gifUrl && (
              <div className="mb-4 rounded-lg overflow-hidden border border-neutral-700">
                <img 
                  src={step.gifUrl} 
                  alt={step.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Content */}
            <p className="text-neutral-400 mb-5 leading-relaxed text-sm">
              {step.content}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Progress indicators */}
              <div className="flex space-x-1.5">
                {Array.from({ length: totalSteps }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all ${
                      idx === stepIndex ? 'w-8 bg-[rgb(var(--accent))]' :
                      idx < stepIndex ? 'w-1.5 bg-neutral-600' :
                      'w-1.5 bg-neutral-700'
                    }`}
                  />
                ))}
              </div>

              {/* Action button */}
              <button
                onClick={onNext}
                className="bg-[rgb(var(--accent)/0.18)] text-[rgb(var(--accent))] border border-[rgb(var(--accent)/0.35)] px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all flex items-center space-x-2"
              >
                <span>{step.action || 'Next'}</span>
                {stepIndex < totalSteps - 1 ? <ArrowRight size={14} /> : <Check size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}