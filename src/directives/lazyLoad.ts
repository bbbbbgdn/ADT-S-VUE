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

// Global loading queue to track image loading status
const loadingQueue = {
  currentIndex: 0,
  observers: new Set<Function>(),
  // Add a reset method to clear the queue when navigating
  reset: function() {
    this.currentIndex = 0
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
    
    // Add loading class
    el.classList.add('image-loading')
    // Set initial opacity
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.5s ease-in-out'
    
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
        el.classList.remove('image-loading')
        el.classList.add('image-loaded')
        // Trigger opacity transition
        requestAnimationFrame(() => {
          el.style.opacity = '1'
        })
        
        // Only increment queue for gallery images
        if (typeof options.index === 'number' && !options.rootMargin) {
          loadingQueue.currentIndex++
          loadingQueue.observers.forEach(callback => callback(loadingQueue.currentIndex))
        }
      }
      
      img.onerror = () => {
        console.error(`Failed to load image: ${options.url}`)
        
        el.classList.remove('image-loading')
        el.classList.add('image-loaded', 'image-error')
        
        // Only increment queue for gallery images
        if (typeof options.index === 'number' && !options.rootMargin) {
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
    
    // Use Intersection Observer for project cards (when rootMargin is specified)
    if (hasIntersectionObserver && options.rootMargin) {
      const observerOptions = {
        root: null,
        rootMargin: options.rootMargin,
        threshold: options.threshold || 0
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
    
    // Use queue-based approach only for gallery images
    if (typeof options.index === 'number') {
      const checkAndLoad = (currentIndex: number) => {
        if (options.index === currentIndex) {
          loadImage()
        }
      }
      
      loadingQueue.observers.add(checkAndLoad)
      checkAndLoad(loadingQueue.currentIndex)
    }
  },
  
  unmounted(el: HTMLElementWithCleanup) {
    // Clean up when directive is unmounted
    if (el._cleanup) {
      el._cleanup()
    }
  }
} 