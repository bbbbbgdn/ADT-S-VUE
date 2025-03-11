<template>
  <div class="projects-grid">
    <ProjectCard
      class="project-card"
      v-for="(story, index) in stories"
      :key="story.id"
      :image="formatImage(story.content)"
      :projectName="story.content.title_tag"
      :year="story.content.year_tag"
      :slug="story.slug"
      @click="navigateToProject"
    />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProjectCard from '../components/ProjectCard.vue';
import { useStoryblokApi } from '@storyblok/vue';

export default {
  name: 'Projects',
  components: {
    ProjectCard
  },
  setup() {
    const router = useRouter();
    const storyblokApi = useStoryblokApi();
    const stories = ref([]);
    
    const formatImage = (content) => {
      if (content && content.visuals && content.visuals.length > 0) {
        return `${content.visuals[0].filename}/m/800x600`;
      }
      return '';
    };

    const navigateToProject = (slug) => {
      router.push(`/projects/${slug}`);
    };

    onMounted(async () => {
      try {
        const response = await storyblokApi.get('cdn/stories', {
          starts_with: 'projects/',
          version: 'published'
        });
        stories.value = response.data.stories;
        console.log('Projects loaded:', stories.value);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    });

    return {
      stories,
      formatImage,
      navigateToProject
    };
  }
}
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* Creates 2 equal columns */
  width: 100%;
  min-height: 100%;
  /* height: 100vh; */
  /* height: 100%; */
}


/* Responsive layout for mobile devices */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;  /* Single column on mobile */
  }
}
</style> 