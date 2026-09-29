import { IImageProcessor, ImageProcessorOptions, ProcessedImage, ImageSize } from './image-processor.types';

/**
 * Skeleton of the centralized image processor.
 * Full implementation (sharp + resize + WebP) will be completed in Task 4.
 * All image processing MUST go through this service – no duplication allowed.
 */
export class ImageProcessorService implements IImageProcessor {
  private readonly quality: number;
  private readonly uploadDir: string;

  private readonly sizes: Record<ImageSize, { width: number; height: number }> = {
    thumbnail: { width: 400, height: 300 },
    medium: { width: 800, height: 600 },
    large: { width: 1200, height: 900 },
  };

  constructor(options: ImageProcessorOptions = {}) {
    this.quality = options.quality ?? 80;
    this.uploadDir = options.uploadDir ?? './uploads';
  }

  async process(fileBuffer: Buffer, originalFilename: string): Promise<ProcessedImage[]> {
    // TODO (Task 4): implement with sharp
    // 1. Validate buffer
    // 2. Generate UUID-based filename
    // 3. For each size → resize + convert to WebP + save
    // 4. Return array of ProcessedImage
    throw new Error('ImageProcessorService.process() not implemented yet – will be completed in Task 4');
  }
}
