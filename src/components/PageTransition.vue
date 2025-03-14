<template>
  <transition
    name="page-transition"
    mode="out-in"
    @enter="enter"
    @after-enter="afterEnter"
  >
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'PageTransition',
  methods: {
    enter(el, done) {
      // The element is initially hidden
      el.style.opacity = '0';
      
      // Check if this is the Profile component
      const isProfilePage = el.querySelector('.profile-container') !== null;
      
      // Wait a moment then fade it in
      setTimeout(() => {
        el.style.opacity = '1';
        
        // For Profile page, add a slightly longer delay to ensure content is visible
        const delay = isProfilePage ? 800 : 500;
        setTimeout(done, delay);
      }, 100);
    },
    afterEnter() {
      // Remove the transitioning class when the new page has entered
      // Make sure the delay is not too short - 300ms seems to work more reliably
      setTimeout(() => {
        if (document.body.classList.contains('page-transitioning')) {
          document.body.classList.remove('page-transitioning');
        }
        
        // Force any profile images to be visible
        const profileImages = document.querySelectorAll('.profile-image');
        if (profileImages.length > 0) {
          profileImages.forEach(img => {
            img.classList.add('image-loaded');
          });
        }
        
      }, 300);
    }
  },
  // Add beforeUnmount hook to ensure transition class is removed if component is unmounted
  beforeUnmount() {
    if (document.body.classList.contains('page-transitioning')) {
      document.body.classList.remove('page-transitioning');
    }
  }
}
</script>

<style>
/* The main transition for page content */
.page-transition-enter-active {
  transition: opacity 0.5s ease;
}

.page-transition-enter-from {
  opacity: 0;
}

/* When transitioning, fade out everything except the menu */
body.page-transitioning main {
  opacity: 0;
  transition: opacity 0.5s ease;
}

/* Ensure the menu stays visible during transitions */
body.page-transitioning .menu {
  opacity: 1 !important;
}
</style> 