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
    const clickedPath = ref(null) // Track which button was last clicked
    const isNavigating = ref(false) // Track if we're currently navigating
    
    // Watch for route changes
    watch(
      () => route.path,
      (newPath) => {
        currentPath.value = newPath
        // Mark navigation as complete
        isNavigating.value = false
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

    // Get button variant considering both the current route and the clicked button
    const getButtonVariant = (path) => {
      // If this is the button that was just clicked, make it active immediately
      if (clickedPath.value === path) {
        return 'active'
      }
      // Otherwise, use the normal active state logic
      return isActive(path) ? 'active' : 'black'
    }

    const navigateTo = (path, event) => {
      // Don't navigate if we're already on this page or already navigating
      if (currentPath.value === path || isNavigating.value) return;
      
      // Set this path as the clicked path immediately
      clickedPath.value = path;
      
      // Mark that we're navigating to prevent double clicks
      isNavigating.value = true;
      
      // Add transitioning class to body
      document.body.classList.add('page-transitioning');
      
      // Store the target path to ensure it's captured in closure
      const targetPath = path;
      
      // Wait for the fade-out animation to complete before changing the page
      setTimeout(() => {
        // Use push with catch to handle any navigation errors
        router.push(targetPath).catch(err => {
          console.error('Navigation error:', err);
          // Reset navigation state on error
          isNavigating.value = false;
          document.body.classList.remove('page-transitioning');
        });
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
      isActive,
      getButtonVariant
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