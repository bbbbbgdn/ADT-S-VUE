<template>
  <nav class="menu transition-exempt">
    <BaseButton 
      v-for="item in menuItems" 
      :key="item.path"
      :variant="isActive(item.path) ? 'active' : 'black'"
      :disabled="!item.path"
      :keepClickable="isActive(item.path) && item.path !== currentPath"
      @click="navigateTo(item.path)"
      class="menu-button"
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
      // Don't navigate if we're already on this page
      if (currentPath.value === path) return;
      
      // Store target path to prevent button flickering
      const targetPath = path;
      
      // Add transitioning class to body
      document.body.classList.add('page-transitioning');
      
      // Wait for the fade-out animation to complete before changing the page
      setTimeout(() => {
        router.push(targetPath);
      }, 600); // Slightly longer than the transition duration to ensure it completes
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
  z-index: 100;
  position: relative;
}

.components-button {
  position: absolute;
  right: 0;
  top: 0;
  margin: 3rem;
}

/* Menu button styles */
.menu-button {
  transition: background-color 0.5s ease, color 0.5s ease;
}

/* Ensure menu items are exempt from opacity transitions */
.transition-exempt {
  /* transition: none !important; */
}
</style>    