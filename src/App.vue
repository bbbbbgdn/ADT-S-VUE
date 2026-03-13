<template>
  <div class="app">
    <MenuComponent />
    <HomeBackground />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <PageTransition>
          <component :is="Component" />
        </PageTransition>
      </router-view>
    </main>
  </div>
</template>

<script>
import MenuComponent from './components/MenuComponent.vue'
import PageTransition from './components/PageTransition.vue'
import HomeBackground from './components/HomeBackground.vue'
import { transitionCSS } from './utils/transitionConfig'

export default {
  name: 'App',
  components: {
    MenuComponent,
    PageTransition,
    HomeBackground
  },
  data() {
    return {
      transitionCSS
    }
  },
  mounted() {
    document.documentElement.style.setProperty('--transition-duration', transitionCSS.duration)
    document.documentElement.style.setProperty('--transition-easing', transitionCSS.easing)

    document.documentElement.style.scrollBehavior = 'smooth'

    if (document.body.classList.contains('page-transitioning')) {
      document.body.classList.remove('page-transitioning')
    }

    window.addEventListener('beforeunload', () => {
      if (document.body.classList.contains('page-transitioning')) {
        document.body.classList.remove('page-transitioning')
      }
    })

    this.preloadCriticalImages()
  },
  methods: {
    preloadCriticalImages() {
      const imagesToPreload = ['/main/assets/profile-image.webp']

      imagesToPreload.forEach((src) => {
        const img = new Image()
        img.src = src
      })
    }
  }
}
</script>

<style>
html {
  scroll-behavior: smooth;
}

/* During transition, manage scroll position smoothly */
body.page-transitioning {
  scroll-behavior: smooth;
  overflow-anchor: none;
  overflow-x: hidden;
}

/* Create a class for the menu to ensure it stays fixed at the top during transitions */
nav.menu {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: transparent; /* Or whatever your background color is */
  /* Below ensures the menu stays visible during transitions */
  transition: transform 0.3s ease;
  transform: translateZ(0);
  will-change: transform;
}

/* Enhance the page transition with transform to create a subtle lift effect */
.main-content {
  transition: opacity var(--transition-duration, 500ms) var(--transition-easing, ease);
  will-change: opacity;
}

body.page-transitioning .main-content {
  opacity: 0 !important;
}

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
  min-height: 100svh;
}

/* Ensure transitions are smooth by forcing GPU rendering */
/* .page-transition-enter-active,
.page-transition-leave-active,
.image-loaded,
.image-visible {
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: opacity;
} */

/* main { */
  /* margin-top: 2rem; */
/* } */
</style>

