<template>
  <div class="projects-grid">
    <ProjectCard
      class="project-card"
      v-for="(story, index) in stories"
      :key="story.id"
      :image="formatImage(story)"
      :projectName="story.content?.title_tag"
      :year="story.content?.year_tag"
      :slug="story.slug"
      :preload="false"
      @click="navigateToProject(story.slug)"
      :style="{ 
        // transitionDelay: shouldAnimate ? `${index * 5}s` : '0s',
        // opacity: isLoading ? '0' : '1'
      }"
    />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProjectCard from '../components/ProjectCard.vue';
import { formatImage } from '../utils/storyblok';
import { createImageSettings } from '../utils/imageSettings';
import navigationManager from '../utils/navigationManager';
import { useStoryblokService } from '../services/storyblok';

export default {
  name: 'Projects',
  components: {
    ProjectCard
  },
  setup() {
    const router = useRouter();
    const stories = ref([]);
    const isLoading = ref(true);
    const shouldAnimate = ref(!localStorage.getItem('hasSeenAnimation'));

    // Create image settings for ProjectCard with high quality
    const projectCardImageSettings = createImageSettings('high');

    // Use centralized Storyblok service
    const { getStories } = useStoryblokService();
    
    const navigateToProject = (slug) => {
      // Use navigation manager for consistent transitions
      navigationManager.navigateTo(router, `/projects/${slug}`);
    };

    onMounted(async () => {
      const result = await getStories('projects/');
      
      if (result.success) {
        stories.value = result.data;
      } else {
        console.warn('Failed to load projects:', result.error);
      }
      
      isLoading.value = false;
    });

    // Custom formatImage function for ProjectCard with 2x resolution
    const formatProjectImage = (story) => {
      return formatImage(story, projectCardImageSettings);
    };

    return {
      stories,
      formatImage: formatProjectImage,
      navigateToProject,
      isLoading,
      shouldAnimate
    };
  }
}
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  min-height: 100%;
  padding: 0 var(--space-md) var(--space-md) var(--space-md);
}

/* Project card styles handled by component */

/* Responsive layout for mobile devices */
@media screen and (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

</style> 