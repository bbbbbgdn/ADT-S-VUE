<template>
  <div class="objects-container">
    <FilterComponent @filter-changed="handleFilter" />
    

    <div class="objects-grid">
      <ObjectCard
        class="object-card"
        v-for="(story, index) in filteredStories"
        :key="story.id"
        v-bind="getObjectCardProps(story, index)"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import ObjectCard from '../components/ObjectCard.vue';
import FilterComponent from '../components/FilterComponent.vue';
import { createImageSettings } from '../utils/imageSettings';
import { createImageUrl } from '../utils/storyblok';
import { fetchAllObjects } from '../utils/storyblokPagination';

export default {
  name: 'Objects',
  components: {
    ObjectCard,
    FilterComponent
  },
  setup() {
    const stories = ref([]);
    const currentFilter = ref('all');
    const isLoading = ref(true);

    // Use smaller, good-quality settings for object thumbnails
    const objectCardImageSettings = createImageSettings('high');

    const filteredStories = computed(() => {
      switch (currentFilter.value) {
        case 'inStock':
          return stories.value.filter(story => story.content?.in_stock);
        case 'chronological':
          return [...stories.value].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
        case 'alphabetical':
          return [...stories.value].sort((a, b) => 
            (a.content?.title_tag || '').localeCompare(b.content?.title_tag || '')
          );
        default:
          return stories.value;
      }
    });

    const handleFilter = (filter) => {
      currentFilter.value = filter;
    };

    const formatImage = (visual) => {
      if (!visual || !visual.filename) {
        return '';
      }
      return createImageUrl(visual.filename, objectCardImageSettings);
    };

    const getObjectCardProps = (story, index) => {
      const baseProps = {
        objectName: story.content?.title_tag || '',
        price: story.content?.price_tag || '',
        showPrice: story.content?.display_price || false,
        slug: story.slug
      };

      // Only add image prop if the object has a valid image
      if (story.content?.visuals?.[0]?.filename) {
        baseProps.image = formatImage(story.content.visuals[0]);
      }
      // If no image, let ObjectCard use its default fallback

      return baseProps;
    };
  


    onMounted(async () => {
      // Check if Storyblok is available
      if (!import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN) {
        console.warn('Storyblok is not available. Objects page will be empty.');
        isLoading.value = false;
        return;
      }
      
      try {
        // Fetch all objects using pagination
        const allObjects = await fetchAllObjects();
        stories.value = allObjects;
        console.log(`✅ Loaded ${allObjects.length} objects in total`);
      } catch (error) {
        console.error('Error fetching all objects:', error);
      } finally {
        isLoading.value = false;
      }
    });  

    return {
      stories,
      filteredStories,
      formatImage,
      handleFilter,
      isLoading,
      getObjectCardProps
    };
  }
}
</script>

<style scoped>



.objects-container {
  width: 100%;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: var(--text-lg);
  color: var(--color-text-secondary, #666);
}

.objects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* gap: var(--space-lg); */
  width: 100%;
  /* padding: var(--space-lg); */
}

.object-card {
  height: 50vh;
  width: 100%;
  overflow: hidden;
}



/* Responsive layout for mobile devices */
@media screen and (max-width: 768px) {
  .objects-grid {
    grid-template-columns: 1fr;
    /* padding: var(--space-sm); */
  }
}
</style> 