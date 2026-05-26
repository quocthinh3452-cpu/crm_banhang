export interface Document {
  id: number;
  name: string;
  filePath: string;
  type: string;
  version: string;
  releaseDate: string;
  expiryDate: string;
  uploadedBy: number;
  createdAt: string;
}

export interface DocumentRequest {
  name: string;
  type: string;
  version: string;
  releaseDate?: string;
  expiryDate?: string;
}
