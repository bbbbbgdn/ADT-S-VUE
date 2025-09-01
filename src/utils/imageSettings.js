import { reactive } from 'vue';
import { getOptimalImageDimensions } from './storyblok';

/**
 * Default image settings for different contexts
 */
export const defaultSettings = {
  // High quality settings for main content and featured images
  high: {
    width: 0, // Auto width
    height: 1024, // Fixed height for high quality images
    quality: 85,
    format: 'webp',
    resolutionRatio: 2
  },
  
  // Lower quality settings for thumbnails and gallery previews
  thumbnail: {
    width: 0,
    height: 512,
    quality: 85, // Consistent quality for all images
    format: 'webp',
    resolutionRatio: 2
  },

  // Dynamic setting based on window width (1/2 of window width)
  windowBased: {
    width: () => typeof window !== 'undefined' ? Math.round(window.innerWidth) : 1920,
    height: 0, // Auto height to maintain aspect ratio
    quality: 85,
    format: 'webp',
    resolutionRatio: 1
  }
};

/**
 * Creates reactive image settings with the specified preset
 * @param {string} preset - Preset name ('high', 'thumbnail', or 'windowBased')
 * @param {Object} customSettings - Custom settings to override the preset
 * @returns {Object} - Reactive image settings object
 */
export const createImageSettings = (preset = 'thumbnail', customSettings = {}) => {
  const baseSettings = defaultSettings[preset] || defaultSettings.thumbnail;
  
  // Handle dynamic window-based width calculation
  const settings = { ...baseSettings };
  if (typeof settings.width === 'function') {
    settings.width = settings.width();
  }
  
  // If we're on mobile, maintain consistent quality
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    settings.quality = 85; // Consistent quality on all devices
  }
  
  // Merge settings without applying resolution ratio
  return reactive({
    ...settings,
    ...customSettings
  });
};

/**
 * Optimizes image settings based on the current device
 * @param {Object} settings - Base image settings
 * @returns {Object} - Optimized settings for the current device
 */
export const optimizeForDevice = (settings) => {
  // Get optimal dimensions based on device
  const optimized = getOptimalImageDimensions({
    width: settings.width,
    height: settings.height,
    quality: settings.quality,
    resolutionRatio: settings.resolutionRatio
  });
  
  // Apply optimized values while maintaining consistent quality
  return {
    ...settings,
    width: optimized.width,
    height: optimized.height,
    quality: 85 // Consistent quality across all optimizations
  };
};

/**
 * Converts rem-based height to pixels for API requests
 * @param {string|number} height - Height value (can be string with 'rem' or number)
 * @param {number} baseFontSize - Base font size in pixels (default: 16)
 * @returns {number} - Height in pixels
 */
export const remToPixels = (height, baseFontSize = 16) => {
  if (typeof height === 'string') {
    // Extract numeric value from string (e.g., '260rem' -> 260)
    const value = parseFloat(height);
    if (!isNaN(value)) {
      if (height.includes('rem')) {
        return value * baseFontSize;
      }
      if (height.includes('vh')) {
        // Approximate vh to pixels based on viewport height
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        return (value / 100) * viewportHeight;
      }
      if (height.includes('px')) {
        return value;
      }
      return value;
    }
  }
  return height || 0;
}; 