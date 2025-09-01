<template>
  <div class="filter-container">
    <!-- <BaseButton 
      :class="{ 'active': activeFilter === 'all' }"
      @click="setFilter('all')"
    >
      Show all
    </BaseButton>
    
    <BaseButton 
      :class="{ 'active': activeFilter === 'inStock' }"
      @click="setFilter('inStock')"
    >
      Only in stock
    </BaseButton> -->
    
    <BaseButton 
      :class="{ 'active': activeFilter === 'chronological' }"
      @click="setFilter('chronological')"
    >
      Chronological
    </BaseButton>
    
    <BaseButton 
      :class="{ 'active': activeFilter === 'alphabetical' }"
      @click="setFilter('alphabetical')"
    >
      A-Z
    </BaseButton>
  </div>
</template>

<script>
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

export default {
  name: 'FilterComponent',
  components: {
    BaseButton
  },
  emits: ['filter-changed'],
  setup(props, { emit }) {
    const activeFilter = ref('all')

    const setFilter = (filter) => {
      activeFilter.value = filter
      emit('filter-changed', filter)
    }

    return {
      activeFilter,
      setFilter
    }
  }
}
</script>

<style scoped>
.filter-container {
  display: flex;
  gap: var(--space-md);
  padding: 0 0 0 var(--space-md);
  flex-wrap: wrap;
}

.active {
  background-color: var(--color-pink-primary) !important;
}


:deep(.base-button.active) {
  color: #000 !important;
  /* color: white; */
}

@media screen and (max-width: 768px) {
  .filter-container {
    /* padding: var(--space-m); */
    /* justify-content: center; */
  }
}
</style>
