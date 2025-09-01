/**
 * Utility functions for extracting and working with image dimensions
 */

/**
 * Extracts width and height from a Storyblok image URL
 * @param {string} url - The Storyblok image URL
 * @returns {object|null} - Object with width and height properties, or null if not found
 */
export function extractImageDimensions(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Look for the dimensions pattern in the URL (e.g., /1365x2048/)
  const dimensionMatch = url.match(/\/(\d+)x(\d+)\//);

  if (!dimensionMatch) {
    return null;
  }

  const width = parseInt(dimensionMatch[1], 10);
  const height = parseInt(dimensionMatch[2], 10);

  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    return null;
  }

  return {
    width,
    height,
    aspectRatio: width / height
  };
}

/**
 * Calculates the optimal dimensions for an image based on container constraints
 * @param {object} imageDimensions - Object with width and height from extractImageDimensions
 * @param {number} containerHeight - The height of the container in pixels
 * @param {number} containerWidth - The width of the container in pixels (optional)
 * @returns {object} - Object with calculated width and height for the placeholder
 */
export function calculatePlaceholderDimensions(imageDimensions, containerHeight, containerWidth = null) {
  if (!imageDimensions) {
    return { width: 'auto', height: containerHeight };
  }

  const { width: originalWidth, height: originalHeight, aspectRatio } = imageDimensions;

  // If containerWidth is provided and we're using auto width, calculate based on aspect ratio
  if (containerWidth && containerWidth !== 'auto') {
    const containerWidthPx = typeof containerWidth === 'string' && containerWidth.endsWith('px')
      ? parseFloat(containerWidth)
      : containerWidth;

    return {
      width: containerWidthPx,
      height: containerWidthPx / aspectRatio
    };
  }

  // Otherwise, use the container height and maintain aspect ratio
  const containerHeightPx = typeof containerHeight === 'string' && containerHeight.endsWith('px')
    ? parseFloat(containerHeight)
    : containerHeight;

  return {
    width: containerHeightPx * aspectRatio,
    height: containerHeightPx
  };
}
