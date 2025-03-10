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
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading styles */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 100;
}

.loading-text {
  text-align: center;
}
</style> 