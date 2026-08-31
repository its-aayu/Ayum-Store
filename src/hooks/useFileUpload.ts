import { useCallback, useState } from 'react';
import type { CustomDesign, UploadState } from '@/types';
import { validateUploadFile } from '@/utils/fileValidation';
import { uploadCustomDesign } from '@/services/cloudinary/upload';
import { track } from '@/services/analytics/track';

export function useFileUpload() {
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [design, setDesign] = useState<CustomDesign | null>(null);
  const [localFile, setLocalFile] = useState<File | null>(null);

  const reset = useCallback(() => {
    setState('idle');
    setProgress(0);
    setError(null);
    setDesign(null);
    setLocalFile(null);
  }, []);

  const selectFile = useCallback(async (file: File) => {
    setLocalFile(file);
    setError(null);
    setState('validating');
    track({ name: 'custom_upload_started' });

    const validation = await validateUploadFile(file);
    if (!validation.valid) {
      setError(validation.error);
      setState('error');
      track({ name: 'custom_upload_failed', reason: validation.error });
      return;
    }

    setState('uploading');
    setProgress(0);
    try {
      const result = await uploadCustomDesign(file, (percent) => {
        setProgress(percent);
        if (percent >= 100) setState('processing');
      });
      setDesign(result);
      setState('success');
      track({ name: 'custom_upload_success', designId: result.id });
    } catch {
      setError('Upload failed. Please try again.');
      setState('error');
      track({ name: 'custom_upload_failed', reason: 'network_or_server_error' });
    }
  }, []);

  const retry = useCallback(() => {
    if (localFile) selectFile(localFile);
  }, [localFile, selectFile]);

  return { state, progress, error, design, selectFile, retry, reset, previewFile: localFile };
}
