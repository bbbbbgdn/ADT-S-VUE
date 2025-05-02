<script>
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import ImageGallery from '../components/ImageGallery.vue';
import ProjectCard from '../components/ProjectCard.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import MainText from '../components/MainText.vue';
import InfoText from '../components/InfoText.vue';
import useStoryblok from '../utils/useStoryblok';
import { computed } from 'vue';

export default {
  name: 'ProjectPage',
  components: {
    BaseButton,
    ImageGallery,
    ProjectCard,
    LoadingIndicator,
    MainText,
    InfoText
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const {
      story,
      stories,
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
      }
    });

    const randomProjects = computed(() => {
      if (!stories.value || stories.value.length === 0) return [];
      return stories.value
        .filter(p => p.slug !== story.value?.slug)
        .slice()
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    });

    const navigateToProject = (slug) => {
      navigateTo(slug);
    };

    return {
      story,
      stories,
      randomProjects,
      isLoading,
      contentReady,
      errorMessage,
      formatImage,
      formatImages,
      navigateToProject
    };
  }
};
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

        <div class="project-tags">
          <BaseButton 
            v-if="story.content?.title_tag?.trim()" 
            :to="`/projects/${story.slug.split('/').pop()}`" 
            variant="active">{{ story.content.title_tag }}</BaseButton>
          <BaseButton 
            v-if="story.content?.location_tag?.trim()" 
            variant="grey">{{ story.content.location_tag }}</BaseButton>
          <BaseButton 
            v-if="(story.content?.date_tag || story.content?.year_tag)?.trim()" 
            variant="grey">{{ story.content?.date_tag || story.content?.year_tag }}</BaseButton>
        </div>

        <MainText>
          {{ story.content?.main_text || 'No Description Available' }}
        </MainText>

        <ImageGallery 
          v-if="story.content?.visuals && story.content.visuals.length > 0"
          :slug="story.slug" 
          :images="formatImages(story.content.visuals, { width: 0, height: 690, quality: 85 })" 
          :repeatCount="1"
          :imageHeight="'690rem'"
          :imageQuality="85"
          :isActive="true"
        />

        <div v-else class="no-images-message">
          <p>No images available for this project</p>
        </div>

        <InfoText :text="story.content?.info_text || ''" />

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

.project-tags {
  display: flex;
  gap: 3rem;
  margin-left: 3rem;
  flex-wrap: wrap;
  align-items: center;
}

.button-container {
  margin: 5vh 0 0 3rem;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  padding: 3rem;
}

.error-message {
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.warning-message {
  text-align: center;
  padding: 1rem;
  margin: 1rem auto;
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
  padding: 2rem;
  margin: 2rem auto;
  background-color: #f8f8f8;
  border-radius: 8px;
}

@media screen and (max-width: 640px) {
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 3rem;
  }

  .project-card {
    min-height: 100% !important;
  }
}
</style>
