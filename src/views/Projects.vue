<template>
  <div class="projects-container">
    <!-- Preview mode indicator -->
    <div v-if="isPreview" class="preview-mode-indicator">
      <span>Preview Mode</span>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="loading">
      Loading projects...
    </div>
    
    <!-- Error message -->
    <div v-if="errorMessage && !isLoading" class="error-message">
      {{ errorMessage }}
    </div>
    
    <!-- Projects grid -->
    <div v-if="contentReady" class="projects-grid">
      <ProjectCard
        class="project-card"
        v-for="story in stories"
        :key="story.id"
        :image="formatImage(story, { width: 800, height: 600, quality: 85 })"
        :projectName="story.content.title_tag"
        :year="story.content.year_tag"
        :slug="story.slug"
        @click="navigateToProject(story.slug.split('/').pop())"
      />
    </div>
    
    <!-- No projects message -->
    <div v-if="contentReady && stories.length === 0" class="no-projects-message">
      No projects available
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProjectCard from '../components/ProjectCard.vue';
import useStoryblok from '../utils/useStoryblok';

export default {
  name: 'Projects',
  components: {
    ProjectCard
  },
  setup() {
    const router = useRouter();
    
    // Use our Storyblok composable for projects
    const {
      stories,
      isLoading,
      contentReady,
      errorMessage,
      formatImage,
      navigateTo,
      isPreview
    } = useStoryblok({
      type: 'project',
      preload: true,
      watchRoute: false
    });

    const navigateToProject = (slug) => {
      navigateTo(slug);
    };

    return {
      stories,
      formatImage,
      navigateToProject,
      isLoading,
      contentReady,
      errorMessage,
      isPreview
    };
  }
}
</script>

<style scoped>
.projects-container {
  position: relative;
  width: 100%;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* Creates 2 equal columns */
  width: 100%;
  min-height: 100%;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-style: italic;
}

.error-message {
  text-align: center;
  padding: 1rem;
  margin: 1rem auto;
  max-width: 800px;
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
  color: #856404;
}

.no-projects-message {
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  background-color: #f8f8f8;
  border-radius: 8px;
}

/* Preview mode indicator */
.preview-mode-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ff6b6b;
  color: white;
  text-align: center;
  padding: 0.5rem;
  font-weight: bold;
  z-index: 1000;
}

/* Responsive layout for mobile devices */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;  /* Single column on mobile */
  }
}
</style> 