import { IImageProcessor, ImageProcessorOptions, ProcessedImage, ImageSize } from './image-processor.types';
import { randomUUID } from 'crypto';
import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * Centralized Image Processor using sharp.
 * All car images MUST go through this service.
 * Converts to WebP, resizes to standard sizes, compresses.
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
    // Dynamic import to avoid issues if sharp is not installed in some environments
    const sharp = (await import('sharp')).default;

    await fs.mkdir(this.uploadDir, { recursive: true });

    const baseId = randomUUID();
    const results: ProcessedImage[] = [];

    for (const [sizeName, dimensions] of Object.entries(this.sizes) as [ImageSize, { width: number; height: number }][]) {
      const filename = `${baseId}-${sizeName}.webp`;
      const outputPath = path.join(this.uploadDir, filename);

      await sharp(fileBuffer)
        .rotate() // auto-orient based on EXIF
        .resize(dimensions.width, dimensions.height, {
          fit: 'cover',
          position: 'centre',
        })
        .webp({ quality: this.quality })
        .toFile(outputPath);

      results.push({
        size: sizeName,
        width: dimensions.width,
        height: dimensions.height,
        format: 'webp',
        path: outputPath,
        filename,
      });
    }

    return results;
  }
}
