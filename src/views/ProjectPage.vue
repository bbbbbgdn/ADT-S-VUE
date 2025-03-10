<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useStoryblokApi } from '@storyblok/vue';
import { ref, onMounted, watch } from 'vue';
import BaseButton from '../components/BaseButton.vue';
import ImageGallery from '../components/ImageGallery.vue';
import { renderRichText } from "@storyblok/vue";
import ProjectCard from '../components/ProjectCard.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';

const route = useRoute();
const router = useRouter();
const story = ref(null);
const storyblokApi = useStoryblokApi();
const projects = ref([]);
const isLoading = ref(true);
const contentReady = ref(false);

// Function to load project data
const loadProjectData = async (slug) => {
    isLoading.value = true;
    contentReady.value = false;
    
    try {
        const response = await storyblokApi.get(`cdn/stories/projects/${slug}`, {
            version: 'published'
        });
        story.value = response.data.story;
        console.log('Full Story:', story.value);
    } catch (error) {
        console.error('Failed to load story:', error);
    }

    try {
        const response = await storyblokApi.get('cdn/stories', {
            version: 'published',
            starts_with: 'projects/'
        });
        projects.value = response.data.stories.filter(project => project.slug !== slug);
        console.log('Other projects loaded:', projects.value);
    } catch (error) {
        console.error('Failed to load projects:', error);
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
    loadProjectData(route.params.slug);
});

// Watch for route changes to reload data when navigating between projects
watch(
    () => route.params.slug,
    (newSlug, oldSlug) => {
        if (newSlug !== oldSlug) {
            console.log(`Route changed from ${oldSlug} to ${newSlug}, reloading data`);
            loadProjectData(newSlug);
            // Scroll to top when navigating to a new project
            window.scrollTo(0, 0);
        }
    }
);

const temporaryImages = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4'
];

const formatTemporaryImages = temporaryImages.map(image => ({ url: image, alt: 'Image' }));

const formatImages = (visuals, width = 800, height = 600) => {
    if (!visuals || !Array.isArray(visuals)) return [];
    return visuals.map(visual => ({
        url: `${visual.filename}/m/${width}x${height}`,
        alt: visual.alt || 'Image'
    }));
};

const formatImage = (project) => {
    if (project.content && project.content.visuals && project.content.visuals.length > 0) {
        return `${project.content.visuals[0].filename}/m/800x600`;
    }
    return 'https://picsum.photos/800/600';
};

// Handle navigation to another project
const navigateToProject = (slug) => {
    router.push(`/projects/${slug}`);
};
</script>

<template>
    <div class="project-page">
        <!-- Content area with loading state -->
        <div class="content-area">
            <LoadingIndicator :isLoading="isLoading" />
            
            <!-- Only show content when it's ready and not in loading state -->
            <div v-if="story && contentReady" class="content-container" :class="{ 'content-visible': !isLoading }">
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
                    <ProjectCard
                        v-for="project in projects"
                        :key="project.id"
                        :image="formatImage(project)"
                        :projectName="project.content.title_tag"
                        :year="project.content.date_tag || project.content.year_tag"
                        :slug="project.slug"
                        @click="navigateToProject(project.slug)"
                    />
                </div>
            </div>
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
</style>
