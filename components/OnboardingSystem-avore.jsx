'use client';
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

/**
 * Onboarding System - Customized for avo.re
 * 
 * Matches your site's:
 * - Dark theme (neutral-950 background)
 * - Pink accent (rgb(236 72 153))
 * - Geist font family
 * - Minimal, high-craft aesthetic
 */

export const OnboardingSystem = ({ 
  steps, 
  onComplete, 
  onSkip,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipStyle, setTooltipStyle] = useState({});

  const step = steps[currentStep];

  useEffect(() => {
    const updatePosition = () => {
      const target = document.querySelector(step.target);
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetRect(rect);
        calculateTooltipPosition(rect);
      }
    };

    updatePosition();
    const resizeObserver = new ResizeObserver(updatePosition);
    const target = document.querySelector(step.target);
    
    if (target) {
      resizeObserver.observe(target);
    }

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step]);

  const calculateTooltipPosition = (rect) => {
    const offset = 20;
    const position = step.position || 'bottom';
    let style = {};

    switch (position) {
      case 'top':
        style = { 
          left: rect.left + rect.width / 2, 
          top: rect.top - offset, 
          transform: 'translate(-50%, -100%)' 
        };
        break;
      case 'bottom':
        style = { 
          left: rect.left + rect.width / 2, 
          top: rect.bottom + offset, 
          transform: 'translateX(-50%)' 
        };
        break;
      case 'left':
        style = { 
          left: rect.left - offset, 
          top: rect.top + rect.height / 2, 
          transform: 'translate(-100%, -50%)' 
        };
        break;
      case 'right':
        style = { 
          left: rect.right + offset, 
          top: rect.top + rect.height / 2, 
          transform: 'translateY(-50%)' 
        };
        break;
      case 'bottom-left':
        style = { 
          left: rect.left, 
          top: rect.bottom + offset 
        };
        break;
      case 'bottom-right':
        style = { 
          left: rect.right, 
          top: rect.bottom + offset,
          transform: 'translateX(-100%)'
        };
        break;
      default:
        style = { 
          left: rect.left + rect.width / 2, 
          top: rect.bottom + offset, 
          transform: 'translateX(-50%)' 
        };
    }

    setTooltipStyle(style);
  };

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, steps[currentStep].id]));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  if (!step) return null;

  return (
    <>
      {/* Backdrop with spotlight effect */}
      <Backdrop targetRect={targetRect} />

      {/* Highlight ring around target */}
      {targetRect && step.highlight && (
        <HighlightRing targetRect={targetRect} />
      )}

      {/* Animated pointer */}
      {targetRect && step.pointer && (
        <Pointer 
          type={step.pointer} 
          targetRect={targetRect} 
          position={step.position || 'bottom'}
        />
      )}

      {/* Tooltip */}
      {targetRect && (
        <Tooltip
          step={step}
          currentStep={currentStep}
          totalSteps={steps.length}
          completedSteps={completedSteps}
          tooltipStyle={tooltipStyle}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      )}
    </>
  );
};

// Backdrop Component
const Backdrop = ({ targetRect }) => {
  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      <svg className="w-full h-full">
        <defs>
          <mask id="onboarding-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#onboarding-spotlight-mask)"
          className="transition-all duration-300"
        />
      </svg>
    </div>
  );
};

// Highlight Ring Component - Using your pink accent
const HighlightRing = ({ targetRect }) => {
  return (
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
  );
};

// Pointer Component - Using your pink accent
const Pointer = ({ type, targetRect, position }) => {
  const getPointerPosition = () => {
    const offset = 40;
    switch (position) {
      case 'right':
        return { left: targetRect.right + offset, top: targetRect.top + targetRect.height / 2 };
      case 'left':
        return { left: targetRect.left - offset, top: targetRect.top + targetRect.height / 2 };
      case 'top':
        return { left: targetRect.left + targetRect.width / 2, top: targetRect.top - offset };
      case 'bottom':
      default:
        return { left: targetRect.left + targetRect.width / 2, top: targetRect.bottom + offset };
    }
  };

  const pos = getPointerPosition();
  const rotation = 
    position === 'right' ? '0deg' : 
    position === 'left' ? '180deg' : 
    position === 'top' ? '90deg' : 
    '-90deg';

  const gradientId = `pointer-gradient-${type}`;

  return (
    <div
      className={`fixed z-[9999] pointer-events-none onboarding-pointer onboarding-pointer-${type}`}
      style={{
        left: pos.left,
        top: pos.top,
        transform: `translate(-50%, -50%) rotate(${rotation})`,
      }}
    >
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path
          d="M15 5L15 25M15 25L10 20M15 25L20 20"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id={gradientId} x1="15" y1="5" x2="15" y2="25">
            <stop offset="0%" stopColor="rgb(236, 72, 153)" />
            <stop offset="100%" stopColor="rgb(167, 139, 250)" />
          </linearGradient>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes onboarding-float {
          0%, 100% { transform: translate(-50%, -50%) rotate(${rotation}) translateY(0); }
          50% { transform: translate(-50%, -50%) rotate(${rotation}) translateY(-10px); }
        }

        @keyframes onboarding-pulse-scale {
          0%, 100% { transform: translate(-50%, -50%) rotate(${rotation}) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) rotate(${rotation}) scale(1.2); opacity: 0.8; }
        }

        @keyframes onboarding-bounce {
          0%, 100% { transform: translate(-50%, -50%) rotate(${rotation}) translateY(0); }
          50% { transform: translate(-50%, -50%) rotate(${rotation}) translateY(-15px); }
        }

        .onboarding-pointer-arrow {
          animation: onboarding-float 2s ease-in-out infinite;
        }

        .onboarding-pointer-pulse {
          animation: onboarding-pulse-scale 1.5s ease-in-out infinite;
        }

        .onboarding-pointer-bounce {
          animation: onboarding-bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Tooltip Component - Styled to match avo.re design
const Tooltip = ({ 
  step, 
  currentStep, 
  totalSteps, 
  completedSteps, 
  tooltipStyle, 
  onNext, 
  onSkip
}) => {
  return (
    <div
      className="fixed z-[10000] onboarding-tooltip-enter"
      style={{
        ...tooltipStyle,
        maxWidth: '380px',
      }}
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Decorative top bar - your pink accent */}
        <div className="h-1 bg-gradient-to-r from-[rgb(var(--accent))] via-purple-500 to-pink-400"></div>
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-medium tracking-tight text-neutral-100 pr-4">
              {step.title}
            </h3>
            <button
              onClick={onSkip}
              className="text-neutral-500 hover:text-neutral-100 transition-colors flex-shrink-0"
              aria-label="Skip onboarding"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="text-neutral-400 mb-5 leading-relaxed text-sm">
            {typeof step.content === 'string' ? (
              <p>{step.content}</p>
            ) : (
              step.content
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Progress indicators */}
            <div className="flex space-x-1.5">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all ${
                    idx === currentStep
                      ? 'w-8 bg-[rgb(var(--accent))]'
                      : completedSteps.has(idx)
                      ? 'w-1.5 bg-neutral-600'
                      : 'w-1.5 bg-neutral-700'
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
              {currentStep < totalSteps - 1 ? (
                <ArrowRight size={14} />
              ) : (
                <Check size={14} />
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes onboarding-tooltip-enter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .onboarding-tooltip-enter {
          animation: onboarding-tooltip-enter 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OnboardingSystem;