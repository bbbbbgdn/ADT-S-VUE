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
      
      // Wait a moment then fade it in
      setTimeout(() => {
        el.style.opacity = '1';
        setTimeout(done, 500);
      }, 100);
    },
    afterEnter() {
      // Remove the transitioning class when the new page has entered
      // Add a small delay to prevent button flickering
      setTimeout(() => {
        document.body.classList.remove('page-transitioning');
      }, 50);
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