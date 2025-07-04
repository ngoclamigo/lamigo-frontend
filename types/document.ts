export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
  url: string;
  bucket_path: string;
}

export interface FileObject {
  id?: string;
  name: string;
  created_at?: string;
  metadata?: {
    size?: number;
    mimetype?: string;
  };
}

export interface UploadResponse {
  message: string;
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    path: string;
    url: string;
  };
}

export interface ApiResponse<T = unknown> {
  documents?: Document[];
  error?: string;
  message?: string;
  data?: T;
}

export const ALLOWED_FILE_TYPES = {
  "text/markdown": ".md",
  "text/plain": ".txt",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
