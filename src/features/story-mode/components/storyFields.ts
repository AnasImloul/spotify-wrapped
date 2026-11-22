export type StoryField = 'green' | 'blue' | 'yellow' | 'orange' | 'white' | 'black';

export const STORY_FIELDS: Record<
  StoryField,
  { bg: string; ink: string; muted: string; rule: string; segment: string; segmentDim: string }
> = {
  green: {
    bg: 'bg-code-green',
    ink: 'text-[#121212]',
    muted: 'text-[#121212]/70',
    rule: 'border-[#121212]',
    segment: 'bg-[#121212]',
    segmentDim: 'bg-[#121212]/25',
  },
  blue: {
    bg: 'bg-code-blue',
    ink: 'text-[#121212]',
    muted: 'text-[#121212]/70',
    rule: 'border-[#121212]',
    segment: 'bg-[#121212]',
    segmentDim: 'bg-[#121212]/25',
  },
  yellow: {
    bg: 'bg-code-yellow',
    ink: 'text-[#121212]',
    muted: 'text-[#121212]/70',
    rule: 'border-[#121212]',
    segment: 'bg-[#121212]',
    segmentDim: 'bg-[#121212]/25',
  },
  orange: {
    bg: 'bg-code-orange',
    ink: 'text-[#121212]',
    muted: 'text-[#121212]/75',
    rule: 'border-[#121212]',
    segment: 'bg-[#121212]',
    segmentDim: 'bg-[#121212]/25',
  },
  white: {
    bg: 'bg-white',
    ink: 'text-[#121212]',
    muted: 'text-[#121212]/65',
    rule: 'border-[#121212]',
    segment: 'bg-[#121212]',
    segmentDim: 'bg-[#121212]/20',
  },
  black: {
    bg: 'bg-background',
    ink: 'text-foreground',
    muted: 'text-muted-foreground',
    rule: 'border-foreground',
    segment: 'bg-foreground',
    segmentDim: 'bg-foreground/25',
  },
};

export const STRIP = [
  ['green', 'bg-code-green'],
  ['blue', 'bg-code-blue'],
  ['yellow', 'bg-code-yellow'],
  ['orange', 'bg-code-orange'],
] as const;

export function fitHeadline(text: string) {
  const longest = Math.max(...text.split(/\s+/).map((word) => word.length), 1);
  let cqw =
    longest <= 4
      ? 34
      : longest <= 6
        ? 28
        : longest <= 8
          ? 22
          : longest <= 10
            ? 18
            : longest <= 14
              ? 13
              : 10;
  if (text.length > 30) cqw = Math.min(cqw, 10);
  else if (text.length > 18) cqw = Math.min(cqw, 16);
  return { fontSize: `${cqw}cqw` };
}
