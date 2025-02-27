<template>
<div 
  class="project-card" 
  v-lazy-load="image"
>
      <div class="project-tags">
        <BaseButton :to="`/projects/${slug}`">{{ projectName }}</BaseButton>
        <BaseButton variant="grey">{{ year }}</BaseButton>
      </div>
</div>
</template>

<script>
import BaseButton from './BaseButton.vue';
import lazyLoad from '../directives/lazyLoad';

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
      default: '2029',
      required: true
    },
    image: {
      type: String,
      default: 'https://picsum.photos/800/600',
      required: true
    },
    slug: {
      type: String,
      required: true
    }
  }
}
</script>
<style scoped>
.project-card {
  position: relative;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  min-height: 100px;
  height: 100%;
  cursor: pointer;
  transition: opacity 0.8s ease-out;
}

.project-card.image-loading {
  opacity: 0;
  background-color: #f0f0f0;
}

.project-card.image-loaded {
  opacity: 1;
}

.project-tags {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 3rem;
}

.project-tags:hover {
  color: #fff;
}
</style> 