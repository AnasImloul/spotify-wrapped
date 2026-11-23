import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { UploadedFile, ProcessedStats, StreamingHistoryEntry } from '@/shared/types';
import { getStreamingHistoryFromFiles, processStreamingHistory } from '@/lib/dataProcessor';
import { useDateRangeContext } from './DateRangeContext';
import { useDeferredComputation } from '@/shared/hooks/useDeferredComputation';

interface SpotifyDataContextType {
  uploadedFiles: UploadedFile[];
  streamingHistory: StreamingHistoryEntry[];
  stats: ProcessedStats | null;
  isProcessing: boolean;
  statsRange: { startDate: string; endDate: string };
  handleFilesProcessed: (files: UploadedFile[]) => void;
  clearData: () => void;
}

const SpotifyDataContext = createContext<SpotifyDataContextType | undefined>(undefined);
const StatsPendingContext = createContext(false);

interface SpotifyDataProviderProps {
  children: ReactNode;
}

export function SpotifyDataProvider({ children }: SpotifyDataProviderProps) {
  const { startDate, endDate, updateDateRangeFromFiles } = useDateRangeContext();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [streamingHistory, setStreamingHistory] = useState<StreamingHistoryEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesProcessed = useCallback(
    (files: UploadedFile[]) => {
      setUploadedFiles(files);
      updateDateRangeFromFiles(files);
    },
    [updateDateRangeFromFiles]
  );

  const clearData = useCallback(() => {
    setUploadedFiles([]);
    setStreamingHistory([]);
    updateDateRangeFromFiles([]);
  }, [updateDateRangeFromFiles]);

  // Extract streaming history only when files change (not on date range change)
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      setIsProcessing(true);
      // Use setTimeout to allow UI to update before heavy processing
      setTimeout(() => {
        const history = getStreamingHistoryFromFiles(uploadedFiles);
        setStreamingHistory(history);
        setIsProcessing(false);
      }, 0);
    } else {
      setStreamingHistory([]);
      setIsProcessing(false);
    }
  }, [uploadedFiles]);

  const computeStats = (): ProcessedStats | null => {
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

    const processedStats = processStreamingHistory(filteredHistory, startDate, endDate);

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
  };

  // Stats are computed after the frame paints so filter changes stay responsive.
  // The previous result stays visible (marked pending) until the new one is ready.
  const { data: statsResult, isPending } = useDeferredComputation(
    () => ({ history: streamingHistory, startDate, endDate, stats: computeStats() }),
    [streamingHistory, startDate, endDate]
  );
  const statsMatchHistory = statsResult?.history === streamingHistory;
  const stats = statsMatchHistory ? statsResult.stats : null;
  const isAwaitingFirstStats = streamingHistory.length > 0 && !statsMatchHistory;
  const isStatsPending = isPending && stats !== null;
  const rangeStart = statsMatchHistory && statsResult ? statsResult.startDate : startDate;
  const rangeEnd = statsMatchHistory && statsResult ? statsResult.endDate : endDate;
  const processing = isProcessing || isAwaitingFirstStats;

  const value = useMemo(
    () => ({
      uploadedFiles,
      streamingHistory,
      stats,
      isProcessing: processing,
      statsRange: { startDate: rangeStart, endDate: rangeEnd },
      handleFilesProcessed,
      clearData,
    }),
    [
      uploadedFiles,
      streamingHistory,
      stats,
      processing,
      rangeStart,
      rangeEnd,
      handleFilesProcessed,
      clearData,
    ]
  );

  return (
    <SpotifyDataContext.Provider value={value}>
      <StatsPendingContext.Provider value={isStatsPending}>{children}</StatsPendingContext.Provider>
    </SpotifyDataContext.Provider>
  );
}

/** True while stats for a new date range are being computed; the old stats stay visible. */
export function useStatsPending() {
  return useContext(StatsPendingContext);
}

export function useSpotifyDataContext() {
  const context = useContext(SpotifyDataContext);
  if (context === undefined) {
    throw new Error('useSpotifyDataContext must be used within a SpotifyDataProvider');
  }
  return context;
}
