<script>
export default {
  name: 'LoadingIndicator',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template>
  <transition name="fade">
    <div v-if="isLoading" class="loading-container">
      <p class="loading-text">Loading...</p>
    </div>
  </transition>
</template>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading styles */
.loading-container {
  position: fixed;
  top: var(--space-xl);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--space-xl));
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
  z-index: 9;
}

.loading-text {
  text-align: center;
}
</style> 