<script setup>
import { useRoute } from 'vue-router';
import { useStoryblokApi } from '@storyblok/vue';
import { ref, onMounted } from 'vue';
import BaseButton from '../components/BaseButton.vue';
import ImageGallery from '../components/ImageGallery.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import { renderRichText } from "@storyblok/vue";


const route = useRoute();
const story = ref(null);
const isLoading = ref(true);

const storyblokApi = useStoryblokApi();

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await storyblokApi.get(`cdn/stories/shows/${route.params.slug}`, {
      version: 'draft'
    });
    story.value = response.data.story; 
    console.log('Full Story:', story.value);
  } catch (error) {
    console.error('Failed to load story:', error);
  }
  
  // Add a small delay to ensure smooth transition
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
});

const formatImages = (visuals, width = 800, height = 600) => {
  return visuals.map(visual => ({
    url: `${visual.filename}/m/${width}x${height}`, // Додаємо зміну розміру
    alt: visual.alt || 'Image'
  }));
};
</script>

<template>
  <div class="show-page">
    <!-- Content area with loading state -->
    <div class="content-area">
      <LoadingIndicator :isLoading="isLoading" />
      
      <transition name="fade">
        <div v-if="story && !isLoading" class="content-container">
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
          <ImageGallery
            v-for="(gallery, index) in 3"
            :key="index"
            :name="story.name"
            :location="story.content.location_tag"
            :date="story.content.date_tag"
            :slug="story.slug"
            :images="formatImages(story.content.visuals)"
            :repeatCount="1"
            class="small-gallery"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<style>
/* .show-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
} */

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
  /* margin: 20px 0; */
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

.small-gallery img{
  height: 22vh; 
  overflow: hidden; 
  /* margin: 10px; */
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.content-area {
  position: relative;
  min-height: 400px;
}
</style>
