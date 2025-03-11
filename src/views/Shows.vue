<script setup>
import { useStoryblokApi } from '@storyblok/vue';
import { ref, onMounted, reactive } from 'vue';
import ImageGallery from '../components/ImageGallery.vue';
import { useRouter } from 'vue-router';

const storyblokApi = useStoryblokApi();
const stories = ref([]);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await storyblokApi.get('cdn/stories', {
      starts_with: 'shows/',
    });
    stories.value = response.data.stories; 
  } catch (error) {
    console.error('Error fetching stories:', error);
  }
});

const formatImages = (visuals, width = 800, height = 600) => {
  return visuals.map(visual => ({
    url: `${visual.filename}/m/${width}x${height}`, 
    alt: visual.alt || 'Image'
  }));
};


</script>

<template>
  <div class="shows">
    <div v-for="story in stories" :key="story.uuid">
      <ImageGallery 
        :images="formatImages(story.content.visuals, { width: 0, height: 230, quality: 70 })"
        :name="story.content?.title_tag"
        :location="story.content?.location_tag"
        :date="story.content?.date_tag"
        :slug="story.slug"
        :repeatCount="5"
        
      />

    </div>

  </div>
</template>

<style scoped>
.shows {
  /* padding: 20px; */
}
.gallery {
/* height: 500px; */
}
.gallery-item img {
  /* height: 500px; */
}
</style>
