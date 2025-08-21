<template>
  <nav class="menu transition-exempt">
    <BaseButton 
      v-for="item in menuItems" 
      :key="item.path"
      :variant="getButtonVariant(item.path)"
      :disabled="!item.path"
      :keepClickable="isActive(item.path) && item.path !== currentPath"
      @click="navigateTo(item.path, $event)"
      class="menu-button"
    >
      {{ getMenuText(item) }}
    </BaseButton>
  </nav>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import BaseButton from './BaseButton.vue'
import navigationManager from '../utils/navigationManager'

export default {
  name: 'MenuComponent',
  components: {
    BaseButton
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const currentPath = ref(route.path)
    const isMobile = ref(false)
    
    // Check screen size on mount and resize
    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768
    }
    
    // Initialize screen size check
    checkScreenSize()
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize)
    
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
      // { name: 'Objects', path: '/objects' },
      { name: 'Shows', path: '/shows' },
      { name: 'Press', path: '/press' },
      { name: 'Profile', path: '/profile' },
    ]

    // Get button variant considering both the current route and the clicked button
    const getButtonVariant = (path) => {
      // Check if this is the current path (either from route or from currentPath ref)
      const isActive = path === currentPath.value || navigationManager.isActive(route, path);
      return isActive ? 'active' : 'black'
    }

    // Get menu text based on screen size
    const getMenuText = (item) => {
      if (item.path === '/' && isMobile.value) {
        return 'ADT'
      }
      return item.name
    }

    const navigateTo = (path, event) => {
      // Don't navigate if we're already on this page
      if (currentPath.value === path) return;
      
      // Immediately update current path to ensure active state is applied instantly
      currentPath.value = path;
      
      // Use navigation manager for consistent transitions
      navigationManager.navigateTo(router, path);
    }

    return {
      menuItems,
      navigateTo,
      currentPath,
      isActive: (path) => navigationManager.isActive(route, path),
      getButtonVariant,
      getMenuText
    }
  }
}
</script>

<style scoped>
.menu {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--space-md);
  z-index: 100;
  position: relative;
  padding: var(--space-md);
  padding-top: var(--space-md);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.menu::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.components-button {
  position: absolute;
  right: 0;
  top: 0;
  margin: var(--space-md);
}

/* Menu button styles - using CSS variables */
.menu-button {
  transition: background-color var(--transition-duration) var(--transition-easing), 
              color var(--transition-duration) var(--transition-easing);
}

/* Ensure active state is applied immediately during navigation */
.menu-button.button-active {
  transition: none !important;
}

/* During page transitions, ensure active buttons stay active */
body.page-transitioning .menu-button.button-active {
  background-color: var(--color-pink-primary) !important;
  color: black !important;
}

</style>    