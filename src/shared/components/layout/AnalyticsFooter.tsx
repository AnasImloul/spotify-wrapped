/**
 * Analytics Footer Component
 * Footer with attribution
 */

export function AnalyticsFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white/60 text-sm">
          <p>
            Built for music enthusiasts |{' '}
            <span className="text-white/40">Independent project not affiliated with Spotify</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
