<template>
  <nav class="menu">
    <BaseButton 
      v-for="item in menuItems" 
      :key="item.path"
      :variant="isActive(item.path) ? 'active' : 'black'"
      :disabled="!item.path"
      :keepClickable="isActive(item.path) && item.path !== currentPath"
      @click="navigateTo(item.path)"
    >
      {{ item.name }}
    </BaseButton>
  </nav>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import BaseButton from './BaseButton.vue'

export default {
  name: 'MenuComponent',
  components: {
    BaseButton
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const currentPath = ref(route.path)
    
    // Watch for route changes
    watch(
      () => route.path,
      (newPath) => {
        currentPath.value = newPath
      }
    )
    
    const menuItems = [
      { name: 'Atelier Dasha Tsapenko', path: '/' },
      { name: 'Projects', path: '/projects' },
      // { name: 'Objects', path: '' },
      { name: 'Shows', path: '/shows' },
      // { name: 'Press', path: '' },
      { name: 'Profile', path: '/profile' },
    ]

    const navigateTo = (path) => {
      router.push(path)
    }

    // Check if a menu item should be active
    const isActive = (path) => {
      if (!path) return false;
      
      // Exact match for home page
      if (path === '/' && currentPath.value === '/') {
        return true;
      }
      
      // For other pages, check if the current path starts with the menu item path
      // This ensures that /shows/some-show will keep the Shows menu item active
      return path !== '/' && currentPath.value.startsWith(path);
    }

    return {
      menuItems,
      navigateTo,
      currentPath,
      isActive
    }
  }
}
</script>

<style scoped>
.menu {
  padding: 3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

.components-button {
  position: absolute;
  right: 0;
  top: 0;
  margin: 3rem;
}
</style>    