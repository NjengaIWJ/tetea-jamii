export const MAX_IMAGE_DIMENSION = 1920;
export const IMAGE_QUALITY = 0.8;

export interface ImageDimensions {
  width: number;
  height: number;
}

export const calculateTargetDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxDimension: number
): ImageDimensions => {
  if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
    return { width: originalWidth, height: originalHeight };
  }

  if (originalWidth >= originalHeight) {
    const targetWidth = maxDimension;
    const targetHeight = Math.round((originalHeight / originalWidth) * maxDimension);
    return { width: targetWidth, height: targetHeight };
  } else {
    const targetHeight = maxDimension;
    const targetWidth = Math.round((originalWidth / originalHeight) * maxDimension);
    return { width: targetWidth, height: targetHeight };
  }
};

export const compressImage = async (
  file: File, 
  maxDimension: number = MAX_IMAGE_DIMENSION,
  quality: number = IMAGE_QUALITY
): Promise<File> => {
  if (!file.type.startsWith('image/') || typeof createImageBitmap !== 'function') {
    return file;
  }

  try {
    const imgBitmap = await createImageBitmap(file);
    const { width: targetWidth, height: targetHeight } = calculateTargetDimensions(
      imgBitmap.width,
      imgBitmap.height,
      maxDimension
    );

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), file.type, quality);
    });

    if (!blob) {
      throw new Error('Failed to create image blob');
    }

    return new File([blob], file.name, {
      type: blob.type,
      lastModified: Date.now(),
    });
  } catch (err) {
    console.warn('Image compression failed:', err);
    return file;
  }
};