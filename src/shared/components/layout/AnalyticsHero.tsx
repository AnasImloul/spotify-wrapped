/**
 * Analytics Hero Component
 * Hero section with title and description
 */

export function AnalyticsHero() {
  return (
    <div className="text-center space-y-4 mb-12">
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
        Discover Your <span className="animated-gradient">Musical Story</span>
      </h2>
      <p className="text-lg text-white/70 max-w-2xl mx-auto">
        Upload your Spotify data export to dive deep into your listening history, uncover patterns,
        and visualize your complete musical journey.
      </p>
      <p className="text-sm text-white/50 max-w-xl mx-auto">
        Perfect for your annual music review - discover insights from months or years of listening
        data
      </p>
    </div>
  );
}
