import React, { useCallback, useState } from 'react';
import { Upload, FileJson, X, Play, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { detectFileType, UploadedFile } from '@/shared/services';
import { cn } from '@/shared/utils';
import { useSpotifyData } from '@/shared/hooks';
import { getSampleDataAsFile, markSampleDataAsUsed } from '@/lib/sampleData';

interface FileUploadProps {
  onSampleDataLoaded?: () => void;
}

export function FileUpload({ onSampleDataLoaded }: FileUploadProps = {}) {
  const { uploadedFiles, handleFilesProcessed } = useSpotifyData();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFiles = async (files: FileList) => {
    setError(null);

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.name.endsWith('.json')) {
        setError('Please upload only JSON files');
        continue;
      }

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const type = detectFileType(file.name, data);

        // Only accept streaming history files (both standard and extended)
        if (type !== 'streaming' && type !== 'extended') {
          setError(
            `${file.name} is not a streaming history file. Please upload only StreamingHistory_music_*.json or Streaming_History_Audio_*.json files.`
          );
          continue;
        }

        newFiles.push({
          name: file.name,
          type,
          data,
        });
      } catch (err) {
        setError(
          `Error parsing ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`
        );
      }
    }

    if (newFiles.length === 0 && error) {
      return; // Don't update if no valid files were added
    }

    // Check for mixed types (standard + extended)
    const allFiles = [...uploadedFiles, ...newFiles];
    const types = new Set(allFiles.map((f) => f.type));

    if (types.has('streaming') && types.has('extended')) {
      setError(
        'Cannot mix standard and extended streaming history files. Please upload only one type to avoid duplicate data. Remove all files and start over with a single format.'
      );
      return;
    }

    handleFilesProcessed(allFiles);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const { files } = e.dataTransfer;
      if (files && files.length > 0) {
        processFiles(files);
      }
    },
    [uploadedFiles, handleFilesProcessed]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    handleFilesProcessed(newFiles);
  };

  const handleLoadSampleData = () => {
    setError(null);
    setLoadingSample(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      try {
        const sampleFile = getSampleDataAsFile();
        handleFilesProcessed([sampleFile]);
        markSampleDataAsUsed();
        if (onSampleDataLoaded) {
          onSampleDataLoaded();
        }
      } catch (err) {
        setError('Failed to load sample data. Please try again.');
      } finally {
        setLoadingSample(false);
      }
    }, 500);
  };

  return (
    <div className="w-full flex flex-col gap-4 lg:flex-1">
      <div
        className={cn(
          'border border-dashed transition-colors duration-200 lg:flex-1 flex flex-col justify-center',
          isDragging ? 'border-primary bg-primary/5' : 'border-input hover:border-muted-foreground'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="relative flex flex-col items-start px-6 py-10 sm:px-10 sm:py-16">
          <Upload
            aria-hidden
            className={cn(
              'w-8 h-8 mb-6 transition-colors',
              isDragging ? 'text-primary' : 'text-muted-foreground'
            )}
          />
          <h3 className="text-2xl sm:text-3xl font-semibold leading-tight mb-3 text-balance">
            Drop your streaming history files here
          </h3>
          <p className="text-muted-foreground max-w-prose mb-3 leading-relaxed">
            Upload{' '}
            <span className="font-mono text-sm text-foreground">StreamingHistory_music_*.json</span>{' '}
            (standard) <strong className="text-foreground">or</strong>{' '}
            <span className="font-mono text-sm text-foreground">
              Streaming_History_Audio_*.json
            </span>{' '}
            (extended) files from your Spotify data export.
          </p>
          <p className="flex items-center gap-2 text-sm text-code-yellow mb-8">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden />
            Warning: Do not mix both types to avoid duplicate data
          </p>
          <div className="flex flex-wrap gap-3">
            <label className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors bg-primary text-primary-foreground hover:bg-[#3BE477] h-11 px-6 cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
              <Upload className="h-4 w-4 flex-shrink-0" aria-hidden />
              Choose Files
              <input
                type="file"
                multiple
                accept=".json"
                onChange={handleFileInput}
                className="sr-only"
              />
            </label>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadSampleData}
              disabled={loadingSample || uploadedFiles.length > 0}
              className="h-11 px-6"
            >
              {loadingSample ? (
                <>
                  <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" aria-hidden />
                  Loading...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 flex-shrink-0" aria-hidden />
                  Try Sample
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="border border-destructive px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="border border-border bg-card">
          <h4 className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="label-caps">Uploaded files</span>
            <span className="text-sm tabular-nums text-muted-foreground">
              {uploadedFiles.length}
            </span>
          </h4>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileJson className="w-4 h-4 text-primary flex-shrink-0" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium break-words">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.type === 'extended' ? 'Extended streaming' : 'Standard streaming'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                  className="flex-shrink-0 h-9 w-9"
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
