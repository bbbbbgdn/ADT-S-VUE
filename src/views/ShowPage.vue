<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useStoryblokApi } from '@storyblok/vue';
import { ref, onMounted, watch } from 'vue';
import BaseButton from '../components/BaseButton.vue';
import ImageGallery from '../components/ImageGallery.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import { renderRichText } from "@storyblok/vue";
import ProjectCard from '../components/ProjectCard.vue';

const route = useRoute();
const router = useRouter();
const story = ref(null);
const isLoading = ref(true);
const contentReady = ref(false);
const otherShows = ref([]);

const storyblokApi = useStoryblokApi();

// Function to load show data
const loadShowData = async (slug) => {
  isLoading.value = true;
  contentReady.value = false;
  
  try {
    const response = await storyblokApi.get(`cdn/stories/shows/${slug}`, {
      version: 'published' // Changed from 'draft' to 'published'
    });
    story.value = response.data.story; 
    console.log('Full Story:', story.value);
  } catch (error) {
    console.error('Failed to load story:', error);
  }
  
  // Load other shows
  try {
    const response = await storyblokApi.get('cdn/stories', {
      version: 'published',
      starts_with: 'shows/'
    });
    // Filter out the current show
    otherShows.value = response.data.stories.filter(show => show.slug !== slug);
    console.log('Other shows loaded:', otherShows.value);
  } catch (error) {
    console.error('Failed to load other shows:', error);
  }
  
  // First set contentReady to true
  contentReady.value = true;
  
  // Then after a small delay, hide the loading indicator
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};

// Load data when component is mounted
onMounted(() => {
  loadShowData(route.params.slug);
});

// Watch for route changes to reload data when navigating between shows
watch(
  () => route.params.slug,
  (newSlug, oldSlug) => {
    if (newSlug !== oldSlug) {
      console.log(`Route changed from ${oldSlug} to ${newSlug}, reloading data`);
      loadShowData(newSlug);
      // Scroll to top when navigating to a new show
      window.scrollTo(0, 0);
    }
  }
);

const formatImages = (visuals, width = 800, height = 600) => {
  if (!visuals || !Array.isArray(visuals)) return [];
  return visuals.map(visual => ({
    url: `${visual.filename}/m/${width}x${height}`,
    alt: visual.alt || 'Image'
  }));
};

const formatImage = (show) => {
  if (show.content && show.content.visuals && show.content.visuals.length > 0) {
    return `${show.content.visuals[0].filename}/m/800x600`;
  }
  return 'https://picsum.photos/800/600';
};

// Handle navigation to another show
const navigateToShow = (slug) => {
  router.push(`/shows/${slug}`);
};
</script>

<template>
  <div class="show-page">
    <!-- Content area with loading state -->
    <div class="content-area">
      <LoadingIndicator :isLoading="isLoading" />
      
      <div v-if="story && contentReady" class="content-container" :class="{ 'content-visible': !isLoading }">
        <ImageGallery
          :name="story.content.title_tag"
          :location="story.content.location_tag"
          :date="story.content.date_tag"
          :slug="story.slug"
          :images="formatImages(story.content.visuals, 800, 600)"
          :repeatCount="1"
        />
        <div class="description" >
          {{ story.content?.main_text || 'No Description Available' }}
        </div>
        <div class="credits-container">
          <div class="credits" v-html="renderRichText(story.content.info_text)">
          </div>
        </div>
        <div class="button-container">
          <BaseButton to="/shows">Other Shows</BaseButton>
        </div>
        
        <div class="image-grid">
          <ProjectCard
            v-for="show in otherShows"
            :key="show.id"
            :image="formatImage(show)"
            :projectName="show.content.title_tag"
            :year="show.content.date_tag"
            :slug="show.slug"
            @click="navigateToShow(show.slug)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Content area that contains both loading and content */
.content-area {
  position: relative;
  min-height: 80vh;
}

/* Content visibility transition */
.content-container {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.content-visible {
  opacity: 1;
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
  justify-content: center;
  width: 100%;
}

.credits {
  column-count: 2;
  column-gap: 20px;
  width: 80%;
  text-align: left;
  margin: 0 10px;
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
}

.image-container img {
  width: 200px;
  height: 600px;
  object-fit: cover;
  border-radius: 5px;
}

.gallery-item img{
  height: 55vh;
}

.button-container {
  margin: 2rem;
}

.other-shows-title {
  margin: 4rem 0 2rem 0;
  text-align: center;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
}
</style>
