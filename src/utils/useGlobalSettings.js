import { ref, onMounted } from 'vue';
import { loadStory } from './storyblok';

/**
 * Composable for fetching global settings from Storyblok
 * @returns {Object} Global settings data and utilities
 */
export default function useGlobalSettings() {
  // State
  const globalSettings = ref(null);
  const isLoading = ref(true);
  const error = ref(null);
  
  // Default values - these will be used as fallbacks
  const message404 = ref('This page not found or just not yet grown. <br/>Would you be up for growing something here instead?');
  const homepageTitle = ref('Atelier Dasha Tsapenko');
  const deliveryInfo = ref('For delivery information, please contact us.');
  
  /**
   * Load global settings from Storyblok
   */
  const loadGlobalSettings = async () => {
    try {
      // Check if we have Storyblok token
      if (!import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN) {
        console.warn('Storyblok token not available, using default values');
        isLoading.value = false;
        return;
      }
      
      const result = await loadStory('global-settings');
      
      if (result.status === 'success' && result.data) {
        globalSettings.value = result.data;
        
        // Extract specific values with fallbacks
        const content = result.data.content || {};
        
        if (content.message_404) {
          message404.value = content.message_404;
        }
        
        if (content.homepage_title) {
          homepageTitle.value = content.homepage_title;
        }
        
        if (content.delivery_info) {
          deliveryInfo.value = content.delivery_info;
        }
        
        console.log('Global settings loaded successfully:', content);
      } else {
        console.warn('Failed to load global settings:', result.error);
        error.value = result.error;
      }
    } catch (err) {
      console.error('Error loading global settings:', err);
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Load settings on mount
  onMounted(() => {
    loadGlobalSettings();
  });
  
  return {
    // State
    globalSettings,
    isLoading,
    error,
    
    // Specific settings
    message404,
    homepageTitle,
    deliveryInfo,
    
    // Methods
    loadGlobalSettings
  };
}
