import { useState, useEffect } from 'react';

// Easing functions
export const EasingFunctions = {
  linear: (t: number): number => t,
  
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  
  easeInQuart: (t: number): number => t * t * t * t,
  easeOutQuart: (t: number): number => 1 - Math.pow(1 - t, 4),
  easeInOutQuart: (t: number): number =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  
  easeInExpo: (t: number): number => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
} as const;

export type EasingType = keyof typeof EasingFunctions;

interface UseAnimatedNumberOptions {
  target: number;
  duration?: number;
  easing?: EasingType;
  fps?: number;
}

/**
 * Custom hook for animating numbers with various easing functions
 * 
 * @param target - The target number to animate to
 * @param duration - Animation duration in milliseconds (default: 1500)
 * @param easing - Easing function to use (default: 'easeOutCubic')
 * @param fps - Frames per second (default: 60)
 * @returns The current animated value
 * 
 * @example
 * const animatedCount = useAnimatedNumber({ target: 1000, duration: 2000, easing: 'easeOutCubic' });
 */
export function useAnimatedNumber({
  target,
  duration = 1500,
  easing = 'easeOutCubic',
  fps = 60,
}: UseAnimatedNumberOptions): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const easingFn = EasingFunctions[easing];
    const totalFrames = (duration / 1000) * fps;
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      const progress = Math.min(currentFrame / totalFrames, 1);
      const easedProgress = easingFn(progress);
      const newValue = Math.floor(easedProgress * target);

      setValue(newValue);

      if (currentFrame >= totalFrames) {
        setValue(target); // Ensure we hit the exact target
        clearInterval(timer);
      }
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [target, duration, easing, fps]);

  return value;
}

/**
 * Hook for animating multiple numbers simultaneously with the same settings
 * 
 * @example
 * const [count1, count2, count3] = useAnimatedNumbers({
 *   targets: [100, 200, 300],
 *   duration: 2000,
 *   easing: 'easeOutCubic'
 * });
 */
export function useAnimatedNumbers({
  targets,
  duration = 1500,
  easing = 'easeOutCubic',
  fps = 60,
}: {
  targets: number[];
  duration?: number;
  easing?: EasingType;
  fps?: number;
}): number[] {
  const [values, setValues] = useState<number[]>(targets.map(() => 0));

  useEffect(() => {
    const easingFn = EasingFunctions[easing];
    const totalFrames = (duration / 1000) * fps;
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      const progress = Math.min(currentFrame / totalFrames, 1);
      const easedProgress = easingFn(progress);

      const newValues = targets.map((target) => Math.floor(easedProgress * target));
      setValues(newValues);

      if (currentFrame >= totalFrames) {
        setValues(targets); // Ensure we hit the exact targets
        clearInterval(timer);
      }
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [JSON.stringify(targets), duration, easing, fps]);

  return values;
}

