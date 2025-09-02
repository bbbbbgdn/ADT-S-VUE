import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as storyblokUtils from './storyblok';
import navigationManager from './navigationManager';
import { useStoryblokBridge } from '@storyblok/vue';
import { isDraftMode } from './storyblok';

// Check if Storyblok is available
const isStoryblokAvailable = () => {
  try {
    return !!import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN;
  } catch {
    return false;
  }
};

/**
 * Composable for working with Storyblok in Vue components
 * @param {Object} options - Configuration options
 * @param {string} options.type - Type of content to load ('project', 'show', etc.)
 * @param {boolean} options.preload - Whether to preload all items of this type
 * @param {boolean} options.watchRoute - Whether to watch route changes
 * @param {string} options.routeParam - Route parameter to watch (default: 'slug')
 * @param {Function} options.onError - Callback for error handling
 * @returns {Object} - Storyblok utilities and state
 */
export default function useStoryblok(options = {}) {
  const {
    type = 'project',
    preload = true,
    watchRoute = true,
    routeParam = 'slug',
    onError = null
  } = options;
  
  const route = useRoute();
  const router = useRouter();
  
  // State
  const story = ref(null);
  const stories = ref([]);
  const isLoading = ref(true);
  const contentReady = ref(false);
  const errorMessage = ref('');
  
  /**
   * Load a single story
   * @param {string} slug - Slug of the story to load
   */
  const loadStory = async (slug) => {
    isLoading.value = true;
    contentReady.value = false;
    errorMessage.value = '';
    
    // Check if Storyblok is available
    if (!isStoryblokAvailable()) {
      errorMessage.value = 'Content management system is not available.';
      isLoading.value = false;
      contentReady.value = true;
      return;
    }
    
    // Determine the path based on the type
    const path = `${type}s/${slug}`;
    
    // Load the story
    const result = await storyblokUtils.loadStory(path);
    
    if (result.status === 'success') {
      story.value = result.data;
    } else {
      errorMessage.value = `Could not load ${type} "${slug}"`;

      // If custom error handler is provided, use it instead of fallback
      if (onError) {
        // Call the error handler if provided
        onError(result.error, slug);
        // Stop further processing to avoid rendering blank interim state
        isLoading.value = false;
        contentReady.value = false;
        return;
      } else {
        // Try to get a fallback only if no custom error handler
        const fallback = storyblokUtils.getFallbackProject();
        if (fallback) {
          story.value = fallback.data;
          errorMessage.value = `${type} "${slug}" could not be loaded. Showing "${fallback.slug}" instead.`;

          // Redirect to the fallback after a delay
          setTimeout(() => {
            router.replace(`/${type}s/${fallback.slug}`);
          }, 5000);
        } else {
          // Default error handling - redirect to list page
          setTimeout(() => {
            navigationManager.navigateTo(router, `/${type}s`);
          }, 5000);
        }
      }
    }
    
    // Load other stories
    await loadOtherStories(slug);
    
    // Set content ready and hide loading
    contentReady.value = true;
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  };
  
  /**
   * Load other stories of the same type
   * @param {string} currentSlug - Current slug to exclude
   */
  const loadOtherStories = async (currentSlug) => {
    // Check if Storyblok is available
    if (!isStoryblokAvailable()) {
      stories.value = [];
      return;
    }
    
    const result = await storyblokUtils.loadStories({
      startsWith: `${type}s/`
    });
    
    if (result.status === 'success') {
      // Filter out the current story
      stories.value = result.data.filter(item => {
        const itemSlug = item.slug.split('/').pop();
        return itemSlug !== currentSlug;
      });
    }
  };
  
  /**
   * Navigate to another story
   * @param {string} slug - Slug to navigate to
   */
  const navigateTo = (slug) => {
    // Use navigation manager for consistent transitions
    navigationManager.navigateTo(router, `/${type}s/${slug}`);
  };
  
  // Initialize
  onMounted(async () => {
    // Check if Storyblok is available
    if (!isStoryblokAvailable()) {
      console.warn('Storyblok is not available. Running in fallback mode.');
      errorMessage.value = 'Content management system is not available. Please check your configuration.';
      isLoading.value = false;
      contentReady.value = true;
      return;
    }

    if (preload) {
      if (type === 'project') {
        await storyblokUtils.preloadProjects();
      } else {
        await storyblokUtils.loadStories({
          startsWith: `${type}s/`
        });
      }
    }
    
    if (route.params[routeParam]) {
      await loadStory(route.params[routeParam]);
    }

    // Enable live updates in the Visual Editor
    if (isDraftMode()) {
      watch(
        () => story.value && story.value.id,
        (id) => {
          if (id) {
            useStoryblokBridge(id, (newStory) => {
              story.value = newStory;
            });
          }
        },
        { immediate: true }
      );
    }
  });
  
  // Watch for route changes
  if (watchRoute) {
    watch(
      () => route.params[routeParam],
      (newSlug, oldSlug) => {
        if (newSlug && newSlug !== oldSlug) {
          loadStory(newSlug);
          // Scroll to top when navigating
          window.scrollTo(0, 0);
        }
      }
    );
  }
  
  return {
    // State
    story,
    stories,
    isLoading,
    contentReady,
    errorMessage,
    
    // Methods
    loadStory,
    loadOtherStories,
    navigateTo,
    
    // Utils
    formatImage: storyblokUtils.formatImage,
    formatImages: storyblokUtils.formatImages,
    clearCache: storyblokUtils.clearCache,
    
    // Advanced
    cache: storyblokUtils.cache
  };
} 