import React, { useCallback, useState } from 'react';
import { Upload, FileJson, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { detectFileType, UploadedFile } from '@/lib/dataProcessor';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesProcessed: (files: UploadedFile[]) => void;
}

export function FileUpload({ onFilesProcessed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

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
        
        newFiles.push({
          name: file.name,
          type,
          data,
        });
      } catch (err) {
        setError(`Error parsing ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    const allFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(allFiles);
    onFilesProcessed(allFiles);
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
    [uploadedFiles, onFilesProcessed]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesProcessed(newFiles);
  };

  return (
    <div className="w-full space-y-4">
      <Card
        className={cn(
          'border-2 border-dashed transition-all duration-200',
          isDragging
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-muted-foreground/25 hover:border-primary/50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          <Upload
            className={cn(
              'w-16 h-16 mb-4 transition-colors',
              isDragging ? 'text-primary' : 'text-muted-foreground'
            )}
          />
          <h3 className="text-2xl font-semibold mb-2">
            Drop your Spotify data files here
          </h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Upload your <span className="font-mono">StreamingHistory</span>,{' '}
            <span className="font-mono">Wrapped</span>, or{' '}
            <span className="font-mono">Userdata</span> JSON files from your Spotify data export
          </p>
          <div className="flex gap-4">
            <Button asChild variant="default" size="lg">
              <label className="cursor-pointer">
                <Upload className="mr-2 h-5 w-5" />
                Choose Files
                <input
                  type="file"
                  multiple
                  accept=".json"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {uploadedFiles.length > 0 && (
        <Card className="border-green-500/30">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-white">
              <FileJson className="w-5 h-5 text-green-400" />
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <FileJson className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{file.name}</p>
                      <p className="text-xs text-white/60 capitalize">
                        {file.type === 'unknown' ? '⚠️ Unknown file type' : file.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

