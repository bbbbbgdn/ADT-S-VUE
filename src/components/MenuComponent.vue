<template>
  <nav
    class="menu transition-exempt"
    ref="menuElement"
    @scroll="handleMenuScroll"
    @touchstart="handleMenuTouchStart"
    @touchend="handleMenuTouchEnd"
  >
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

    // Scroll return properties (same as Press.vue)
    const menuScrollTimeout = ref(null)
    const isMenuScrolling = ref(false)
    
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
      { name: 'Objects', path: '/objects' },
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

    // Menu scroll methods (same as Press.vue)
    const handleMenuScroll = () => {
      console.log('Menu scroll event fired')

      isMenuScrolling.value = true

      // Clear existing timeout
      if (menuScrollTimeout.value) {
        clearTimeout(menuScrollTimeout.value)
      }

      // Set timeout to detect when scrolling stops (same as ImageGallery)
      menuScrollTimeout.value = setTimeout(() => {
        console.log('Menu scrolling stopped, triggering spring animation')
        isMenuScrolling.value = false
        animateMenuSpringReturn()
      }, 1000) // Same 1000ms delay as ImageGallery
    }

    const handleMenuTouchStart = () => {
      isMenuScrolling.value = true
    }

    const handleMenuTouchEnd = () => {
      // Use same timing as ImageGallery for consistency
      setTimeout(() => {
        isMenuScrolling.value = false
        animateMenuSpringReturn()
      }, 1000) // Same 1000ms delay as ImageGallery
    }

    const animateMenuSpringReturn = () => {
      console.log('animateMenuSpringReturn called')

      const menuEl = menuElement.value
      if (!menuEl) {
        console.log('No menu element found')
        return
      }

      const currentScrollLeft = menuEl.scrollLeft
      console.log('Current menu scroll position:', currentScrollLeft)

      if (currentScrollLeft === 0) {
        console.log('Menu already at position 0')
        return
      }

      // On mobile, don't animate - just reset immediately to avoid scroll interference
      if (isMobile.value) {
        console.log('Mobile: resetting menu scroll position immediately')
        menuEl.scrollLeft = 0
        return
      }

      // On desktop, use spring animation (same as Press.vue)
      console.log('Desktop: starting menu spring animation')
      startMenuSpringAnimation(currentScrollLeft, 0)
    }

    const startMenuSpringAnimation = (startPosition, targetPosition) => {
      const menuEl = menuElement.value
      if (!menuEl) return

      const startTime = performance.now()
      const duration = 600 // Same 600ms duration as ImageGallery
      const distance = targetPosition - startPosition

      // Cubic ease-out (same as ImageGallery)
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutCubic(progress)
        const currentPosition = startPosition + (distance * easedProgress)

        menuEl.scrollLeft = currentPosition

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }

    // Refs for scroll handling
    const menuElement = ref(null)

    return {
      menuItems,
      navigateTo,
      currentPath,
      isActive: (path) => navigationManager.isActive(route, path),
      getButtonVariant,
      getMenuText,
      // Menu scroll methods
      handleMenuScroll,
      handleMenuTouchStart,
      handleMenuTouchEnd,
      menuElement
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
  overflow-X: scroll; /* Same as ImageGallery */
  scroll-behavior: smooth; /* Same as ImageGallery */
  -webkit-overflow-scrolling: touch; /* Same as ImageGallery */
  overflow-y: hidden;
  white-space: nowrap;
  /* Hide scrollbars for all browsers (same as ImageGallery) */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  /* overflow: -moz-scrollbars-none; Firefox (older versions) */
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