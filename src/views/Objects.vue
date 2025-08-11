<template>
  <div class="objects-container">
    <FilterComponent @filter-changed="handleFilter" />
    <div class="objects-grid">
      <ObjectCard
        class="object-card"
        v-for="story in filteredStories"
        :key="story.id"
        :image="story.content?.visuals?.[0] ? formatImage(story.content.visuals[0]) : ''"
        :objectName="story.content?.title_tag || ''"
        :price="story.content?.price_tag || ''"
        :slug="story.slug"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import ObjectCard from '../components/ObjectCard.vue';
import FilterComponent from '../components/FilterComponent.vue';
import { useStoryblokApi } from '@storyblok/vue';

export default {
  name: 'Objects',
  components: {
    ObjectCard,
    FilterComponent
  },
  setup() {
    let storyblokApi = null;
    const stories = ref([]);
    const currentFilter = ref('all');

    // Try to get Storyblok API only if it's available
    try {
      storyblokApi = useStoryblokApi();
    } catch (error) {
      console.warn('Storyblok API is not available:', error);
    }

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
      const formattedUrl = `${visual.filename}`;
      return formattedUrl;
    };
  


    onMounted(async () => {
      // Check if Storyblok is available
      if (!import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN || !storyblokApi) {
        console.warn('Storyblok is not available. Objects page will be empty.');
        return;
      }
      
      try {
        const response = await storyblokApi.get('cdn/stories', {
          starts_with: 'objects/',
          version: 'published'
        });
        
        // Добавим проверку перед присвоением
        if (response.data && response.data.stories) {
          stories.value = response.data.stories;
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    });  

    return {
      stories,
      filteredStories,
      formatImage,
      handleFilter
    };
  }
}
</script>

<style scoped>
.objects-container {
  width: 100%;
}

.objects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  width: 100%;
  padding: var(--space-lg);
}

.object-card {
  height: 50vh;
  width: 100%;
  overflow: hidden;
}

.object-card:hover {
  /* filter:grayscale(0%); */
  /* height: 50%; */
}

/* Responsive layout for mobile devices */
@media screen and (max-width: 768px) {
  .objects-grid {
    grid-template-columns: 1fr;
    padding: var(--space-sm);
  }
}
</style> 