<script setup>
import { useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import LazyCarousel from '../components/LazyCarousel.vue';
import ProjectCard from '../components/ProjectCard.vue';
import MainText from '../components/MainText.vue';
import { renderRichText } from "@storyblok/vue";
import useStoryblok from '../utils/useStoryblok';
import { createImageSettings } from '../utils/imageSettings';
import { computed } from 'vue';

// Create image settings using our utility - high quality for main project
const mainProjectImageSettings = createImageSettings('high');

// Use our Storyblok composable with 'project' type
const router = useRouter();
const {
  story,
  stories: otherProjects,
  isLoading,
  contentReady,
  errorMessage,
  formatImage,
  formatImages,
  navigateTo
} = useStoryblok({
  type: 'project',
  preload: true,
  watchRoute: true,
  onError: (error, slug) => {
    console.error(`Custom error handler for project ${slug}:`, error);
    // Redirect to 404 page immediately if project not found
    router.replace({ name: 'NotFound' });
  }
});

const randomProjects = computed(() => {
  if (!otherProjects.value || otherProjects.value.length === 0) return [];
  return otherProjects.value
    .slice() // клон
    .sort(() => 0.5 - Math.random()) // перемішати
    .slice(0, 4); // взяти перші 4
});

const navigateToProject = (slug) => {
  navigateTo(slug);
};

// Format images with preset settings
const formatMainProjectImages = (visuals) => {
  return formatImages(visuals, mainProjectImageSettings);
};

// Computed properties for carousel
const carouselImages = computed(() => 
  story.value?.content?.visuals ? formatMainProjectImages(story.value.content.visuals) : []
);

// Computed properties for tags
const projectName = computed(() => story.value?.content?.title_tag || '');
const projectLocation = computed(() => story.value?.content?.location_tag || '');
const projectDate = computed(() => story.value?.content?.date_tag || story.value?.content?.year_tag || '');
const showTags = computed(() => 
  (projectName.value && projectName.value.trim().length > 0) ||
  (projectLocation.value && projectLocation.value.trim().length > 0) ||
  (projectDate.value && projectDate.value.trim().length > 0)
);


</script>

<template>
  <div class="project-page">
    <div class="content-area">
      <div v-if="errorMessage && !story && !isLoading" class="error-message">
        <p>{{ errorMessage }}</p>
        <p>Redirecting to projects page...</p>
        <BaseButton to="/projects">Go to Projects</BaseButton>
      </div>

      <div v-if="story && contentReady" class="content-container" :class="{ 'content-visible': !isLoading }">
        <div v-if="errorMessage" class="warning-message">
          <p>{{ errorMessage }}</p>
        </div>

        <!-- Main Project Carousel -->
        <div v-if="story.content?.visuals && story.content.visuals.length > 0" class="carousel-wrapper">
          <LazyCarousel
            :images="carouselImages"
            height="calc(100vh - 96rem)"
            :style="{ '--mobile-carousel-height': '70svh' }"
          />
          
          <!-- Project Tags -->
          <div v-if="showTags" class="project-tags">
            <BaseButton
              v-if="projectName && projectName.trim().length > 0"
              variant="black"
            >
              {{ projectName }}
            </BaseButton>
            <BaseButton v-if="projectLocation && projectLocation.trim().length > 0" variant="grey">
              {{ projectLocation }}
            </BaseButton>
            <BaseButton v-if="projectDate && projectDate.trim().length > 0" variant="grey">
              {{ projectDate }}
            </BaseButton>
          </div>
        </div>
        
        <!-- Fallback message if no visuals -->
        <div v-else class="no-images-message">
          <p>No images available for this project</p>
        </div>
        
        <!-- Using consolidated MainText component -->
        <MainText
          :infoText="renderRichText(story.content?.info_text || '')"
        >
          {{ story.content?.main_text || 'No Description Available' }}
        </MainText>

        <div id="extra-section">
          <div class="button-container">
            <BaseButton to="/projects">Other projects</BaseButton>
          </div>

          <div v-if="randomProjects.length > 0" class="image-grid">
            <ProjectCard
              v-for="project in randomProjects"
              :key="project.id"
              :image="formatImage(project)"
              :projectName="project.content?.title_tag || 'Untitled Project'"
              :year="project.content?.year_tag || ''"
              :slug="project.slug"
              :useImgTag="true"
              :preload="true"
              @click="navigateToProject(project.slug.split('/').pop())"
            />
          </div>

          <div v-else class="no-projects-message">
            <p>No other projects available</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.content-area {
  position: relative;
  min-height: 80vh;
}

.content-container {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.content-visible {
  opacity: 1;
}

.carousel-wrapper {
  width: 100%;
  position: relative;
}

.project-tags {
  display: flex;
  gap: var(--gallery-tags-gap, 1rem);
  padding: var(--gallery-tags-padding, 1rem 0);
  flex-wrap: wrap;
}

.button-container {
  margin: 5vh 0 0 var(--space-md);
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  padding: var(--space-md);
}

.error-message {
  text-align: center;
  padding: var(--space-sm);
  margin: var(--space-sm) auto;
  max-width: 600px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.warning-message {
  text-align: center;
  padding: var(--space-xs);
  margin: var(--space-xs) auto;
  max-width: 800px;
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
}

.warning-message p {
  font-size: 1rem;
  margin: 0;
  color: #856404;
}

.no-images-message, .no-projects-message {
  text-align: center;
  padding: var(--space-sm);
  margin: var(--space-sm) auto;
  background-color: #f8f8f8;
  border-radius: 8px;
}

@media screen and (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: var(--space-md);
  }

  .project-card {
    min-height: 100% !important;
  }

  /* Override main carousel height on mobile */
  .content-container .carousel-wrapper .carousel {
    min-height: var(--mobile-carousel-height, 70svh) !important;
    height: var(--mobile-carousel-height, 70svh) !important;
  }

  .content-container .carousel-wrapper .item {
    min-height: var(--mobile-carousel-height, 70svh) !important;
  }
}
</style>
