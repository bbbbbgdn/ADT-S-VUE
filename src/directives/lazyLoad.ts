import type { DirectiveBinding } from 'vue'

// Define interface for HTMLElement with cleanup function
interface HTMLElementWithCleanup extends HTMLElement {
  _cleanup?: () => void;
  _observer?: IntersectionObserver;
}

// Options for the lazy loading directive
interface LazyLoadOptions {
  url: string;
  index?: number;
  resetQueue?: boolean;
  threshold?: number; // Visibility threshold (0-1)
  rootMargin?: string; // Margin around the root
  background?: boolean; // Whether to set as background image
  preload?: boolean; // Whether to preload the image immediately
}

// Global loading queue to track image loading status (for sequential loading)
const loadingQueue = {
  currentIndex: 0,
  loadedImages: new Set<number>(),
  observers: new Set<Function>(),
  // Add a reset method to clear the queue when navigating
  reset: function() {
    this.currentIndex = 0
    this.loadedImages.clear()
    this.observers.clear()
  }
}

// Reset queue when the page loads/reloads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => loadingQueue.reset())
}

// Check if Intersection Observer is supported
const hasIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window

export default {
  beforeMount(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
    // Reset the queue if this is the first image in a new gallery
    // This ensures images load properly when navigating between pages
    if (binding.value && 
        typeof binding.value === 'object' && 
        binding.value.index === 0 && 
        binding.value.resetQueue) {
      loadingQueue.reset()
    }
  },
  
  mounted(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
    // Parse binding value
    let options: LazyLoadOptions;
    
    if (typeof binding.value === 'string') {
      // Legacy string format
      options = {
        url: binding.value,
        index: parseInt(el.dataset.index || '0'),
        resetQueue: el.dataset.index === '0'
      }
    } else {
      // Object format
      options = binding.value as LazyLoadOptions
    }
    
    // Add loading class and set initial state
    el.classList.add('image-loading')
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.3s ease-in-out'
    
    // Function to load the image
    function loadImage() {
      // Create new image object
      const img = new Image()
      img.src = options.url
      
      img.onload = () => {
        if (options.background || el.tagName !== 'IMG') {
          el.style.backgroundImage = `url(${options.url})`
        } else {
          const imageElement = el as HTMLImageElement
          imageElement.src = options.url
        }
        
        // Mark this image as loaded
        if (typeof options.index === 'number') {
          loadingQueue.loadedImages.add(options.index)
        }
        
        el.classList.remove('image-loading')
        el.classList.add('image-loaded')
        
        // Only show image if it's the next one in sequence
        if (typeof options.index === 'number') {
          // Check if this image should be visible (it's the next one to show)
          const loadedIndices = Array.from(loadingQueue.loadedImages).sort((a, b) => a - b);
          const nextToShow = loadedIndices.find(index => index >= options.index!);
          
          if (nextToShow === options.index) {
            requestAnimationFrame(() => {
              el.style.opacity = '1'
            })
          } else {
          }
        } else {
          // For non-queued images, show immediately
          requestAnimationFrame(() => {
            el.style.opacity = '1'
          })
        }
        
        // Only increment queue for gallery images (when index is provided)
        if (typeof options.index === 'number') {
          loadingQueue.currentIndex++
          loadingQueue.observers.forEach(callback => callback(loadingQueue.currentIndex))
        }
      }
      
      img.onerror = () => {
        console.error(`Failed to load image: ${options.url}`)
        
        el.classList.remove('image-loading')
        el.classList.add('image-loaded', 'image-error')
        
        // Mark as loaded even if it failed (to maintain sequence)
        if (typeof options.index === 'number') {
          loadingQueue.loadedImages.add(options.index)
        }
        
        // Only increment queue for gallery images (when index is provided)
        if (typeof options.index === 'number') {
          loadingQueue.currentIndex++
          loadingQueue.observers.forEach(callback => callback(loadingQueue.currentIndex))
        }
      }
    }
    
    // If preload is true, load immediately without intersection observer
    if (options.preload) {
      loadImage()
      return
    }
    
    // Use queue-based approach for gallery images (when index is provided)
    if (typeof options.index === 'number') {
      const checkAndLoad = (currentIndex: number) => {
        if (options.index === currentIndex) {
          loadImage()
        }
      }
      
      loadingQueue.observers.add(checkAndLoad)
      checkAndLoad(loadingQueue.currentIndex)
      return
    }
    
    // Use Intersection Observer for lazy loading (default behavior)
    if (hasIntersectionObserver) {
      const observerOptions = {
        root: null,
        rootMargin: options.rootMargin || '100px',
        threshold: options.threshold || 0.1
      }
      
      el._observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadImage()
          // Disconnect observer after loading
          if (el._observer) {
            el._observer.disconnect()
            el._observer = undefined
          }
        }
      }, observerOptions)
      
      // Start observing
      el._observer.observe(el)
      return
    }
    
    // Fallback: load immediately if Intersection Observer is not supported
    loadImage()
  },
  
  unmounted(el: HTMLElementWithCleanup) {
    // Clean up when directive is unmounted
    if (el._cleanup) {
      el._cleanup()
    }
    if (el._observer) {
      el._observer.disconnect()
    }
  }
} 