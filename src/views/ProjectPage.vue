<script setup>
import { useRoute } from 'vue-router';
import { useStoryblokApi } from '@storyblok/vue';
import { ref, onMounted } from 'vue';
import BaseButton from '../components/BaseButton.vue';
import ImageGallery from '../components/ImageGallery.vue';
import { renderRichText } from "@storyblok/vue";
import ProjectCard from '../components/ProjectCard.vue';

const route = useRoute();
const story = ref(null);
const storyblokApi = useStoryblokApi();
const projects = ref([]);

onMounted(async () => {
    try {
        const response = await storyblokApi.get(`cdn/stories/projects/${route.params.slug}`, {
            version: 'draft'
        });
        story.value = response.data.story;
        console.log('Full Story:', story.value);
    } catch (error) {
        console.error('Failed to load story:', error);
    }

    try {
        const response = await storyblokApi.get('cdn/stories', {
            version: 'draft',
            starts_with: 'projects/'
        });
        projects.value = response.data.stories;
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
});

const temporaryImages = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4'
];

const formatTemporaryImages = temporaryImages.map(image => ({ url: image, alt: 'Image' }));

const formatImages = (visuals, width = 800, height = 600) => {
    return visuals.map(visual => ({
        url: `${visual.filename}/m/${width}x${height}`, // Додаємо зміну розміру
        alt: visual.alt || 'Image'
    }));
};

const getProjectImage = (project) => {
    return project.content.visuals?.[0]?.filename || 'https://picsum.photos/800/600';
};
</script>

<template>
    <div class="project-page">
        <div v-if="story">
            <div class="description">
                {{ story.content?.main_text || 'No Description Available' }}
            </div>
            <ImageGallery :slug="story.slug" :images="formatImages(story.content.visuals, 800, 600)" :repeatCount="1" />
            <div class="credits-container">
                <div class="credits">
                    {{ story.content.info_text }}
                </div>
            </div>
            <div class="button-container">
                <BaseButton to="/projects">Other projects</BaseButton>
            </div>
            <div class="image-grid">
                <div
                    class="project-card"
                    v-for="project in projects"
                    :key="project.id"
                    :style="{ backgroundImage: `url(${getProjectImage(project)})` }"
                >
                    <div class="project-tags">
                        <BaseButton :to="`/projects/${project.slug}`">{{ project.content.title_tag }}</BaseButton>
                        <BaseButton variant="grey">{{ project.content.year_tag }}</BaseButton>
                    </div>
                </div>
            </div>
        </div>
        <p v-else>Loading...</p>
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

.gallery-item img {
    height: 55vh;
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
}

.project-card {
  position: relative;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  height: 55vh;
  cursor: pointer;
  transition: opacity 0.8s ease-out;
}

.project-card.image-loading {
  opacity: 0;
  background-color: #f0f0f0;
}

.project-card.image-loaded {
  opacity: 1;
}

.project-tags {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 3rem;
}

.project-tags:hover {
  color: #fff;
}
</style>
