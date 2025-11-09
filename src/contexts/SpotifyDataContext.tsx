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
    if (uploadedFiles.length === 0) {
      return null;
    }
    console.time('Stats calculation');
    const processedStats = parseUploadedFiles(uploadedFiles, startDate, endDate);
    console.timeEnd('Stats calculation');
    return processedStats;
  }, [uploadedFiles, startDate, endDate]);

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

