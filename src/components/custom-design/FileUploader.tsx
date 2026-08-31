import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { UploadState } from '@/types';

type FileUploaderProps = {
  state: UploadState;
  progress: number;
  error: string | null;
  onSelectFile: (file: File) => void;
  onRetry: () => void;
  previewUrl?: string;
};

const ACCEPT = 'image/png,image/jpeg,image/webp,application/pdf';

export function FileUploader({ state, progress, error, onSelectFile, onRetry, previewUrl }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const isBusy = state === 'validating' || state === 'uploading' || state === 'processing';

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onSelectFile(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !isBusy && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isBusy) inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        aria-label="Upload your design file"
        className={cn(
          'flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-feature border-2 border-dashed p-8 text-center transition-colors',
          dragActive ? 'border-brand-primary bg-brand-primary/5' : 'border-ink/20',
          isBusy && 'pointer-events-none opacity-70',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {state === 'success' && previewUrl ? (
          <div className="flex flex-col items-center gap-2">
            <img src={previewUrl} alt="Uploaded design preview" className="max-h-40 rounded-md object-contain" />
            <p className="flex items-center gap-1.5 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Upload complete
            </p>
          </div>
        ) : state === 'error' ? (
          <>
            <AlertCircle className="h-8 w-8 text-error" aria-hidden="true" />
            <p className="text-sm font-medium text-error">{error}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRetry();
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-ink underline"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Try again
            </button>
          </>
        ) : isBusy ? (
          <>
            <UploadCloud className="h-8 w-8 animate-pulse text-ink/50" aria-hidden="true" />
            <p className="text-sm font-medium text-ink">
              {state === 'validating' ? 'Checking your file…' : state === 'processing' ? 'Processing…' : 'Uploading…'}
            </p>
            {state === 'uploading' && (
              <div className="h-1.5 w-48 overflow-hidden rounded-pill bg-ink/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="h-full rounded-pill bg-brand-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <UploadCloud className="h-8 w-8 text-ink/40" aria-hidden="true" />
            <p className="text-sm font-medium text-ink">Drag and drop your design, or click to browse</p>
            <p className="text-xs text-muted">PNG, JPG, WEBP or PDF · up to 10 MB</p>
          </>
        )}
      </div>
    </div>
  );
}
