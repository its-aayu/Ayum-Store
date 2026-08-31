export type CustomDesignStatus = 'pending' | 'approved' | 'rejected';

export type CustomDesign = {
  id: string;
  publicId?: string;
  resourceType?: 'image' | 'raw';
  format?: string;
  width?: number;
  height?: number;
  previewUrl?: string;
  status: CustomDesignStatus;
  createdAt: string;
};

export type UploadState =
  | 'idle'
  | 'selecting'
  | 'validating'
  | 'uploading'
  | 'processing'
  | 'success'
  | 'error';
