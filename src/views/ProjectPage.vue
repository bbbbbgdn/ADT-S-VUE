<script setup>
import { useRoute } from 'vue-router';
import { useStoryblokApi } from '@storyblok/vue';
import { ref, onMounted } from 'vue';
import BaseButton from '../components/BaseButton.vue';
import ImageGallery from '../components/ImageGallery.vue';

const route = useRoute();
const story = ref(null);

const storyblokApi = useStoryblokApi();

onMounted(async () => {
  try {
    const response = await storyblokApi.get(`cdn/stories/shows/${route.params.slug}`, {
      version: 'draft'
    });
    story.value = response.data.story; 
    console.log('Full Story:', story.value);
  } catch (error) {
    console.error('Failed to load story:', error);
  }
});

const formatImages = (visuals, width = 800, height = 600) => {
  return visuals.map(visual => ({
    url: `${visual.filename}/m/${width}x${height}`, // Додаємо зміну розміру
    alt: visual.alt || 'Image'
  }));
};
</script>

<template>
  <div class="project-page">
    <div v-if="story">
      <ImageGallery
        :name="story.content.title_tag"
        :location="story.content.location_tag"
        :date="story.content.date_tag"
        :slug="story.slug"
        :images="formatImages(story.content.visuals, 800, 600)"
        :repeatCount="1"
      />
      <div class="description">
        {{ story.content?.main_text || 'No Description Available' }}
      </div>
      <div class="credits">
        {{ story.content?.info_text || 'No Description Available' }}
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
    <p v-else>Loading...</p>
  </div>
</template>

<style scoped>
/* .project-page {
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

.credits {
  column-count: 2;
  column-gap: 20px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

p {
  font-size: 1rem;
  margin: 5px 0;
  text-align: justify;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.image-container img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
}

.button-container {
  margin-top: 20px;
}

.small-gallery {
  height: 200px; /* Установите нужную высоту */
  overflow: hidden; 
  margin: 10px;/* Скрыть переполнение, если нужно */
}
</style>
