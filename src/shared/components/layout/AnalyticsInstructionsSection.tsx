/**
 * Analytics Instructions Section
 * Instructions for getting Spotify data
 */

export function AnalyticsInstructionsSection() {
  return (
    <div className="mt-16">
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-8">
        <h3 className="text-2xl font-bold text-white mb-4">
          How to Get Your Spotify Data
        </h3>
        <ol className="space-y-3 text-white/80">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
              1
            </span>
            <span>
              Go to your{' '}
              <a
                href="https://www.spotify.com/account/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 underline"
              >
                Spotify Privacy Settings
              </a>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
              2
            </span>
            <span>
              Request "Extended streaming history" (recommended) or "Account data" (standard)
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
              3
            </span>
            <span>
              Wait for Spotify's email (5-30 days for extended, 1-5 days for standard)
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
              4
            </span>
            <span>
              Download and extract the files: <code className="font-mono text-xs bg-white/10 px-1 py-0.5 rounded">StreamingHistory_music_*.json</code> (standard) or <code className="font-mono text-xs bg-white/10 px-1 py-0.5 rounded">Streaming_History_Audio_*.json</code> (extended)
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
              5
            </span>
            <span>
              Upload the streaming history files to analyze your data
            </span>
          </li>
        </ol>
        <p className="mt-6 text-sm text-white/60 italic">
          Your data remains on your device—all processing happens locally
        </p>
      </div>
    </div>
  );
}


