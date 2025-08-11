import { useStoryblokApi } from '@storyblok/vue';

/**
 * Simple, centralized Storyblok service
 * Handles all API calls with consistent error handling and version management
 */
class StoryblokService {
  constructor() {
    this.api = null;
    this.isAvailable = false;
    this.init();
  }

  init() {
    try {
      // Check if token exists
      if (!import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN) {
        console.warn('Storyblok token missing. Running in fallback mode.');
        return;
      }

      // Initialize API
      this.api = useStoryblokApi();
      this.isAvailable = true;
    } catch (error) {
      console.warn('Storyblok API not available:', error);
    }
  }

  /**
   * Check if we should use draft version
   */
  isDraftMode() {
    if (typeof window === 'undefined') return false;
    try {
      const params = new URLSearchParams(window.location.search);
      return params.has('_storyblok') || 
             params.get('version') === 'draft' || 
             params.get('preview') === 'true' ||
             import.meta.env.VITE_STORYBLOK_PREVIEW === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Build request parameters with correct version
   */
  getParams(customParams = {}) {
    const isDraft = this.isDraftMode();
    const baseParams = {
      version: isDraft ? 'draft' : 'published'
    };
    
    // Add cache buster for draft to avoid CDN caching
    if (isDraft) {
      baseParams.cv = Date.now();
    }

    return { ...baseParams, ...customParams };
  }

  /**
   * Fetch multiple stories
   */
  async getStories(startsWith, customParams = {}) {
    if (!this.isAvailable) {
      return { success: false, data: [], error: 'Storyblok not available' };
    }

    try {
      const params = this.getParams({
        starts_with: startsWith,
        ...customParams
      });

      const response = await this.api.get('cdn/stories', params);
      return { 
        success: true, 
        data: response?.data?.stories || [] 
      };
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      return { success: false, data: [], error };
    }
  }

  /**
   * Fetch single story
   */
  async getStory(path, customParams = {}) {
    if (!this.isAvailable) {
      return { success: false, data: null, error: 'Storyblok not available' };
    }

    try {
      const params = this.getParams(customParams);
      const response = await this.api.get(`cdn/stories/${path}`, params);
      return { 
        success: true, 
        data: response?.data?.story || null 
      };
    } catch (error) {
      console.error('Failed to fetch story:', error);
      return { success: false, data: null, error };
    }
  }
}

// Export singleton instance
export const storyblokService = new StoryblokService();

// Simple composable for views
export function useStoryblokService() {
  return {
    isAvailable: storyblokService.isAvailable,
    isDraftMode: () => storyblokService.isDraftMode(),
    
    // Simple methods that return { success, data, error }
    getStories: (startsWith, params) => storyblokService.getStories(startsWith, params),
    getStory: (path, params) => storyblokService.getStory(path, params)
  };
}
