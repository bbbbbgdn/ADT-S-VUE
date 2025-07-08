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
      :preload="true"
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
import { useStoryblokApi } from '@storyblok/vue';
import { formatImage } from '../utils/storyblok';
import navigationManager from '../utils/navigationManager';

export default {
  name: 'Projects',
  components: {
    ProjectCard
  },
  setup() {
    const router = useRouter();
    let storyblokApi = null;
    const stories = ref([]);
    const isLoading = ref(true);
    const shouldAnimate = ref(!localStorage.getItem('hasSeenAnimation'));

    // Try to get Storyblok API only if it's available
    try {
      storyblokApi = useStoryblokApi();
    } catch (error) {
      console.warn('Storyblok API is not available:', error);
    }
    
    const navigateToProject = (slug) => {
      // Use navigation manager for consistent transitions
      navigationManager.navigateTo(router, `/projects/${slug}`);
    };

    onMounted(async () => {
      // Check if Storyblok is available
      if (!import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN || !storyblokApi) {
        console.warn('Storyblok is not available. Projects page will be empty.');
        isLoading.value = false;
        return;
      }
      
      try {
        const response = await storyblokApi.get('cdn/stories', {
          starts_with: 'projects/',
          version: 'published'
        });
        if (response?.data?.stories) {
          stories.value = response.data.stories;
        }
        isLoading.value = false;
      } catch (error) {
        console.error('Error fetching stories:', error);
        isLoading.value = false;
      }
    });

    return {
      stories,
      formatImage,
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

.project-card {
  /* transition: opacity 0.5s ease-out; */
}

/* Responsive layout for mobile devices */
@media screen and (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

</style> 