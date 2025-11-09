import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { UploadedFile, ProcessedStats, StreamingHistoryEntry } from '@/types/spotify';
import { parseUploadedFiles, getStreamingHistoryFromFiles } from '@/lib/dataProcessor';
import { useDateRangeContext } from './DateRangeContext';

interface SpotifyDataContextType {
  uploadedFiles: UploadedFile[];
  streamingHistory: StreamingHistoryEntry[];
  stats: ProcessedStats | null;
  handleFilesProcessed: (files: UploadedFile[]) => void;
  clearData: () => void;
}

const SpotifyDataContext = createContext<SpotifyDataContextType | undefined>(undefined);

interface SpotifyDataProviderProps {
  children: ReactNode;
}

export function SpotifyDataProvider({ children }: SpotifyDataProviderProps) {
  const { startDate, endDate, updateDateRangeFromFiles } = useDateRangeContext();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [streamingHistory, setStreamingHistory] = useState<StreamingHistoryEntry[]>([]);

  const handleFilesProcessed = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    updateDateRangeFromFiles(files);
  };

  const clearData = () => {
    setUploadedFiles([]);
    setStreamingHistory([]);
    updateDateRangeFromFiles([]);
  };

  // Extract streaming history only when files change (not on date range change)
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const history = getStreamingHistoryFromFiles(uploadedFiles);
      setStreamingHistory(history);
    } else {
      setStreamingHistory([]);
    }
  }, [uploadedFiles]);

  // Memoize stats calculation - only recalculate when dependencies actually change
  const stats = useMemo(() => {
    if (streamingHistory.length === 0) {
      return null;
    }
    
    // Filter streaming history by date range
    const filteredHistory = streamingHistory.filter((entry) => {
      if (!startDate || !endDate) return true;
      
      const entryDate = new Date(entry.endTime);
      const entryYearMonth = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
      
      return entryYearMonth >= startDate && entryYearMonth <= endDate;
    });
    
    if (filteredHistory.length === 0) {
      return {
        totalListeningTime: 0,
        totalTracks: 0,
        totalArtists: 0,
        topGenres: [],
        listeningByMonth: [],
        topArtists: [],
        topTracks: [],
        averageListeningPerDay: 0,
      };
    }
    
    console.time('Stats calculation');
    // Process the already-filtered history
    const { processStreamingHistory } = require('@/lib/dataProcessor');
    const processedStats = processStreamingHistory(filteredHistory, startDate, endDate);
    console.timeEnd('Stats calculation');
    
    return {
      totalListeningTime: processedStats.totalListeningTime || 0,
      totalTracks: processedStats.totalTracks || 0,
      totalArtists: processedStats.totalArtists || 0,
      topArtistName: processedStats.topArtistName,
      topTrackName: processedStats.topTrackName,
      topGenres: processedStats.topGenres || [],
      listeningByMonth: processedStats.listeningByMonth || [],
      topArtists: processedStats.topArtists || [],
      topTracks: processedStats.topTracks || [],
      averageListeningPerDay: processedStats.averageListeningPerDay || 0,
      mostActiveDay: processedStats.mostActiveDay,
      mostActiveDayMinutes: processedStats.mostActiveDayMinutes,
    };
  }, [streamingHistory, startDate, endDate]);

  return (
    <SpotifyDataContext.Provider
      value={{
        uploadedFiles,
        streamingHistory,
        stats,
        handleFilesProcessed,
        clearData,
      }}
    >
      {children}
    </SpotifyDataContext.Provider>
  );
}

export function useSpotifyDataContext() {
  const context = useContext(SpotifyDataContext);
  if (context === undefined) {
    throw new Error('useSpotifyDataContext must be used within a SpotifyDataProvider');
  }
  return context;
}

