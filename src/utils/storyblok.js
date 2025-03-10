import { ref } from 'vue';
import { useStoryblokApi } from '@storyblok/vue';

// Create a singleton cache that persists across component instances
const projectCache = ref({});
const storyCache = ref({});

// Default configuration
const defaultConfig = {
  maxRetries: 3,
  retryDelay: 1000, // Base delay in ms (will be multiplied by retry count for exponential backoff)
  cacheEnabled: true
};

/**
 * Loads a story from Storyblok with retry logic and caching
 * @param {string} path - The path to the story (e.g., 'projects/my-project')
 * @param {Object} options - Options for the request
 * @param {number} options.maxRetries - Maximum number of retry attempts
 * @param {number} options.retryDelay - Base delay between retries in ms
 * @param {boolean} options.cacheEnabled - Whether to use cache
 * @param {Object} options.params - Additional parameters to pass to the Storyblok API
 * @returns {Promise<Object>} - The story data and status
 */
export const loadStory = async (path, options = {}) => {
  const config = { ...defaultConfig, ...options };
  const { maxRetries, retryDelay, cacheEnabled } = config;
  const params = options.params || { version: 'published' };
  
  const storyblokApi = useStoryblokApi();
  
  // Check cache first if enabled
  if (cacheEnabled && storyCache.value[path]) {
    console.log(`Loading story from cache: ${path}`);
    return {
      data: storyCache.value[path],
      status: 'success',
      fromCache: true
    };
  }
  
  // Try to load with retries
  let retryCount = 0;
  let error = null;
  
  while (retryCount < maxRetries) {
    try {
      const response = await storyblokApi.get(`cdn/stories/${path}`, params);
      
      // Cache the result if caching is enabled
      if (cacheEnabled) {
        storyCache.value[path] = response.data.story;
      }
      
      return {
        data: response.data.story,
        status: 'success',
        fromCache: false
      };
    } catch (err) {
      retryCount++;
      error = err;
      console.error(`Failed to load story (attempt ${retryCount}/${maxRetries}): ${path}`, err);
      
      if (retryCount < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
      }
    }
  }
  
  // All retries failed
  return {
    data: null,
    status: 'error',
    error,
    fromCache: false
  };
};

/**
 * Loads multiple stories from Storyblok with caching
 * @param {Object} options - Options for the request
 * @param {string} options.startsWith - Filter stories that start with this path
 * @param {Object} options.params - Additional parameters to pass to the Storyblok API
 * @returns {Promise<Object>} - The stories data and status
 */
export const loadStories = async (options = {}) => {
  const storyblokApi = useStoryblokApi();
  const params = {
    version: 'published',
    ...options.params
  };
  
  if (options.startsWith) {
    params.starts_with = options.startsWith;
  }
  
  try {
    const response = await storyblokApi.get('cdn/stories', params);
    
    // Cache individual stories
    if (defaultConfig.cacheEnabled) {
      response.data.stories.forEach(story => {
        const path = story.full_slug;
        storyCache.value[path] = story;
        
        // Also cache in the project cache if it's a project
        if (path.startsWith('projects/')) {
          const slug = path.split('/').pop();
          projectCache.value[slug] = story;
        }
      });
    }
    
    return {
      data: response.data.stories,
      status: 'success'
    };
  } catch (error) {
    console.error('Failed to load stories:', error);
    return {
      data: [],
      status: 'error',
      error
    };
  }
};

/**
 * Preloads all projects into cache
 * @returns {Promise<Object>} - Status of the preload operation
 */
export const preloadProjects = async () => {
  const result = await loadStories({
    startsWith: 'projects/'
  });
  
  if (result.status === 'success') {
    console.log('Preloaded projects to cache:', 
      result.data.map(project => project.slug.split('/').pop()));
  }
  
  return result;
};

/**
 * Formats images from Storyblok for display
 * @param {Array} visuals - Array of visual objects from Storyblok
 * @param {number} width - Desired width of images
 * @param {number} height - Desired height of images
 * @returns {Array} - Formatted image objects
 */
export const formatImages = (visuals, width = 800, height = 600) => {
  if (!visuals || !Array.isArray(visuals) || visuals.length === 0) {
    console.warn('No visuals found or invalid visuals format');
    return [];
  }
  return visuals.map(visual => ({
    url: `${visual.filename}/m/${width}x${height}`,
    alt: visual.alt || 'Image'
  }));
};

/**
 * Formats a single image from a project for display
 * @param {Object} project - Project object from Storyblok
 * @param {number} width - Desired width of image
 * @param {number} height - Desired height of image
 * @returns {string} - URL of the formatted image
 */
export const formatImage = (project, width = 800, height = 600) => {
  if (!project || !project.content) {
    console.warn('Invalid project or missing content');
    return `https://picsum.photos/${width}/${height}`;
  }
  
  if (project.content.visuals && Array.isArray(project.content.visuals) && project.content.visuals.length > 0) {
    return `${project.content.visuals[0].filename}/m/${width}x${height}`;
  }
  return `https://picsum.photos/${width}/${height}`;
};

/**
 * Clears the cache
 * @param {string} type - Type of cache to clear ('all', 'projects', 'stories')
 */
export const clearCache = (type = 'all') => {
  if (type === 'all' || type === 'projects') {
    projectCache.value = {};
  }
  
  if (type === 'all' || type === 'stories') {
    storyCache.value = {};
  }
  
  console.log(`Cache cleared: ${type}`);
};

/**
 * Gets a fallback project when the requested one is not available
 * @returns {Object|null} - A fallback project or null if none available
 */
export const getFallbackProject = () => {
  const projectSlugs = Object.keys(projectCache.value);
  if (projectSlugs.length > 0) {
    return {
      slug: projectSlugs[0],
      data: projectCache.value[projectSlugs[0]]
    };
  }
  return null;
};

// Export the cache for advanced usage
export const cache = {
  projects: projectCache,
  stories: storyCache
}; 