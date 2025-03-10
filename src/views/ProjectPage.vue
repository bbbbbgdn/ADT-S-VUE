<script setup>
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import ImageGallery from '../components/ImageGallery.vue';
import ProjectCard from '../components/ProjectCard.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import useStoryblok from '../utils/useStoryblok';
import { watch } from 'vue';

// Use our Storyblok composable
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

// Handle navigation to another project
const navigateToProject = (slug) => {
  navigateTo(slug);
};

// Add this to your script section
watch(() => stories.value, (newStories) => {
  if (newStories && newStories.length > 0) {
    console.log('Projects loaded:', newStories.map(p => ({
      id: p.id,
      title: p.content?.title_tag,
      year_tag: p.content?.year_tag
    })));
    
    // Check for empty tags and log warnings
    newStories.forEach(project => {
      if (!project.content?.year_tag) {
        console.warn(`Empty year tag detected for project: ${project.id} - ${project.content?.title_tag || 'Untitled'}`);
      }
      if (!project.content?.title_tag) {
        console.warn(`Empty title tag detected for project: ${project.id}`);
      }
    });
  }
}, { immediate: true });
</script>

<template>
    <div class="project-page">
        <!-- Content area with loading state -->
        <div class="content-area">
            <LoadingIndicator :isLoading="isLoading" />
            
            <!-- Error message display for complete failure -->
            <div v-if="errorMessage && !story && !isLoading" class="error-message">
                <p>{{ errorMessage }}</p>
                <p>Redirecting to projects page...</p>
                <BaseButton to="/projects">Go to Projects</BaseButton>
            </div>
            
            <!-- Only show content when it's ready and not in loading state -->
            <div v-if="story && contentReady" class="content-container" :class="{ 'content-visible': !isLoading }">
                <!-- Show warning message if using fallback -->
                <div v-if="errorMessage" class="warning-message">
                    <p>{{ errorMessage }}</p>
                </div>
                
                <div class="description">
                    {{ story.content?.main_text || 'No Description Available' }}
                </div>
                
                <!-- Only show gallery if visuals exist -->
                <ImageGallery 
                    v-if="story.content?.visuals && story.content.visuals.length > 0"
                    :slug="story.slug" 
                    :images="formatImages(story.content.visuals, { width: 0, height: 690, quality: 85 })" 
                    :repeatCount="1"
                    :imageHeight="'690rem'"
                    :imageQuality="85"
                    :name="story.content?.title_tag || ''"
                    :location="story.content?.location_tag || ''"
                    :date="story.content?.date_tag || story.content?.year_tag || ''"
                />
                
                <!-- Fallback message if no visuals -->
                <div v-else class="no-images-message">
                    <p>No images available for this project</p>
                </div>
                
                <div class="credits-container">
                    <div class="credits">
                        {{ story.content?.info_text || '' }}
                    </div>
                </div>
                
                <div class="button-container">
                    <BaseButton to="/projects">Other projects</BaseButton>
                </div>
                
                <div v-if="stories && stories.length > 0" class="image-grid">
                    <ProjectCard
                        v-for="project in stories"
                        :key="project.id"
                        :image="formatImage(project, { width: 400, height: 300, quality: 85 })"
                        :projectName="project.content?.title_tag || 'Untitled Project'"
                        :year="project.content?.year_tag || ''"
                        :slug="project.slug"
                        :useImgTag="true"
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

/* Fade transition for content */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}
.fade-leave-from,
.fade-enter-to {
    opacity: 0;
}

/* Content area that contains both loading and content */
.content-area {
    position: relative;
    min-height: 80vh;
}

/* Loading styles */
.loading-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 100;
}

.loading-text {
    text-align: center;
}

h1 {
    font-size: 2rem;
    margin: 20px 0;
}

.description {
    width: 100%;
    padding: 20px;
    margin: 30px;
    box-sizing: border-box;
    overflow-y: auto;
    font-size: 30px;
}

.credits-container {
    display: flex;
    justify-content: left;
    width: 100%;
}

.credits {
    width: 80%;
    text-align: left;
    margin: 10vh 5vw;
}

p {
    font-size: 22rem;
    margin: 5px 0;
    text-align: justify;
}

.image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    /* margin: 20px 0; */
}

.image-container img {
    width: 200px;
    height: 600px;
    object-fit: cover;
    border-radius: 5px;
}

.button-container {
    margin: 25vh 0 1vh 0;
}

.small-gallery img {
    height: 22vh;
    overflow: hidden;
    /* margin: 10px; */
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
}

/* Content visibility transition */
.content-container {
    opacity: 0;
    transition: opacity 0.5s ease;
}

.content-visible {
    opacity: 1;
}

/* Remove duplicate styles that are already in ProjectCard component */

/* Error message styling */
.error-message {
    text-align: center;
    padding: 2rem;
    margin: 2rem auto;
    max-width: 600px;
    background-color: #f8f8f8;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message p {
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

/* Warning message styling */
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

/* No images message */
.no-images-message, .no-projects-message {
    text-align: center;
    padding: 2rem;
    margin: 2rem auto;
    background-color: #f8f8f8;
    border-radius: 8px;
}
</style>
