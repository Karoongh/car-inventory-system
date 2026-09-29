export type ImageSize = 'thumbnail' | 'medium' | 'large';

export interface ProcessedImage {
  size: ImageSize;
  width: number;
  height: number;
  format: 'webp';
  path: string;
  filename: string;
}

export interface ImageProcessorOptions {
  quality?: number; // default 80
  uploadDir?: string;
}

export interface IImageProcessor {
  process(fileBuffer: Buffer, originalFilename: string): Promise<ProcessedImage[]>;
}
