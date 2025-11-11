import jsPDF from 'jspdf';
import { ProcessedStats } from '@/shared/types';
import { formatNumber, msToMinutes } from '@/lib/utils';

/**
 * Generate an industry-standard, beautifully designed PDF report
 */
export async function generatePDFReport(
  stats: ProcessedStats,
  dateRange: { start: string; end: string }
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Design system colors
  const colors = {
    background: { r: 10, g: 10, b: 15 },
    cardDark: { r: 18, g: 18, b: 25 },
    cardLight: { r: 25, g: 25, b: 35 },
    spotifyGreen: { r: 29, g: 185, b: 84 },
    accentBlue: { r: 88, g: 166, b: 255 },
    accentPurple: { r: 168, g: 85, b: 247 },
    accentPink: { r: 255, g: 77, b: 148 },
    accentOrange: { r: 255, g: 159, b: 64 },
    textPrimary: { r: 255, g: 255, b: 255 },
    textSecondary: { r: 156, g: 163, b: 175 },
    textTertiary: { r: 107, g: 114, b: 128 },
  };

  // ============ PAGE 1: HERO COVER ============
  // Background
  pdf.setFillColor(colors.background.r, colors.background.g, colors.background.b);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Radial gradient effect with circles
  const centerX = pageWidth / 2;
  const centerY = 70;
  for (let i = 20; i > 0; i--) {
    const alpha = i * 0.015;
    pdf.setFillColor(colors.spotifyGreen.r, colors.spotifyGreen.g, colors.spotifyGreen.b);
    pdf.setGState(pdf.GState({ opacity: alpha }));
    pdf.circle(centerX, centerY, i * 3, 'F');
  }
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // Spotify logo-inspired circle
  pdf.setFillColor(colors.spotifyGreen.r, colors.spotifyGreen.g, colors.spotifyGreen.b);
  pdf.circle(centerX, centerY, 18, 'F');

  // Add waves inside circle - properly centered and stacked
  pdf.setFillColor(colors.background.r, colors.background.g, colors.background.b);
  // Left dot (smaller)
  pdf.circle(centerX - 6, centerY, 2.5, 'F');
  // Middle dot (larger)
  pdf.circle(centerX, centerY, 3.5, 'F');
  // Right dot (smaller)
  pdf.circle(centerX + 6, centerY, 2.5, 'F');

  // Title - split style
  pdf.setTextColor(colors.textPrimary.r, colors.textPrimary.g, colors.textPrimary.b);
  pdf.setFontSize(44);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Musical', centerX, 110, { align: 'center' });

  pdf.setFontSize(56);
  const wrappedWidth = pdf.getTextWidth('WRAPPED');
  pdf.setFillColor(colors.spotifyGreen.r, colors.spotifyGreen.g, colors.spotifyGreen.b);
  pdf.rect(centerX - wrappedWidth / 2 - 5, 117, wrappedWidth + 10, 18, 'F');
  pdf.setTextColor(colors.background.r, colors.background.g, colors.background.b);
  pdf.text('WRAPPED', centerX, 130, { align: 'center' });

  // Date range in pill
  pdf.setFillColor(colors.cardDark.r, colors.cardDark.g, colors.cardDark.b);
  const dateText = `${dateRange.start} — ${dateRange.end}`;
  const dateWidth = pdf.getTextWidth(dateText) + 12;
  pdf.roundedRect(centerX - dateWidth / 2, 145, dateWidth, 10, 5, 5, 'F');
  pdf.setTextColor(colors.spotifyGreen.r, colors.spotifyGreen.g, colors.spotifyGreen.b);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(dateText, centerX, 152, { align: 'center' });

  // Stats Grid - 2x2 with better design
  const cardW = 85;
  const cardH = 38;
  const gapX = 8;
  const gapY = 8;
  const gridStartX = (pageWidth - (cardW * 2 + gapX)) / 2;
  let gridY = 170;

  // Helper to draw enhanced stat card
  const drawStatCard = (
    x: number,
    y: number,
    value: string,
    label: string,
    subtitle: string,
    color: { r: number; g: number; b: number }
  ) => {
    // Card shadow
    pdf.setFillColor(0, 0, 0);
    pdf.setGState(pdf.GState({ opacity: 0.3 }));
    pdf.roundedRect(x + 1, y + 1, cardW, cardH, 4, 4, 'F');
    pdf.setGState(pdf.GState({ opacity: 1 }));

    // Card background with gradient simulation
    pdf.setFillColor(colors.cardDark.r, colors.cardDark.g, colors.cardDark.b);
    pdf.roundedRect(x, y, cardW, cardH, 4, 4, 'F');

    // Top accent stripe
    pdf.setFillColor(color.r, color.g, color.b);
    pdf.setGState(pdf.GState({ opacity: 0.8 }));
    pdf.rect(x, y, cardW, 3, 'F');
    pdf.setGState(pdf.GState({ opacity: 1 }));

    // Decorative circle (empty, just for visual interest)
    pdf.setFillColor(color.r, color.g, color.b);
    pdf.setGState(pdf.GState({ opacity: 0.15 }));
    pdf.circle(x + 12, y + 14, 8, 'F');
    pdf.setGState(pdf.GState({ opacity: 1 }));

    // Value
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(colors.textPrimary.r, colors.textPrimary.g, colors.textPrimary.b);
    pdf.text(value, x + cardW / 2, y + 20, { align: 'center' });

    // Label
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(colors.textSecondary.r, colors.textSecondary.g, colors.textSecondary.b);
    pdf.text(label.toUpperCase(), x + cardW / 2, y + 28, { align: 'center' });

    // Subtitle
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(colors.textTertiary.r, colors.textTertiary.g, colors.textTertiary.b);
    pdf.text(subtitle, x + cardW / 2, y + 34, { align: 'center' });
  };

  // Calculate additional stats
  const hours = Math.round(stats.totalListeningTime);
  const days = Math.round(hours / 24);

  // Draw stat cards - clean design with empty decorative circles
  drawStatCard(
    gridStartX,
    gridY,
    formatNumber(hours),
    'Total Hours',
    `≈ ${days} days of music`,
    colors.spotifyGreen
  );

  drawStatCard(
    gridStartX + cardW + gapX,
    gridY,
    formatNumber(stats.totalTracks),
    'Songs Played',
    `${formatNumber(stats.totalArtists)} unique artists`,
    colors.accentBlue
  );

  gridY += cardH + gapY;

  drawStatCard(
    gridStartX,
    gridY,
    formatNumber(Math.round(stats.averageListeningPerDay)),
    'Avg Minutes/Day',
    'Your daily soundtrack',
    colors.accentPurple
  );

  drawStatCard(
    gridStartX + cardW + gapX,
    gridY,
    formatNumber(stats.topArtists[0]?.playCount || 0),
    'Top Artist Plays',
    stats.topArtists[0]?.name.substring(0, 20) || 'N/A',
    colors.accentPink
  );

  // ============ PAGE 2: TOP ARTISTS PODIUM ============
  pdf.addPage();
  pdf.setFillColor(colors.background.r, colors.background.g, colors.background.b);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Page title with underline
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(colors.spotifyGreen.r, colors.spotifyGreen.g, colors.spotifyGreen.b);
  pdf.text('Your Top Artists', pageWidth / 2, 20, { align: 'center' });

  // Gradient underline
  const underlineY = 23;
  for (let i = 0; i < 80; i++) {
    const opacity = 0.6 - (i / 80) * 0.6;
    pdf.setDrawColor(colors.spotifyGreen.r, colors.spotifyGreen.g, colors.spotifyGreen.b);
    pdf.setGState(pdf.GState({ opacity }));
    pdf.line(pageWidth / 2 - 40 + i, underlineY, pageWidth / 2 - 40 + i + 1, underlineY);
  }
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // Top 3 Podium Style
  const topArtists = stats.topArtists.slice(0, 10);
  const podiumY = 35;

  // Helper for podium cards
  const drawPodiumCard = (
    x: number,
    y: number,
    width: number,
    artist: (typeof topArtists)[0],
    rank: number,
    color: { r: number; g: number; b: number }
  ) => {
    const cardHeight = 55;

    // Card shadow
    pdf.setFillColor(0, 0, 0);
    pdf.setGState(pdf.GState({ opacity: 0.4 }));
    pdf.roundedRect(x + 1, y + 1, width, cardHeight, 5, 5, 'F');
    pdf.setGState(pdf.GState({ opacity: 1 }));

    // Card background
    pdf.setFillColor(colors.cardLight.r, colors.cardLight.g, colors.cardLight.b);
    pdf.roundedRect(x, y, width, cardHeight, 5, 5, 'F');

    // Colored top border
    pdf.setFillColor(color.r, color.g, color.b);
    pdf.roundedRect(x, y, width, 5, 5, 5, 'F');

    // Rank badge - larger for #1
    const badgeSize = rank === 1 ? 16 : 14;
    const badgeY = y + 12;

    // Badge glow
    pdf.setFillColor(color.r, color.g, color.b);
    pdf.setGState(pdf.GState({ opacity: 0.3 }));
    pdf.circle(x + width / 2, badgeY, badgeSize + 2, 'F');
    pdf.setGState(pdf.GState({ opacity: 1 }));

    // Badge
    pdf.setFillColor(color.r, color.g, color.b);
    pdf.circle(x + width / 2, badgeY, badgeSize, 'F');

    // Rank number - properly centered vertically
    pdf.setFontSize(rank === 1 ? 18 : 16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    // For baseline: 'middle', the y coordinate is the vertical center
    pdf.text(`${rank}`, x + width / 2, badgeY, { align: 'center', baseline: 'middle' });

    // Artist name
    pdf.setFontSize(rank === 1 ? 12 : 10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(colors.textPrimary.r, colors.textPrimary.g, colors.textPrimary.b);
    const nameY = y + 32;
    const maxWidth = width - 8;
    const artistName = pdf.splitTextToSize(artist.name, maxWidth)[0] || artist.name;
    pdf.text(artistName, x + width / 2, nameY, { align: 'center' });

    // Stats
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(colors.textSecondary.r, colors.textSecondary.g, colors.textSecondary.b);
    pdf.text(`${formatNumber(msToMinutes(artist.totalMs))} min`, x + width / 2, y + 42, {
      align: 'center',
    });
    pdf.text(`${formatNumber(artist.playCount)} plays`, x + width / 2, y + 48, { align: 'center' });
  };

  // Draw top 3 podium
  if (topArtists.length >= 1) {
    drawPodiumCard(pageWidth / 2 - 30, podiumY, 60, topArtists[0], 1, colors.spotifyGreen);
  }
  if (topArtists.length >= 2) {
    drawPodiumCard(20, podiumY + 10, 50, topArtists[1], 2, colors.accentBlue);
  }
  if (topArtists.length >= 3) {
    drawPodiumCard(pageWidth - 70, podiumY + 10, 50, topArtists[2], 3, colors.accentPurple);
  }

  // Remaining artists (4-10) in compact list
  let listY = podiumY + 75;

  for (let i = 3; i < Math.min(10, topArtists.length); i++) {
    const artist = topArtists[i];
    const cardX = 20;
    const cardW = pageWidth - 40;
    const cardH = 18;

    // Card background
    pdf.setFillColor(colors.cardDark.r, colors.cardDark.g, colors.cardDark.b);
    pdf.roundedRect(cardX, listY, cardW, cardH, 3, 3, 'F');

    // Rank circle - smaller
    const rankSize = 8;
    pdf.setFillColor(colors.textTertiary.r, colors.textTertiary.g, colors.textTertiary.b);
    pdf.circle(cardX + 8, listY + cardH / 2, rankSize / 2, 'F');

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(colors.background.r, colors.background.g, colors.background.b);
    // Center both horizontally and vertically
    pdf.text(`${i + 1}`, cardX + 8, listY + cardH / 2, { align: 'center', baseline: 'middle' });

    // Artist name
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(colors.textPrimary.r, colors.textPrimary.g, colors.textPrimary.b);
    const nameMaxWidth = cardW - 80;
    const artistName = pdf.splitTextToSize(artist.name, nameMaxWidth)[0] || artist.name;
    pdf.text(artistName, cardX + 16, listY + 8);

    // Stats on the right
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(colors.textSecondary.r, colors.textSecondary.g, colors.textSecondary.b);
    pdf.text(`${formatNumber(msToMinutes(artist.totalMs))} min`, cardX + cardW - 40, listY + 7, {
      align: 'left',
    });
    pdf.text(`${formatNumber(artist.playCount)} plays`, cardX + cardW - 40, listY + 13, {
      align: 'left',
    });

    listY += cardH + 3;
  }

  // ============ PAGE 3: TOP TRACKS ============
  pdf.addPage();
  pdf.setFillColor(colors.background.r, colors.background.g, colors.background.b);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Page title
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(colors.accentBlue.r, colors.accentBlue.g, colors.accentBlue.b);
  pdf.text('Your Top Tracks', pageWidth / 2, 20, { align: 'center' });

  // Gradient underline
  const trackUnderlineY = 23;
  for (let i = 0; i < 80; i++) {
    const opacity = 0.6 - (i / 80) * 0.6;
    pdf.setDrawColor(colors.accentBlue.r, colors.accentBlue.g, colors.accentBlue.b);
    pdf.setGState(pdf.GState({ opacity }));
    pdf.line(pageWidth / 2 - 40 + i, trackUnderlineY, pageWidth / 2 - 40 + i + 1, trackUnderlineY);
  }
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // Top tracks list with visual hierarchy
  let trackY = 32;
  const topTracks = stats.topTracks.slice(0, 10);

  topTracks.forEach((track, index) => {
    const cardX = 20;
    const cardW = pageWidth - 40;
    const cardH = index < 3 ? 25 : 20; // Reduced heights: top 3 from 28 to 25, others from 22 to 20

    // Card shadow
    if (index < 3) {
      pdf.setFillColor(0, 0, 0);
      pdf.setGState(pdf.GState({ opacity: 0.3 }));
      pdf.roundedRect(cardX + 1, trackY + 1, cardW, cardH, 4, 4, 'F');
      pdf.setGState(pdf.GState({ opacity: 1 }));
    }

    // Card background - featured vs regular
    if (index < 3) {
      pdf.setFillColor(colors.cardLight.r, colors.cardLight.g, colors.cardLight.b);
    } else {
      pdf.setFillColor(colors.cardDark.r, colors.cardDark.g, colors.cardDark.b);
    }
    pdf.roundedRect(cardX, trackY, cardW, cardH, 4, 4, 'F');

    // Left accent bar for top 3
    if (index < 3) {
      const barColors = [colors.accentBlue, colors.accentPurple, colors.accentPink];
      const barColor = barColors[index];
      pdf.setFillColor(barColor.r, barColor.g, barColor.b);
      pdf.rect(cardX, trackY, 3, cardH, 'F');
    }

    // Rank badge
    const badgeSize = index < 3 ? 12 : 9;
    const badgeX = cardX + (index < 3 ? 14 : 10);
    const badgeY = trackY + cardH / 2;

    // Badge color based on rank
    const badgeColors = [
      colors.accentBlue,
      colors.accentPurple,
      colors.accentPink,
      colors.textTertiary,
    ];
    const badgeColor = badgeColors[Math.min(index, 3)];

    pdf.setFillColor(badgeColor.r, badgeColor.g, badgeColor.b);
    pdf.circle(badgeX, badgeY, badgeSize / 2, 'F');

    const badgeFontSize = index < 3 ? 11 : 8;
    pdf.setFontSize(badgeFontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(
      index < 3 ? 255 : colors.background.r,
      index < 3 ? 255 : colors.background.g,
      index < 3 ? 255 : colors.background.b
    );
    // Center the text at the badge Y position (circle center)
    pdf.text(`${index + 1}`, badgeX, badgeY, { align: 'center', baseline: 'middle' });

    // Content area
    const contentX = cardX + (index < 3 ? 26 : 20);
    const contentMaxWidth = cardW - (index < 3 ? 90 : 80);

    // Track name
    pdf.setFontSize(index < 3 ? 11 : 9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(colors.textPrimary.r, colors.textPrimary.g, colors.textPrimary.b);
    const trackName = pdf.splitTextToSize(track.name, contentMaxWidth)[0] || track.name;
    pdf.text(trackName, contentX, trackY + (index < 3 ? 11 : 9));

    // Artist
    pdf.setFontSize(index < 3 ? 9 : 8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(colors.textSecondary.r, colors.textSecondary.g, colors.textSecondary.b);
    const trackArtist = pdf.splitTextToSize(track.artist, contentMaxWidth)[0] || track.artist;
    pdf.text(trackArtist, contentX, trackY + (index < 3 ? 18 : 15));

    // Stats on the right
    const statsX = cardX + cardW - 45;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(colors.textSecondary.r, colors.textSecondary.g, colors.textSecondary.b);
    pdf.text(
      `${formatNumber(msToMinutes(track.totalMs))} min`,
      statsX,
      trackY + (index < 3 ? 12 : 10),
      { align: 'left' }
    );
    pdf.text(`${formatNumber(track.playCount)} plays`, statsX, trackY + (index < 3 ? 19 : 16), {
      align: 'left',
    });

    trackY += cardH + (index < 3 ? 3 : 2.5); // Reduced spacing
  });

  // Download
  pdf.save(`spotify-wrapped-${dateRange.start}-${dateRange.end}.pdf`);
}

/**
 * Export stats as formatted text
 */
export function exportStatsAsText(
  stats: ProcessedStats,
  dateRange: { start: string; end: string }
): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════');
  lines.push('       YOUR SPOTIFY WRAPPED');
  lines.push(`       ${dateRange.start} - ${dateRange.end}`);
  lines.push('═══════════════════════════════════════');
  lines.push('');

  lines.push('SUMMARY');
  lines.push('───────────────────────────────────────');
  lines.push(`Total Listening Time: ${formatNumber(Math.round(stats.totalListeningTime))} hours`);
  lines.push(`Total Songs Played: ${formatNumber(stats.totalTracks)}`);
  lines.push(`Unique Artists: ${formatNumber(stats.totalArtists)}`);
  lines.push(
    `Average Daily Listening: ${formatNumber(Math.round(stats.averageListeningPerDay))} minutes`
  );
  lines.push('');

  lines.push('TOP 10 ARTISTS');
  lines.push('───────────────────────────────────────');
  stats.topArtists.slice(0, 10).forEach((artist, index) => {
    lines.push(`${index + 1}. ${artist.name}`);
    lines.push(
      `   ${formatNumber(msToMinutes(artist.totalMs))} min • ${formatNumber(artist.playCount)} plays`
    );
  });
  lines.push('');

  lines.push('TOP 10 TRACKS');
  lines.push('───────────────────────────────────────');
  stats.topTracks.slice(0, 10).forEach((track, index) => {
    lines.push(`${index + 1}. ${track.name}`);
    lines.push(`   by ${track.artist}`);
    lines.push(
      `   ${formatNumber(msToMinutes(track.totalMs))} min • ${formatNumber(track.playCount)} plays`
    );
  });
  lines.push('');

  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
