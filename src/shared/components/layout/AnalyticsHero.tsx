/**
 * Analytics Hero Component
 * Hero section with title and description
 */

const proofs = [
  {
    label: 'Stays on your device',
    text: 'Files are read in your browser. Nothing is uploaded to a server.',
  },
  {
    label: 'Your whole history',
    text: 'Months or years of listening, filtered to any range you pick.',
  },
  {
    label: 'Story and share',
    text: 'Swipe through a story of your year, or send a read-only link.',
  },
];

export function AnalyticsHero() {
  return (
    <div className="space-y-4">
      <h2 className="text-4xl sm:text-5xl xl:text-6xl font-semibold leading-[1.02] tracking-[-0.02em] text-balance">
        Discover your musical story
      </h2>
      <p className="text-lg text-foreground/90 max-w-xl leading-relaxed">
        Upload your Spotify data export to dive deep into your listening history, uncover patterns,
        and visualize your complete musical journey.
      </p>
      <p className="text-sm text-muted-foreground max-w-xl">
        Perfect for your annual music review: discover insights from months or years of listening
        data.
      </p>
    </div>
  );
}

export function AnalyticsProofs() {
  return (
    <dl className="border-t border-border">
      {proofs.map((proof) => (
        <div
          key={proof.label}
          className="grid sm:grid-cols-[11rem_1fr] gap-1 sm:gap-4 py-3 border-b border-border"
        >
          <dt className="label-caps pt-0.5">{proof.label}</dt>
          <dd className="text-sm text-foreground/90">{proof.text}</dd>
        </div>
      ))}
    </dl>
  );
}
