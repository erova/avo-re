export const easeOutQuint: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const easeInOutQuint: [number, number, number, number] = [0.83, 0, 0.17, 1];

export const motionTokens = {
  duration: {
    fast: 0.18,
    base: 0.35,
    slow: 0.6,
  },
  ease: {
    out: easeOutQuint,
    inOut: easeInOutQuint,
  },
} as const;

// Page transitions (subtle, premium)
export const page = {
  initial: { opacity: 0, y: 10, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: motionTokens.duration.slow, ease: motionTokens.ease.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(8px)",
    transition: { duration: motionTokens.duration.base, ease: motionTokens.ease.inOut },
  },
};

// Stagger for groups
export const stagger = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// Reusable “fade up” (your default entrance)
export const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: motionTokens.duration.slow, ease: motionTokens.ease.out },
  },
};

// Cards: calm by default, a little Cuberto on hover
export const cardIn = {
  hidden: { opacity: 0, y: 18, scale: 0.985, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: motionTokens.duration.slow, ease: motionTokens.ease.out },
  },
};

export const hoverLift = {
  hover: { y: -6, transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.out } },
  tap: { scale: 0.99 },
};

// Respect reduced motion (optional helper if you want to gate effects later)
export const prefersReducedMotion = {
  reduced: { transition: { duration: 0 } },
};