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

// Per-gallery loading queues (only for actual galleries, not ProjectCard)
const galleryQueues: Record<string, { revealedIndex: number, loadedImages: Set<number> }> = {};

function getGalleryQueue(galleryId: string) {
  if (!galleryQueues[galleryId]) {
    galleryQueues[galleryId] = { revealedIndex: -1, loadedImages: new Set<number>() };
  }
  return galleryQueues[galleryId];
}

// Check if Intersection Observer is supported
const hasIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window

export default {
  beforeMount(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
    // Reset the queue if this is the first image in a new gallery (not ProjectCard)
    if (binding.value && 
        typeof binding.value === 'object' && 
        binding.value.index === 0 && 
        binding.value.resetQueue &&
        !el.classList.contains('project-card-image') &&
        !el.classList.contains('project-card-background')) {
      const galleryId = binding.value.galleryId || 'default';
      console.debug(`[LazyLoad] beforeMount: Reset queue for new gallery ${galleryId}`);
      galleryQueues[galleryId] = { revealedIndex: -1, loadedImages: new Set<number>() };
    }
  },
  
  mounted(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
    // Parse binding value
    let options: LazyLoadOptions & { galleryId?: string };
    if (typeof binding.value === 'string') {
      options = {
        url: binding.value,
        index: parseInt(el.dataset.index || '0'),
        resetQueue: el.dataset.index === '0',
        galleryId: el.dataset.galleryId || 'default'
      }
    } else {
      options = binding.value as LazyLoadOptions & { galleryId?: string };
    }
    
    // Check if this is a ProjectCard image
    const isProjectCard = el.classList.contains('project-card-image') || el.classList.contains('project-card-background');
    
    // Add loading class and set initial state
    el.classList.add('image-loading')
    el.classList.remove('image-loaded', 'image-error')
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.2s ease-out'
    
    // Function to reveal images from left to right (only for galleries)
    function revealImages() {
      const galleryId = options.galleryId || 'default';
      const queue = getGalleryQueue(galleryId);
      
      // Fallback for single-image galleries
      if (queue.loadedImages.has(0) && queue.revealedIndex < 0) {
        const imgEl = document.querySelector(`[data-gallery-id='${galleryId}'][data-index='0'].gallery-image`);
        if (imgEl) {
          imgEl.classList.remove('image-loading');
          imgEl.classList.add('image-loaded');
          requestAnimationFrame(() => {
            imgEl['style'].opacity = '1';
          });
        }
        queue.revealedIndex = 0;
        return;
      }
      
      let next = queue.revealedIndex + 1;
      while (queue.loadedImages.has(next)) {
        const imgEl = document.querySelector(`[data-gallery-id='${galleryId}'][data-index='${next}'].gallery-image`);
        if (imgEl) {
          imgEl.classList.remove('image-loading');
          imgEl.classList.add('image-loaded');
          requestAnimationFrame(() => {
            imgEl['style'].opacity = '1';
          });
        }
        queue.revealedIndex = next;
        next++;
      }
    }
    
    // Function to reveal ProjectCard image immediately
    function revealProjectCard() {
      el.classList.remove('image-loading');
      el.classList.add('image-loaded');
      requestAnimationFrame(() => {
        el.style.opacity = '1';
      });
    }
    
    // Function to load the image
    function loadImage() {
      const galleryId = options.galleryId || 'default';
      console.debug(`[LazyLoad] Start loading: galleryId=${galleryId}, index=${options.index}, url=${options.url}, isProjectCard=${isProjectCard}`);
      
      const img = new Image()
      img.src = options.url
      
      img.onload = () => {
        // console.debug(`[LazyLoad] Loaded: galleryId=${galleryId}, index=${options.index}, url=${options.url}, isProjectCard=${isProjectCard}`);
        
        if (options.background || el.tagName !== 'IMG') {
          el.style.backgroundImage = `url(${options.url})`
        } else {
          const imageElement = el as HTMLImageElement
          imageElement.src = options.url
        }
        
        // Handle ProjectCard images immediately
        if (isProjectCard) {
          revealProjectCard();
          return;
        }
        
        // Handle gallery images with queue system
        if (typeof options.index === 'number') {
          const queue = getGalleryQueue(galleryId);
          queue.loadedImages.add(options.index)
          revealImages();
        }
      }
      
      img.onerror = () => {
        console.error(`[LazyLoad] Failed to load: galleryId=${galleryId}, index=${options.index}, url=${options.url}, isProjectCard=${isProjectCard}`)
        el.classList.remove('image-loading')
        el.classList.add('image-loaded', 'image-error')
        
        // Handle ProjectCard images immediately even on error
        if (isProjectCard) {
          revealProjectCard();
          return;
        }
        
        // Handle gallery images with queue system
        if (typeof options.index === 'number') {
          const queue = getGalleryQueue(galleryId);
          queue.loadedImages.add(options.index)
          revealImages();
        }
      }
    }
    
    // If preload is true, load immediately without intersection observer
    if (options.preload) {
      console.debug(`[LazyLoad] Preload: galleryId=${options.galleryId || 'default'}, index=${options.index}, url=${options.url}, isProjectCard=${isProjectCard}`);
      loadImage()
      return
    }
    
    // For ProjectCard images, use simpler intersection observer logic
    if (isProjectCard) {
      console.debug(`[LazyLoad] ProjectCard: galleryId=${options.galleryId || 'default'}, index=${options.index}, url=${options.url}`);
      if (hasIntersectionObserver) {
        const observerOptions = {
          root: null,
          rootMargin: options.rootMargin || '1000px',
          threshold: options.threshold || 0.1
        }
        el._observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            console.debug(`[LazyLoad] ProjectCard IO load: url=${options.url}`);
            loadImage()
            // Disconnect observer after loading
            if (el._observer) {
              el._observer.disconnect()
              el._observer = undefined
            }
          }
        }, observerOptions)
        el._observer.observe(el)
        return
      } else {
        // Fallback: load immediately if Intersection Observer is not supported
        console.debug(`[LazyLoad] ProjectCard fallback load: url=${options.url}`);
        loadImage()
        return
      }
    }
    
    // For gallery images (when index is provided), use queue system
    if (typeof options.index === 'number') {
      const galleryId = options.galleryId || 'default';
      console.debug(`[LazyLoad] Gallery queued: galleryId=${galleryId}, index=${options.index}, url=${options.url}`);
      if (hasIntersectionObserver) {
        const observerOptions = {
          root: null,
          rootMargin: options.rootMargin || '700px',
          threshold: options.threshold || 0.1
        }
        el._observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            console.debug(`[LazyLoad] Gallery IO load: galleryId=${galleryId}, url=${options.url}`);
            loadImage()
            // Disconnect observer after loading
            if (el._observer) {
              el._observer.disconnect()
              el._observer = undefined
            }
          }
        }, observerOptions)
        el._observer.observe(el)
        return
      } else {
        // Fallback: load immediately if Intersection Observer is not supported
        console.debug(`[LazyLoad] Gallery fallback load: galleryId=${galleryId}, url=${options.url}`);
        loadImage()
        return
      }
    }
    
    // Use Intersection Observer for lazy loading (default behavior for other elements)
    if (hasIntersectionObserver) {
      const observerOptions = {
        root: null,
        rootMargin: options.rootMargin || '500px',
        threshold: options.threshold || 0.1
      }
      el._observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.debug(`[LazyLoad] Default IO load: url=${options.url}`);
          loadImage()
          // Disconnect observer after loading
          if (el._observer) {
            el._observer.disconnect()
            el._observer = undefined
          }
        }
      }, observerOptions)
      el._observer.observe(el)
      return
    }
    // Fallback: load immediately if Intersection Observer is not supported
    console.debug(`[LazyLoad] Default fallback load: url=${options.url}`);
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