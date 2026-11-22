/**
 * Analytics Footer Component
 * Footer with attribution
 */

export function AnalyticsFooter() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
        <p className="text-foreground">Built for music enthusiasts</p>
        <p className="text-muted-foreground">Independent project not affiliated with Spotify</p>
      </div>
    </footer>
  );
}
