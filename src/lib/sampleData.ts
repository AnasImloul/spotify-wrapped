/**
 * Sample Spotify data for demo purposes
 * Allows users to explore the app without uploading their own data
 */

import { StreamingHistoryEntry } from '@/shared/types';

// Diverse artists across multiple genres for realistic sample data
// Artists are gradually discovered over time through the artistDiscoveryTimeline
const sampleTracks: { [artist: string]: string[] } = {
  // Indie/Alternative
  'Tame Impala': ['Let It Happen', 'The Less I Know The Better', 'Borderline', 'New Person, Same Old Mistakes', 'Eventually'],
  'Arctic Monkeys': ['Do I Wanna Know?', 'R U Mine?', '505', 'Why\'d You Only Call Me When You\'re High?', 'Fluorescent Adolescent'],
  'The Strokes': ['Reptilia', 'Last Nite', 'Someday', 'The Adults Are Talking', 'You Only Live Once'],
  'Radiohead': ['Paranoid Android', 'Karma Police', 'No Surprises', 'Fake Plastic Trees', 'Creep'],
  'Mac DeMarco': ['Chamber of Reflection', 'My Kind of Woman', 'Freaking Out the Neighborhood', 'Salad Days', 'Ode to Viceroy'],
  'Vampire Weekend': ['A-Punk', 'Oxford Comma', 'Cape Cod Kwassa Kwassa', 'Diane Young', 'Harmony Hall'],
  'Phoenix': ['1901', 'Lisztomania', 'Too Young', 'Entertainment', 'Lasso'],
  'MGMT': ['Electric Feel', 'Kids', 'Time to Pretend', 'Little Dark Age', 'Me and Michael'],
  'The xx': ['Intro', 'Crystalised', 'Angels', 'On Hold', 'Infinity'],
  'Alt-J': ['Breezeblocks', 'Tessellate', 'Left Hand Free', 'Fitzpleasure', '3WW'],
  'Two Door Cinema Club': ['What You Know', 'Something Good Can Work', 'Sleep Alone', 'Undercover Martyn', 'Are We Ready'],
  'Foster The People': ['Pumped Up Kicks', 'Sit Next to Me', 'Helena Beat', 'Houdini', 'Coming of Age'],
  'Passion Pit': ['Take a Walk', 'Sleepyhead', 'Little Secrets', 'Carried Away', 'The Reeling'],
  'Local Natives': ['Wide Eyes', 'Sun Hands', 'Who Knows Who Cares', 'Past Lives', 'Vilify'],
  
  // Electronic/Dance
  'Daft Punk': ['One More Time', 'Get Lucky', 'Digital Love', 'Harder, Better, Faster, Stronger', 'Around the World'],
  'Flume': ['Never Be Like You', 'Say It', 'Hyperreal', 'Sleepless', 'Holdin On'],
  'ODESZA': ['A Moment Apart', 'Say My Name', 'Late Night', 'Bloom', 'Higher Ground'],
  'Disclosure': ['Latch', 'White Noise', 'Omen', 'When A Fire Starts To Burn', 'F For You'],
  'Bonobo': ['Cirrus', 'Kerala', 'Kiara', 'Black Sands', 'Bambro Koyo Ganda'],
  'Caribou': ['Can\'t Do Without You', 'Odessa', 'Sun', 'Never Come Back', 'Home'],
  'Four Tet': ['Baby', 'Only Human', 'Angel Echoes', 'Parallel Jalebi', 'Love Salad'],
  'Rüfüs Du Sol': ['Innerbloom', 'Underwater', 'You Were Right', 'Treat You Better', 'On My Knees'],
  'Lane 8': ['Fingerprint', 'No Captain', 'Road', 'Sunday Song', 'Brightest Lights'],
  'Tycho': ['Awake', 'Dive', 'A Walk', 'Epoch', 'Easy'],
  'Jon Hopkins': ['Open Eye Signal', 'Emerald Rush', 'Singularity', 'Feel First Life', 'Collider'],
  'Bicep': ['Glue', 'Apricots', 'Opal', 'Saku', 'Atlas'],
  'Mall Grab': ['Can\'t Get Enough', 'Love Reigns', 'I\'ve Always Liked Grime', 'Pool Party Music', 'Star City'],
  'Fred again..': ['Marea (We\'ve Lost Dancing)', 'Jungle', 'Delilah (pull me out of this)', 'Berwyn (all that i got is you)', 'Kyle (i found you)'],
  'Kaytranada': ['Glowed Up', 'Lite Spots', 'You\'re The One', 'Go DJ', 'Intimidated'],
  
  // Hip-Hop/R&B
  'Kendrick Lamar': ['HUMBLE.', 'DNA.', 'N95', 'Alright', 'Swimming Pools'],
  'Frank Ocean': ['Thinkin Bout You', 'Nights', 'Pink + White', 'Nikes', 'Ivy'],
  'Tyler, The Creator': ['See You Again', 'EARFQUAKE', 'IFHY', 'Yonkers', 'New Magic Wand'],
  'SZA': ['Kill Bill', 'Good Days', 'The Weekend', 'Love Galore', 'Broken Clocks'],
  'Anderson .Paak': ['Come Down', 'The Season / Carry Me', 'Am I Wrong', 'Tints', 'Make It Better'],
  'J. Cole': ['No Role Modelz', 'MIDDLE CHILD', 'ATM', 'a m a r i', 'Wet Dreamz'],
  'Drake': ['One Dance', 'Hotline Bling', 'God\'s Plan', 'Passionfruit', 'Nice For What'],
  'Childish Gambino': ['Redbone', '3005', 'Sober', 'Sweatpants', 'This Is America'],
  'Vince Staples': ['Norf Norf', 'Big Fish', 'FUN!', 'Summertime', 'Yeah Right'],
  'Isaiah Rashad': ['Headshots (4r Da Locals)', 'Wat\'s Wrong', 'RIP Young', 'From the Garden', 'Lay Wit Ya'],
  'JID': ['Crack Sandwich', 'Off Deez', 'Never', 'Working Out', 'Lauder'],
  'Denzel Curry': ['Ultimate', 'Clout Cobain', 'Ricky', 'Walkin', 'CAROLMART'],
  'Mac Miller': ['Self Care', 'Dang!', 'Weekend', 'Good News', 'What\'s The Use?'],
  'A$AP Rocky': ['L$D', 'Praise The Lord', 'Peso', 'Fashion Killa', 'Sundress'],
  'Travis Scott': ['SICKO MODE', 'goosebumps', 'Antidote', 'Butterfly Effect', 'Highest in the Room'],
  'Summer Walker': ['Girls Need Love', 'Playing Games', 'Come Thru', 'Over It', 'No Love'],
  'H.E.R.': ['Focus', 'Best Part', 'Slide', 'Damage', 'Hard Place'],
  'Jhené Aiko': ['The Worst', 'Sativa', 'Spotless Mind', 'While We\'re Young', 'Trip'],
  'Brent Faiyaz': ['Clouded', 'Crew', 'Gravity', 'Dead Man Walking', 'Rehab (Winter in Paris)'],
  'Steve Lacy': ['Dark Red', 'Some', 'Bad Habit', 'Infrunami', 'C U Girl'],
  
  // Rock/Classic
  'Pink Floyd': ['Comfortably Numb', 'Wish You Were Here', 'Time', 'Money', 'Shine On You Crazy Diamond'],
  'Led Zeppelin': ['Stairway to Heaven', 'Kashmir', 'Black Dog', 'Immigrant Song', 'Whole Lotta Love'],
  'The Beatles': ['Come Together', 'Here Comes The Sun', 'Hey Jude', 'Let It Be', 'Yesterday'],
  'David Bowie': ['Space Oddity', 'Heroes', 'Life on Mars?', 'Starman', 'Changes'],
  'Nirvana': ['Smells Like Teen Spirit', 'Come As You Are', 'Lithium', 'Heart-Shaped Box', 'In Bloom'],
  'Queen': ['Bohemian Rhapsody', 'Don\'t Stop Me Now', 'Somebody To Love', 'We Will Rock You', 'Under Pressure'],
  'Fleetwood Mac': ['Dreams', 'The Chain', 'Go Your Own Way', 'Everywhere', 'Landslide'],
  'The Doors': ['Light My Fire', 'Riders on the Storm', 'Break On Through', 'L.A. Woman', 'People Are Strange'],
  'Jimi Hendrix': ['Purple Haze', 'All Along the Watchtower', 'Hey Joe', 'Little Wing', 'Voodoo Child'],
  'Pearl Jam': ['Black', 'Alive', 'Jeremy', 'Even Flow', 'Better Man'],
  'Foo Fighters': ['Everlong', 'The Pretender', 'Best of You', 'Learn to Fly', 'Times Like These'],
  'Red Hot Chili Peppers': ['Under the Bridge', 'Californication', 'Scar Tissue', 'Otherside', 'Can\'t Stop'],
  'Kings of Leon': ['Sex on Fire', 'Use Somebody', 'Pyro', 'The Bucket', 'Radioactive'],
  'The Killers': ['Mr. Brightside', 'When You Were Young', 'Somebody Told Me', 'Human', 'Read My Mind'],
  
  // Jazz/Soul/Funk
  'Miles Davis': ['So What', 'Blue in Green', 'Freddie Freeloader', 'All Blues', 'Flamenco Sketches'],
  'John Coltrane': ['Giant Steps', 'My Favorite Things', 'A Love Supreme', 'In a Sentimental Mood', 'Blue Train'],
  'Erykah Badu': ['On & On', 'Bag Lady', 'Tyrone', 'Window Seat', 'Next Lifetime'],
  'D\'Angelo': ['Untitled (How Does It Feel)', 'Brown Sugar', 'Really Love', 'Lady', 'Spanish Joint'],
  'Hiatus Kaiyote': ['Nakamarra', 'Breathing Underwater', 'Molasses', 'By Fire', 'Laputa'],
  'Thundercat': ['Them Changes', 'Funny Thing', 'Friend Zone', 'Show You The Way', 'Dragonball Durag'],
  'Tom Misch': ['It Runs Through Me', 'Movie', 'Disco Yes', 'Lost in Paris', 'Water Baby'],
  'Khruangbin': ['Time (You and I)', 'People Everywhere', 'Maria También', 'White Gloves', 'Pelota'],
  'Snarky Puppy': ['What About Me?', 'Lingus', 'Shofukan', 'Outlier', 'Tarova'],
  'Robert Glasper': ['Afro Blue', 'Black Radio', 'Rise and Shine', 'Covered', 'Gonna Be Alright'],
  'Kiefer': ['What A Day', 'Bridges', 'Highway 46', 'Lounge Set', 'When You Wish Upon A Star'],
  'BadBadNotGood': ['Time Moves Slow', 'Lavender', 'In Your Eyes', 'Speaking Gently', 'Kaleidoscope'],
  'FKJ': ['Tadow', 'Instant Need', 'Lying Together', 'Skyline', 'Die With A Smile'],
  'Moonchild': ['The List', 'Too Much', 'Run Away', 'Show The Way', 'Nobody'],
  'Masego': ['Tadow', 'Navajo', 'Queen Tings', 'Lady Lady', 'Mystery Lady'],
  
  // Contemporary/Bedroom Pop
  'Phoebe Bridgers': ['Kyoto', 'Motion Sickness', 'Scott Street', 'Garden Song', 'Punisher'],
  'Mitski': ['Nobody', 'Your Best American Girl', 'Washing Machine Heart', 'First Love / Late Spring', 'The Only Heartbreaker'],
  'Japanese Breakfast': ['Be Sweet', 'Boyish', 'Road Head', 'Everybody Wants To Love You', 'Posing in Bondage'],
  'Clairo': ['Sofia', 'Bags', 'Pretty Girl', 'Alewife', 'Blouse'],
  'Kali Uchis': ['telepatía', 'After The Storm', 'Dead to Me', 'Just A Stranger', 'Loner'],
  'boygenius': ['Not Strong Enough', 'Cool About It', 'Emily I\'m Sorry', '$20', 'True Blue'],
  'Snail Mail': ['Heat Wave', 'Pristine', 'Static Buzz', 'Valentine', 'Forever (Sailing)'],
  'Soccer Mommy': ['Your Dog', 'circle the drain', 'Cool', 'Blossom (Wasting All My Time)', 'Skin'],
  'Beabadoobee': ['Coffee', 'Care', 'The Perfect Pair', 'Last Day on Earth', 'Glue Song'],
  'Girl in Red': ['we fell in love in october', 'bad idea!', 'Serotonin', 'I Wanna Be Your Girlfriend', 'Rue'],
  'Raveena': ['Honey', 'If Only', 'Stronger', 'Temptation', 'Still Dreaming'],
  'Omar Apollo': ['Evergreen', 'Ugotme', 'Trouble', 'Invincible', 'Bad Life'],
  'Cuco': ['Lo Que Siento', 'Lover Is A Day', 'Hydrocodone', 'Amor De Siempre', 'Piel Canela'],
  'Gus Dapperton': ['Prune, You Talk Funny', 'Supalonely', 'World Class Cinema', 'My Favorite Fish', 'First Aid'],
  'Still Woozy': ['Goodie Bag', 'Vacation', 'Cooks', 'Habit', 'Windows'],
  
  // Alternative R&B/Soul
  'The Weeknd': ['Blinding Lights', 'Starboy', 'The Hills', 'Can\'t Feel My Face', 'Save Your Tears'],
  'Daniel Caesar': ['Best Part', 'Get You', 'Japanese Denim', 'Love Again', 'Blessed'],
  'Jorja Smith': ['Blue Lights', 'On My Mind', 'Be Honest', 'Addicted', 'Where Did I Go?'],
  'Mahalia': ['Sober', 'Terms and Conditions', 'I Wish I Missed My Ex', 'Do Not Disturb', 'What You Did'],
  'Nao': ['Bad Blood', 'Another Lifetime', 'Drive and Disconnect', 'Fool to Love', 'Make It Out Alive'],
  'Sonder': ['Too Fast', 'What You Heard', 'Nobody But You', 'One Night Only', 'Divided'],
  'Giveon': ['Heartbreak Anniversary', 'Like I Want You', 'LOVE YOU WHEN THE PARTY\'S OVER', 'For Tonight', 'Stuck On You'],
  'Ari Lennox': ['Shea Butter Baby', 'BMO', 'Up Late', 'Whipped Cream', 'Pressure'],
  'Ella Mai': ['Boo\'d Up', 'Trip', 'Shot Clock', 'Not Another Love Song', '10,000 Hours'],
  'Kehlani': ['Nights Like This', 'Honey', 'CRZY', 'Toxic', 'You Know Wassup'],
  
  // Pop/Mainstream
  'Billie Eilish': ['bad guy', 'when the party\'s over', 'ocean eyes', 'everything i wanted', 'Happier Than Ever'],
  'Lorde': ['Royals', 'Green Light', 'Liability', 'Perfect Places', 'Solar Power'],
  'Lana Del Rey': ['Summertime Sadness', 'Video Games', 'Born To Die', 'Young and Beautiful', 'West Coast'],
  'The 1975': ['Somebody Else', 'The Sound', 'Sex', 'Chocolate', 'Love It If We Made It'],
  'Troye Sivan': ['Youth', 'My My My!', 'Dance To This', 'Strawberries & Cigarettes', 'Angel Baby'],
  'Harry Styles': ['Watermelon Sugar', 'Sign of the Times', 'Adore You', 'Golden', 'As It Was'],
  'Dua Lipa': ['Levitating', 'Don\'t Start Now', 'New Rules', 'Physical', 'One Kiss'],
  'Ariana Grande': ['thank u, next', '7 rings', 'no tears left to cry', 'breathin', 'positions'],
  'Taylor Swift': ['Shake It Off', 'Blank Space', 'Love Story', 'Anti-Hero', 'Cruel Summer'],
  'Post Malone': ['Circles', 'Sunflower', 'rockstar', 'Better Now', 'Congratulations']
};

/**
 * Generate sample streaming history
 * Creates realistic listening patterns with varying frequencies
 * Simulates diverse taste with genre exploration patterns and gradual artist discovery
 */
export function generateSampleData(): StreamingHistoryEntry[] {
  const entries: StreamingHistoryEntry[] = [];
  const startDate = new Date('2022-01-01');
  const endDate = new Date('2024-12-31');
  
  // Get all artists from sampleTracks keys and shuffle them randomly
  const allArtistsToDiscover = Object.keys(sampleTracks);
  
  // Shuffle the artists randomly using Fisher-Yates algorithm
  const shuffledArtists = [...allArtistsToDiscover];
  for (let i = shuffledArtists.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArtists[i], shuffledArtists[j]] = [shuffledArtists[j], shuffledArtists[i]];
  }
  
  // Distribute artists evenly across ALL 36 months (months 0-35)
  const artistDiscoveryTimeline: Array<{
    month: number;
    newArtists: string[];
  }> = [];
  
  const totalArtists = shuffledArtists.length;
  const totalMonths = 36;
  const baseArtistsPerMonth = Math.floor(totalArtists / totalMonths); // ~2-3 per month
  let remainingArtists = totalArtists % totalMonths;
  
  let artistIndex = 0;
  for (let month = 0; month < totalMonths; month++) {
    // Some months get one extra artist to distribute the remainder
    let artistsThisMonth = baseArtistsPerMonth;
    if (remainingArtists > 0) {
      artistsThisMonth++;
      remainingArtists--;
    }
    
    // Add some randomness: occasionally skip a month or double up
    if (Math.random() < 0.15 && month > 0) {
      // 15% chance to skip this month (spread artists to next month)
      continue;
    } else if (Math.random() < 0.1 && artistIndex + artistsThisMonth < totalArtists) {
      // 10% chance to add extra artists this month
      artistsThisMonth += 1;
    }
    
    const artists = shuffledArtists.slice(artistIndex, artistIndex + artistsThisMonth);
    
    if (artists.length > 0) {
      artistDiscoveryTimeline.push({
        month,
        newArtists: artists
      });
      artistIndex += artistsThisMonth;
    }
    
    // Safety check: if we've used all artists, stop
    if (artistIndex >= totalArtists) {
      break;
    }
  }
  
  // If any artists remain (shouldn't happen but safety), add them to last month
  if (artistIndex < totalArtists) {
    const lastEntry = artistDiscoveryTimeline[artistDiscoveryTimeline.length - 1];
    if (lastEntry) {
      lastEntry.newArtists.push(...shuffledArtists.slice(artistIndex));
    }
  }
  
  // Helper function to get discovered artists up to a given date
  const getDiscoveredArtists = (date: Date): string[] => {
    const monthsSinceStart = (date.getFullYear() - 2022) * 12 + date.getMonth();
    const discovered: string[] = [];
    
    artistDiscoveryTimeline.forEach(discovery => {
      if (discovery.month <= monthsSinceStart) {
        discovered.push(...discovery.newArtists);
      }
    });
    
    return discovered;
  };
  
  // Generate dynamic interest curves for each artist
  // Each artist gets multiple "interest peaks" throughout the timeline
  interface ArtistInterestCurve {
    discoveryMonth: number;
    peaks: Array<{ month: number; intensity: number }>; // Multiple interest peaks
    baselineDecay: number; // How fast interest decays between peaks
  }
  
  const artistInterestCurves = new Map<string, ArtistInterestCurve>();
  
  // Generate interest curves for all artists
  // Later-discovered artists get AGGRESSIVE boosting to compensate for less time
  artistDiscoveryTimeline.forEach(discovery => {
    discovery.newArtists.forEach(artist => {
      const discoveryMonth = discovery.month;
      const remainingMonths = 35 - discoveryMonth;
      
      // Calculate mathematically balanced time-compensation
      // Goal: Expected total listens should be equal regardless of discovery time
      // Formula: E[total_listens] = remaining_months × avg_interest × listens_per_day
      // For balance: remaining_months_early × interest_early = remaining_months_late × interest_late
      // Therefore: compensation = (max_remaining / current_remaining) ^ exponent
      
      const maxRemainingMonths = 35; // Month 0 has 35 months remaining
      const minRemainingMonths = 3; // Safety floor to prevent extreme values
      const safeRemainingMonths = Math.max(remainingMonths, minRemainingMonths);
      
      // Exponent determines compensation aggressiveness:
      // 0.5 = too weak, 0.7 = still weak (current), 0.85 = strong, 1.0 = full linear compensation
      // Using 0.85 as a balance between fairness and believability
      const timeCompensation = Math.pow(maxRemainingMonths / safeRemainingMonths, 0.85);
      
      // This gives:
      // Month 0 (35 remaining): (35/35)^0.85 = 1.0x
      // Month 10 (25 remaining): (35/25)^0.85 = 1.34x  
      // Month 20 (15 remaining): (35/15)^0.85 = 2.1x
      // Month 28 (7 remaining): (35/7)^0.85 = 4.3x
      // Month 32 (3 remaining): (35/3)^0.85 = 8.6x
      
      // Peak distribution strategy: late artists need MORE peaks closer together
      // to maintain high interest throughout their short timeframe
      let numPeaks: number;
      if (remainingMonths > 24) {
        numPeaks = 2 + Math.floor(Math.random() * 3); // 2-4 peaks spread out
      } else if (remainingMonths > 12) {
        numPeaks = 2 + Math.floor(Math.random() * 3); // 2-4 peaks closer together
      } else {
        numPeaks = 2 + Math.floor(Math.random() * 2); // 2-3 intense peaks very close together
      }
      
      const peaks: Array<{ month: number; intensity: number }> = [];
      
      // First peak happens immediately or very soon after discovery
      const firstPeakIntensity = (0.6 + Math.random() * 0.4) * timeCompensation;
      peaks.push({
        month: discoveryMonth + (remainingMonths > 6 ? Math.floor(Math.random() * 2) : 0),
        intensity: firstPeakIntensity // Can be 8x+ for very late discoveries!
      });
      
      // Generate additional peaks throughout remaining timeline
      // For late discoveries, peaks should be closer together to maintain constant high interest
      for (let i = 1; i < numPeaks; i++) {
        let peakMonth: number;
        
        if (remainingMonths <= 6) {
          // Very late: spread peaks evenly across remaining months
          peakMonth = discoveryMonth + Math.floor((remainingMonths / numPeaks) * i);
        } else {
          // Earlier: random distribution
          peakMonth = discoveryMonth + Math.floor(Math.random() * remainingMonths);
        }
        
        const baseIntensity = 0.4 + Math.random() * 0.6;
        const boostedIntensity = baseIntensity * timeCompensation;
        peaks.push({ 
          month: peakMonth, 
          intensity: boostedIntensity // Fully boosted, no cap
        });
      }
      
      // Sort peaks by month
      peaks.sort((a, b) => a.month - b.month);
      
      // Late discoveries need significantly slower decay to maintain their boosted intensity
      // Decay determines how long interest remains high after a peak
      // Higher decay = interest sustained longer (counter-intuitive naming!)
      const decayBonus = Math.pow(discoveryMonth / 35, 0.8) * 1.2; // Up to +1.2 for latest discoveries
      const baselineDecay = 0.9 + Math.random() * 0.3 + decayBonus;
      
      artistInterestCurves.set(artist, {
        discoveryMonth,
        peaks,
        baselineDecay
      });
    });
  });
  
  // Generate monthly activity multipliers (replacing hard-coded phases)
  const monthlyActivityMultipliers: number[] = [];
  for (let month = 0; month <= 35; month++) {
    // Base activity with natural variation
    let activity = 1.0;
    
    // Seasonal patterns (summer peaks, winter dips)
    const seasonalMonth = month % 12;
    if (seasonalMonth >= 5 && seasonalMonth <= 7) {
      activity *= 1.2 + Math.random() * 0.3; // Summer boost
    } else if (seasonalMonth >= 11 || seasonalMonth <= 1) {
      activity *= 0.85 + Math.random() * 0.2; // Winter reduction
    }
    
    // Random life events causing activity changes
    if (Math.random() < 0.2) {
      // 20% chance of busy period
      activity *= 0.6 + Math.random() * 0.3;
    } else if (Math.random() < 0.15) {
      // 15% chance of high-activity period
      activity *= 1.3 + Math.random() * 0.4;
    }
    
    monthlyActivityMultipliers.push(activity);
  }
  
  // Helper function to calculate artist interest at a given time
  const getArtistInterest = (artist: string, monthsSinceStart: number): number => {
    const curve = artistInterestCurves.get(artist);
    if (!curve) return 0.01;
    
    // Not discovered yet
    if (monthsSinceStart < curve.discoveryMonth) return 0;
    
    // Higher baseline interest that all discovered artists maintain
    // This ensures artists remain relevant throughout the timeline
    const monthsSinceDiscovery = monthsSinceStart - curve.discoveryMonth;
    const baselineInterest = 0.15 + Math.random() * 0.1; // 15-25% baseline (was 8-12%)
    
    // Calculate peak influences with MUCH SLOWER decay
    let peakInfluence = 0;
    
    curve.peaks.forEach(peak => {
      // Calculate distance from this peak
      const distance = Math.abs(monthsSinceStart - peak.month);
      
      // Much gentler exponential decay - large denominator for very slow fall-off
      // Evolution: exp(-distance / 4) → exp(-distance / 8) → exp(-distance / 16)
      // 4x slower decay than original, allowing peaks to influence across many months
      const decayFactor = Math.exp(-distance / (16 * curve.baselineDecay));
      
      // Each peak also has a "floor" - never drops below 20% of peak intensity
      const peakFloor = peak.intensity * 0.2;
      const decayedInfluence = peak.intensity * decayFactor;
      
      peakInfluence += Math.max(decayedInfluence, peakFloor);
    });
    
    // Combine baseline + peak influence
    let interest = baselineInterest + peakInfluence;
    
    // Newly discovered artists get additional bonus interest
    if (monthsSinceDiscovery <= 2) {
      interest += 0.2 * (1 - monthsSinceDiscovery / 2);
    }
    
    // Add occasional random interest spikes (rediscovery moments!)
    // Increased chance for more frequent rediscoveries
    if (Math.random() < 0.08) { // 8% chance (was 5%)
      interest *= 1.3 + Math.random() * 0.7; // 30-100% spike (was 30-80%)
    }
    
    // Random day-to-day variation
    interest *= 0.85 + Math.random() * 0.3;
    
    // Allow late-discovered artists to have higher interest (no cap)
    return interest;
  };
  
  // Helper function to generate dynamic artist weights for a given date
  const getArtistWeights = (date: Date): { [artist: string]: number } => {
    const monthsSinceStart = (date.getFullYear() - 2022) * 12 + date.getMonth();
    const discoveredArtists = getDiscoveredArtists(date);
    const weights: { [artist: string]: number } = {};
    
    // Calculate interest-based weights for each discovered artist
    discoveredArtists.forEach(artist => {
      weights[artist] = getArtistInterest(artist, monthsSinceStart);
    });
    
    // Normalize weights
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    if (totalWeight > 0) {
      Object.keys(weights).forEach(artist => {
        weights[artist] /= totalWeight;
      });
    }
    
    return weights;
  };
  
  // Generate entries for each day
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const currentDate = new Date(d);
    const monthsSinceStart = (currentDate.getFullYear() - 2022) * 12 + currentDate.getMonth();
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Get artists discovered up to this date
    const discoveredArtists = getDiscoveredArtists(currentDate);
    
    // Skip if no artists discovered yet (shouldn't happen but safety check)
    if (discoveredArtists.length === 0) continue;
    
    // Base listening varies by monthly activity (dynamic, not hard-coded)
    const monthlyMultiplier = monthlyActivityMultipliers[monthsSinceStart] || 1.0;
    let baseListenCount = (isWeekend ? 25 : 15) * monthlyMultiplier;
    
    // Add significant random variation to make it more human
    // Some days you listen a lot, some days barely at all
    const randomFactor = Math.random();
    if (randomFactor < 0.1) {
      // 10% chance of very low activity day
      baseListenCount *= 0.2 + Math.random() * 0.3;
    } else if (randomFactor < 0.25) {
      // 15% chance of low activity
      baseListenCount *= 0.5 + Math.random() * 0.3;
    } else if (randomFactor > 0.85) {
      // 15% chance of very high activity (binge listening day)
      baseListenCount *= 1.5 + Math.random() * 0.8;
    } else {
      // Normal variation
      baseListenCount *= 0.8 + Math.random() * 0.4;
    }
    
    const listenCount = Math.max(1, Math.floor(baseListenCount));
    
    // Get dynamic weights for this date
    const artistWeights = getArtistWeights(currentDate);
    
    for (let i = 0; i < listenCount; i++) {
      // Select artist based on weighted probability from discovered artists
      const rand = Math.random();
      let cumulativeWeight = 0;
      let selectedArtist = discoveredArtists[0];
      
      for (const artist of discoveredArtists) {
        cumulativeWeight += (artistWeights[artist] || 0);
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
      
      // Track duration: 2-6 minutes with more realistic variation
      // Sometimes skip tracks early, sometimes listen all the way
      const durationRand = Math.random();
      
      let msPlayed: number;
      if (durationRand < 0.15) {
        // 15% chance of skipping (30s - 1min)
        msPlayed = 30000 + Math.random() * 30000;
      } else {
        // Normal listen (2-6 minutes)
        msPlayed = 120000 + Math.random() * 240000;
      }
      
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

