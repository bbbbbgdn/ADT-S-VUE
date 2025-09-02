<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page Not Found</h2>
      <p class="error-description">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="action-buttons">
        <BaseButton to="/">Go Home</BaseButton>
        <BaseButton @click="goBack">Go Back</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-page {
  padding: 40px;
  text-align: center;
}

.action-buttons {
  display: inline-flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
