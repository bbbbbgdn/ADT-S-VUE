<template>
  <div class="app">
    <MenuComponent />
    <main class="main-content">
      <PageTransition>
        <router-view></router-view>
      </PageTransition>
    </main>
  </div>
</template>

<script>
import MenuComponent from './components/MenuComponent.vue'
import PageTransition from './components/PageTransition.vue'
import { transitionCSS } from './utils/transitionConfig'

export default {
  name: 'App',
  components: {
    MenuComponent,
    PageTransition
  },
  data() {
    return {
      transitionCSS,
      preloadedImages: []
    }
  },
  mounted() {
    // Set CSS variables for transitions
    document.documentElement.style.setProperty('--transition-duration', transitionCSS.duration);
    document.documentElement.style.setProperty('--transition-easing', transitionCSS.easing);
    
    // Log the transition settings for debugging
    console.log('Transition settings applied:', {
      duration: transitionCSS.duration,
      easing: transitionCSS.easing
    });
    
    // Safety check: If page loads with transition class stuck, remove it
    if (document.body.classList.contains('page-transitioning')) {
      document.body.classList.remove('page-transitioning');
    }
    
    // Clean up any transition issues on before unload
    window.addEventListener('beforeunload', () => {
      if (document.body.classList.contains('page-transitioning')) {
        document.body.classList.remove('page-transitioning');
      }
    });

    // Preload critical images including profile image
    this.preloadCriticalImages();
  },
  methods: {
    preloadCriticalImages() {
      // List of critical images to preload
      const imagesToPreload = [
        '/main/assets/profile-image.webp'
      ];
      
      // Preload each image
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
        this.preloadedImages.push(img); // Keep reference to prevent garbage collection
      });
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 22rem;
}

:root {
  --color-pink-primary: #E788FF;
}

body {
  text-align: left;
  will-change: opacity; /* Hint to browser that opacity will animate */
  overflow-x: hidden; /* Prevent horizontal scroll during transitions */
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transform: translateZ(0); /* Force GPU acceleration */
  backface-visibility: hidden; /* Prevent flickering */
  perspective: 1000px; /* Enhance 3D context */
}

.main-content {
  transition: opacity var(--transition-duration, 500ms) var(--transition-easing, ease);
  min-height: 50vh;
  will-change: opacity; /* Hint to browser that opacity will animate */
}

/* Ensure transitions are smooth by forcing GPU rendering */
.page-transition-enter-active,
.page-transition-leave-active,
.image-loaded,
.image-visible {
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: opacity;
}

/* When transitioning, make sure everything is properly hidden */
body.page-transitioning .main-content {
  opacity: 0 !important; /* Force opacity with !important */
}

/* main { */
  /* margin-top: 2rem; */
/* } */
</style>

