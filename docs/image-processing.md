# Image Processing Strategy

## Goals
- Fast page loads
- Consistent visual size across the site
- Modern format (WebP)
- No storage of heavy original files in production

## Pipeline (executed on every upload)

1. Receive original file (JPEG / PNG / WebP)
2. Validate MIME type and size limits
3. Generate three variants using `sharp`:
   - `thumbnail`: 400 × 300 (cover, quality 80)
   - `medium`: 800 × 600 (cover, quality 80)
   - `large`: 1200 × 900 (cover, quality 80)
4. Convert all to WebP
5. Store only the three WebP files with unique UUID-based names
6. Discard original temporary file

## Implementation Location

All logic lives in:
`packages/infrastructure/src/image-processor/`

- `image-processor.service.ts` – public API
- `image-processor.types.ts` – interfaces
- No other package may contain image resizing/conversion code.

## Configuration

Controlled via environment variables:
- `IMAGE_QUALITY` (default 80)
- `UPLOAD_DIR`

## Future

Ready to switch storage backend to S3-compatible without changing calling code (Repository / Storage abstraction).
