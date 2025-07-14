<template>
<div 
  class="project-card" 
  :class="{ 
    'use-img-tag': useImgTag,
    'card-loaded': isCardLoaded 
  }"
>
  <!-- Loading indicator -->
  <div v-if="!isCardLoaded" class="loading-indicator">
    <div class="loading-spinner"></div>
  </div>
  <!-- When using img tag approach -->
  <img 
    v-if="useImgTag"
    v-lazy-load="{ 
      url: image, 
      index: 0, 
      resetQueue: true, 
      preload: preload,
      rootMargin: '200px 0px',
      threshold: 0.1,
      galleryId: slug
    }"
    :data-index="0"
    :data-gallery-id="slug"
    class="project-card-image"
    alt="Project thumbnail"
    @click="navigateToProject"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @image-loaded="onImageLoad"
    @image-error="onImageError"
  />
  
  <!-- When using background image approach -->
  <div 
    v-else
    v-lazy-load="{ 
      url: image, 
      index: 0, 
      resetQueue: true, 
      preload: preload,
      rootMargin: '200px 0px',
      threshold: 0.1,
      galleryId: slug
    }"
    :data-index="0"
    :data-gallery-id="slug"
    class="project-card-background"
    @click="navigateToProject"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @image-loaded="onImageLoad"
    @image-error="onImageError"
  ></div>
  
  <!-- Tags are always shown -->
  <div class="project-tags">
    <BaseButton :to="`/projects/${slug}`" :class="{ 'button-hover': isHovering }">{{ projectName }}</BaseButton>
    <BaseButton v-if="year && year.trim().length > 0" variant="grey">{{ year }}</BaseButton>
  </div>
</div>
</template>

<script>
import BaseButton from './BaseButton.vue';
import lazyLoad from '../directives/lazyLoad';
import { useRouter } from 'vue-router';
import navigationManager from '../utils/navigationManager';
import { ref } from 'vue';

export default {
  name: 'ProjectCard',
  
  components: {
    BaseButton
  },

  directives: {
    lazyLoad
  },

  props: {
    projectName: {
      type: String,
      default: 'Sample Project',
      required: true
    },
    year: {
      type: String,
      default: '',
      required: false
    },
    image: {
      type: String,
      default: '',
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    useImgTag: {
      type: Boolean,
      default: true
    },
    preload: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const isHovering = ref(false);
    const isCardLoaded = ref(false);
    
    // Method to navigate with proper transition
    const navigateToProject = (event) => {
      // Only navigate if the click was directly on the card (not on a button)
      if (event.target.closest('.base-button') === null) {
        // Start navigation with transition
        navigationManager.navigateTo(router, `/projects/${props.slug}`);
        // Also emit click event for compatibility with existing code
        emit('click', props.slug);
      }
    };

    // Handle image load success
    const onImageLoad = () => {
      isCardLoaded.value = true;
    };

    // Handle image load error
    const onImageError = () => {
      // Still show the card even if image fails to load
      isCardLoaded.value = true;
    };
    
    return {
      navigateToProject,
      isHovering,
      isCardLoaded,
      onImageLoad,
      onImageError
    };
  },
  
  data() {
    return {
      isLoaded: false,
      hasError: false,
      backgroundImage: '',
      shouldAnimate: false
    };
  },
  
  computed: {
    cardStyle() {
      return {
        // backgroundColor: '#f0f0f0',
        backgroundImage: this.useImgTag ? 'none' : this.backgroundImage
      };
    }
  },
  
  methods: {
    setBackgroundImage(url) {
      this.backgroundImage = `url(${url})`;
      this.isLoaded = true;
    },
    
    setErrorState() {
      this.hasError = true;
    }
  },
  
  mounted() {
    // Component is ready
  }
}
</script>

<style scoped>
.project-card {
  position: relative;
  display: flex;
  align-items: flex-end;
  aspect-ratio: 16/10;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.05);
  opacity: 0;
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  max-width: calc(100svw - var(--space-md)*2);
}

.project-card.card-loaded {
  opacity: 1;

}

.project-card:hover .button-black {
    background-color: var(--color-pink-primary);
    color: black;
}

.project-card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  cursor: pointer;
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.2s ease-out;
}

.project-card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
  cursor: pointer;
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.2s ease-out;
}

/* Loading states */
.project-card-image.image-loading,
.project-card-background.image-loading {
  opacity: 0;
}

.project-card-image.image-loaded,
.project-card-background.image-loaded {
  opacity: 1;
}

.project-card-image.image-error,
.project-card-background.image-error {
  opacity: 0;
}

.project-tags {
  position: relative;
  pointer-events: none !important;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  margin: var(--space-md);
  z-index: 1;
  gap: var(--space-md);
}

/* Loading indicator */
.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid var(--color-pink-primary, #ff6b6b);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Style for the button hover effect */
.button-hover {
}

@media screen and (max-width: 768px) {
  .project-card {
    min-height: 30vh;
  }
}
</style> 

