/**
 * Sample Spotify data for demo purposes
 * Allows users to explore the app without uploading their own data
 */

import { StreamingHistoryEntry } from '@/types/spotify';

// Diverse artists across multiple genres for realistic sample data
const sampleArtists = [
  // Indie/Alternative
  'Tame Impala', 'Arctic Monkeys', 'The Strokes', 'Radiohead', 'Mac DeMarco',
  // Electronic/Dance
  'Daft Punk', 'Flume', 'ODESZA', 'Disclosure', 'Bonobo',
  // Hip-Hop/R&B
  'Kendrick Lamar', 'Frank Ocean', 'Tyler, The Creator', 'SZA', 'Anderson .Paak',
  // Rock/Classic
  'Pink Floyd', 'Led Zeppelin', 'The Beatles', 'David Bowie', 'Nirvana',
  // Jazz/Soul
  'Miles Davis', 'John Coltrane', 'Erykah Badu', 'D\'Angelo', 'Hiatus Kaiyote',
  // Contemporary
  'Phoebe Bridgers', 'Mitski', 'Japanese Breakfast', 'Clairo', 'Kali Uchis'
];

const sampleTracks: { [artist: string]: string[] } = {
  // Indie/Alternative
  'Tame Impala': ['Let It Happen', 'The Less I Know The Better', 'Borderline', 'New Person, Same Old Mistakes', 'Eventually'],
  'Arctic Monkeys': ['Do I Wanna Know?', 'R U Mine?', '505', 'Why\'d You Only Call Me When You\'re High?', 'Fluorescent Adolescent'],
  'The Strokes': ['Reptilia', 'Last Nite', 'Someday', 'The Adults Are Talking', 'You Only Live Once'],
  'Radiohead': ['Paranoid Android', 'Karma Police', 'No Surprises', 'Fake Plastic Trees', 'Creep'],
  'Mac DeMarco': ['Chamber of Reflection', 'My Kind of Woman', 'Freaking Out the Neighborhood', 'Salad Days', 'Ode to Viceroy'],
  
  // Electronic/Dance
  'Daft Punk': ['One More Time', 'Get Lucky', 'Digital Love', 'Harder, Better, Faster, Stronger', 'Around the World'],
  'Flume': ['Never Be Like You', 'Say It', 'Hyperreal', 'Sleepless', 'Holdin On'],
  'ODESZA': ['A Moment Apart', 'Say My Name', 'Late Night', 'Bloom', 'Higher Ground'],
  'Disclosure': ['Latch', 'White Noise', 'Omen', 'When A Fire Starts To Burn', 'F For You'],
  'Bonobo': ['Cirrus', 'Kerala', 'Kiara', 'Black Sands', 'Bambro Koyo Ganda'],
  
  // Hip-Hop/R&B
  'Kendrick Lamar': ['HUMBLE.', 'DNA.', 'N95', 'Alright', 'Swimming Pools'],
  'Frank Ocean': ['Thinkin Bout You', 'Nights', 'Pink + White', 'Nikes', 'Ivy'],
  'Tyler, The Creator': ['See You Again', 'EARFQUAKE', 'IFHY', 'Yonkers', 'New Magic Wand'],
  'SZA': ['Kill Bill', 'Good Days', 'The Weekend', 'Love Galore', 'Broken Clocks'],
  'Anderson .Paak': ['Come Down', 'The Season / Carry Me', 'Am I Wrong', 'Tints', 'Make It Better'],
  
  // Rock/Classic
  'Pink Floyd': ['Comfortably Numb', 'Wish You Were Here', 'Time', 'Money', 'Shine On You Crazy Diamond'],
  'Led Zeppelin': ['Stairway to Heaven', 'Kashmir', 'Black Dog', 'Immigrant Song', 'Whole Lotta Love'],
  'The Beatles': ['Come Together', 'Here Comes The Sun', 'Hey Jude', 'Let It Be', 'Yesterday'],
  'David Bowie': ['Space Oddity', 'Heroes', 'Life on Mars?', 'Starman', 'Changes'],
  'Nirvana': ['Smells Like Teen Spirit', 'Come As You Are', 'Lithium', 'Heart-Shaped Box', 'In Bloom'],
  
  // Jazz/Soul
  'Miles Davis': ['So What', 'Blue in Green', 'Freddie Freeloader', 'All Blues', 'Flamenco Sketches'],
  'John Coltrane': ['Giant Steps', 'My Favorite Things', 'A Love Supreme', 'In a Sentimental Mood', 'Blue Train'],
  'Erykah Badu': ['On & On', 'Bag Lady', 'Tyrone', 'Window Seat', 'Next Lifetime'],
  'D\'Angelo': ['Untitled (How Does It Feel)', 'Brown Sugar', 'Really Love', 'Lady', 'Spanish Joint'],
  'Hiatus Kaiyote': ['Nakamarra', 'Breathing Underwater', 'Molasses', 'By Fire', 'Laputa'],
  
  // Contemporary
  'Phoebe Bridgers': ['Kyoto', 'Motion Sickness', 'Scott Street', 'Garden Song', 'Punisher'],
  'Mitski': ['Nobody', 'Your Best American Girl', 'Washing Machine Heart', 'First Love / Late Spring', 'The Only Heartbreaker'],
  'Japanese Breakfast': ['Be Sweet', 'Boyish', 'Road Head', 'Everybody Wants To Love You', 'Posing in Bondage'],
  'Clairo': ['Sofia', 'Bags', 'Pretty Girl', 'Alewife', 'Blouse'],
  'Kali Uchis': ['telepatía', 'After The Storm', 'Dead to Me', 'Just A Stranger', 'Loner']
};

/**
 * Generate sample streaming history
 * Creates realistic listening patterns with varying frequencies
 * Simulates diverse taste with genre exploration patterns
 */
export function generateSampleData(): StreamingHistoryEntry[] {
  const entries: StreamingHistoryEntry[] = [];
  const startDate = new Date('2022-01-01');
  const endDate = new Date('2024-12-31');
  
  // Generate listening patterns with realistic genre preferences
  const artistWeights: { [artist: string]: number } = {};
  
  // Create more natural distribution - some favorites, some exploration
  // Top 5 artists get higher weight
  sampleArtists.forEach((artist, index) => {
    if (index < 5) {
      // Top favorites
      artistWeights[artist] = Math.pow(0.75, index);
    } else if (index < 15) {
      // Regular rotation
      artistWeights[artist] = Math.pow(0.8, index - 5) * 0.4;
    } else {
      // Occasional listens (exploration)
      artistWeights[artist] = Math.pow(0.85, index - 15) * 0.15;
    }
  });

  // Normalize weights
  const totalWeight = Object.values(artistWeights).reduce((a, b) => a + b, 0);
  Object.keys(artistWeights).forEach(artist => {
    artistWeights[artist] /= totalWeight;
  });

  // Generate entries for each day
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const currentDate = new Date(d);
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // More listening on weekends
    const baseListenCount = isWeekend ? 18 : 12;
    // Add some random variation
    const listenCount = Math.floor(baseListenCount + (Math.random() * 8 - 2));
    
    for (let i = 0; i < listenCount; i++) {
      // Select artist based on weighted probability
      const rand = Math.random();
      let cumulativeWeight = 0;
      let selectedArtist = sampleArtists[0];
      
      for (const artist of sampleArtists) {
        cumulativeWeight += artistWeights[artist];
        if (rand <= cumulativeWeight) {
          selectedArtist = artist;
          break;
        }
      }
      
      // Select random track from artist
      const tracks = sampleTracks[selectedArtist] || ['Unknown Track'];
      const selectedTrack = tracks[Math.floor(Math.random() * tracks.length)];
      
      // Generate time with realistic patterns
      let hour: number;
      const timeRand = Math.random();
      if (timeRand < 0.08) {
        hour = Math.floor(Math.random() * 6); // Late night (0-5) - 8%
      } else if (timeRand < 0.25) {
        hour = Math.floor(Math.random() * 6) + 6; // Morning (6-11) - 17%
      } else if (timeRand < 0.45) {
        hour = Math.floor(Math.random() * 6) + 12; // Afternoon (12-17) - 20%
      } else {
        hour = Math.floor(Math.random() * 6) + 18; // Evening (18-23) - 55%
      }
      
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);
      
      const timestamp = new Date(currentDate);
      timestamp.setHours(hour, minute, second);
      
      // Track duration: 2-6 minutes (more realistic range)
      const msPlayed = Math.floor(120000 + Math.random() * 240000);
      
      entries.push({
        endTime: timestamp.toISOString(),
        artistName: selectedArtist,
        trackName: selectedTrack,
        msPlayed
      });
    }
  }
  
  // Sort by date
  entries.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
  
  return entries;
}

/**
 * Get sample data as an uploaded file object
 */
export function getSampleDataAsFile() {
  const sampleHistory = generateSampleData();
  
  return {
    name: 'Sample_Streaming_History.json',
    type: 'streaming' as const,
    data: sampleHistory
  };
}

/**
 * Check if localStorage has sample data flag
 */
export function hasSampleDataBeenUsed(): boolean {
  return localStorage.getItem('sampleDataUsed') === 'true';
}

/**
 * Mark that sample data has been used
 */
export function markSampleDataAsUsed(): void {
  localStorage.setItem('sampleDataUsed', 'true');
}

/**
 * Clear sample data flag
 */
export function clearSampleDataFlag(): void {
  localStorage.removeItem('sampleDataUsed');
}

