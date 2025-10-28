<template>
<div 
  class="project-card" 
  @click="navigateToProject"
  @mouseenter="isHovering = true"
  @mouseleave="isHovering = false"
>
  <!-- AppearingImage with lazy loading -->
  <AppearingImage
    v-if="preload"
    :src="image"
    :alt="`${projectName} thumbnail`"
  />
  <AppearingImage
    v-else
    :lazy-src="image"
    :alt="`${projectName} thumbnail`"
  />
  
  <!-- Tags are always shown -->
  <div class="project-tags">
    <BaseButton :to="`/projects/${slug}`" :class="{ 'button-hover': isHovering }">{{ projectName }}</BaseButton>
    <BaseButton v-if="year && year.trim().length > 0" variant="grey">{{ year }}</BaseButton>
  </div>
</div>
</template>

<script>
import BaseButton from './BaseButton.vue';
import AppearingImage from './AppearingImage.vue';
import { useRouter } from 'vue-router';
import navigationManager from '../utils/navigationManager';
import { ref } from 'vue';

export default {
  name: 'ProjectCard',
  
  components: {
    BaseButton,
    AppearingImage
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
    preload: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const isHovering = ref(false);
    
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
    
    return {
      navigateToProject,
      isHovering
    };
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
  max-width: calc(100svw - var(--space-md)*2);
  cursor: pointer;
}

.project-card:hover .button-black {
  background-color: var(--color-pink-primary);
  color: black;
}

/* AppearingImage container should fill the card */
.project-card .appearing-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
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

@media screen and (max-width: 768px) {
  .project-card {
    min-height: 30vh;
  }
}
</style> 

