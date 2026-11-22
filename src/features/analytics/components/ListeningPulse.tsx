import { useEffect, useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { useSpotifyDataContext } from '@/shared/contexts/SpotifyDataContext';
import { useDateRange } from '@/shared/hooks';
import { formatNumber } from '@/shared/utils';

const WIDE = 800;
const NARROW = 400;
const NARROW_QUERY = '(max-width: 639px)';
const HOURS = 24;
const SAMPLES = 96;

interface MonthRow {
  key: string;
  label: string;
  shortLabel: string;
  hours: number[];
  total: number;
  peakHour: number;
}

function monthLabel(key: string, style: 'long' | 'short') {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  });
}

function sampleCurve(hours: number[], t: number) {
  const x = t * HOURS - 0.5;
  const i = Math.floor(x);
  const f = x - i;
  const at = (k: number) => hours[Math.min(HOURS - 1, Math.max(0, k))];
  const p0 = at(i - 1);
  const p1 = at(i);
  const p2 = at(i + 1);
  const p3 = at(i + 2);
  const v =
    0.5 *
    (2 * p1 +
      (-p0 + p2) * f +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f +
      (-p0 + 3 * p1 - 3 * p2 + p3) * f * f * f);
  return Math.max(0, v);
}

const formatHour = (h: number) => `${String(h).padStart(2, '0')}:00`;

export function ListeningPulse() {
  const { streamingHistory } = useSpotifyDataContext();
  const { startDate, endDate } = useDateRange();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [narrow, setNarrow] = useState(() => window.matchMedia(NARROW_QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(NARROW_QUERY);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const WIDTH = narrow ? NARROW : WIDE;

  const rows = useMemo<MonthRow[]>(() => {
    const byMonth = new Map<string, number[]>();
    for (const entry of streamingHistory) {
      const d = new Date(entry.endTime);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (startDate && endDate && (key < startDate || key > endDate)) continue;
      let hours = byMonth.get(key);
      if (!hours) {
        hours = new Array(HOURS).fill(0);
        byMonth.set(key, hours);
      }
      hours[d.getHours()] += entry.msPlayed / 60000;
    }
    return [...byMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, hours]) => {
        const total = hours.reduce((a, b) => a + b, 0);
        const peakHour = hours.indexOf(Math.max(...hours));
        return {
          key,
          label: monthLabel(key, 'long'),
          shortLabel: monthLabel(key, 'short'),
          hours,
          total,
          peakHour,
        };
      });
  }, [streamingHistory, startDate, endDate]);

  const busiestIndex = useMemo(
    () => rows.reduce((best, r, i) => (r.total > rows[best].total ? i : best), 0),
    [rows]
  );

  const geometry = useMemo(() => {
    const n = rows.length;
    const gap = Math.min(40, Math.max(8, 320 / Math.max(n, 1)));
    const amplitude = Math.min(gap * 6, 130);
    const top = amplitude + 8;
    const height = top + gap * Math.max(n - 1, 0) + 12;
    const allHours = rows.flatMap((r) => r.hours);
    const floor = Math.min(...allHours) * 0.8;
    const span = Math.max(1, Math.max(...allHours) - floor);
    const paths = rows.map((row, i) => {
      const base = top + i * gap;
      let line = '';
      for (let s = 0; s <= SAMPLES; s++) {
        const t = s / SAMPLES;
        const v = Math.max(0, sampleCurve(row.hours, t) - floor) / span;
        const x = (t * WIDTH).toFixed(1);
        const y = (base - v * amplitude).toFixed(1);
        line += `${s === 0 ? 'M' : 'L'}${x} ${y} `;
      }
      return { line, fill: `${line}L${WIDTH} ${base} L0 ${base} Z`, base };
    });
    return { gap, height, paths };
  }, [rows, WIDTH]);

  if (rows.length === 0) {
    return (
      <div className="border border-dashed border-input px-6 py-16 text-center">
        <p className="font-medium">No listening in this range</p>
        <p className="text-sm text-muted-foreground mt-1">
          Pick a wider range above to draw your pulse.
        </p>
      </div>
    );
  }

  const shown = activeIndex ?? busiestIndex;
  const shownRow = rows[shown];
  const labelEvery = narrow ? 12 : rows.length > 18 ? 6 : rows.length > 8 ? 3 : 1;

  const handlePointer = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = geometry.height / rect.height;
    const y = (e.clientY - rect.top) * scale;
    let nearest = 0;
    let best = Infinity;
    geometry.paths.forEach((p, i) => {
      const d = Math.abs(p.base - geometry.gap * 0.6 - y);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setActiveIndex(nearest);
  };

  const handleKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIndex(Math.min(rows.length - 1, shown + 1));
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIndex(Math.max(0, shown - 1));
    } else if (e.key === 'Escape') {
      setActiveIndex(null);
    }
  };

  return (
    <figure className="m-0">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-4">
        <span className="label-caps">Listening by hour of day, one line per month</span>
        <span className="text-sm tabular-nums" aria-live="polite">
          <span className={shown === busiestIndex ? 'text-primary font-semibold' : 'font-semibold'}>
            {shownRow.label}
          </span>
          <span className="text-muted-foreground">
            {' · '}
            {formatNumber(Math.round(shownRow.total))} min · peak {formatHour(shownRow.peakHour)}
            {shown === busiestIndex && ' · busiest month'}
          </span>
        </span>
      </figcaption>

      <div className="flex gap-3">
        <div className="relative w-14 sm:w-16 shrink-0" aria-hidden>
          {rows.map((row, i) =>
            (i % labelEvery === 0 && Math.abs(i - busiestIndex) > 1) || i === busiestIndex ? (
              <span
                key={row.key}
                className={`absolute right-0 -translate-y-full text-[11px] tabular-nums whitespace-nowrap ${
                  i === busiestIndex ? 'text-primary' : 'text-muted-foreground'
                }`}
                style={{ top: `${(geometry.paths[i].base / geometry.height) * 100}%` }}
              >
                {row.shortLabel}
              </span>
            ) : null
          )}
        </div>

        <div className="flex-1 min-w-0">
          <svg
            viewBox={`0 0 ${WIDTH} ${geometry.height}`}
            className="block w-full h-auto touch-none outline-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
            role="img"
            aria-label={`Listening by hour for ${rows.length} months. Busiest: ${rows[busiestIndex].label}, ${formatNumber(Math.round(rows[busiestIndex].total))} minutes. Use arrow keys to step through months.`}
            tabIndex={0}
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onPointerLeave={() => setActiveIndex(null)}
            onKeyDown={handleKey}
            onBlur={() => setActiveIndex(null)}
          >
            {geometry.paths.map((p, i) => {
              const isShown = i === shown;
              const isBusiest = i === busiestIndex;
              const dimmed = activeIndex !== null && !isShown;
              return (
                <g key={rows[i].key}>
                  <path d={p.fill} style={{ fill: 'hsl(var(--background))' }} />
                  <path
                    d={p.line}
                    fill="none"
                    strokeOpacity={dimmed ? 0.35 : 1}
                    strokeWidth={isShown || isBusiest ? 2.25 : 1}
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                    style={{
                      stroke: isBusiest ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                      transition: 'stroke-opacity 160ms ease-out',
                    }}
                  />
                </g>
              );
            })}
            {[...new Set([busiestIndex, shown])].map((i) => (
              <path
                key={`top-${rows[i].key}`}
                d={geometry.paths[i].line}
                fill="none"
                style={{
                  stroke: i === busiestIndex ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                }}
                strokeOpacity={activeIndex !== null && i !== shown ? 0.35 : 1}
                strokeWidth={2.25}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                pointerEvents="none"
              />
            ))}
          </svg>
          <div
            className="flex justify-between mt-2 text-[11px] tabular-nums text-muted-foreground"
            aria-hidden
          >
            {[0, 6, 12, 18, 24].map((h) => (
              <span key={h}>{String(h).padStart(2, '0')}h</span>
            ))}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>Minutes listened per month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Minutes</th>
            <th scope="col">Peak hour</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>{row.label}</td>
              <td>{Math.round(row.total)}</td>
              <td>{formatHour(row.peakHour)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
