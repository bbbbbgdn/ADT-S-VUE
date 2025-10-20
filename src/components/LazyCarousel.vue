<template>
    <div class="carousel">
      <div
        v-for="(img, i) in images"
        :key="i"
        class="item"
        :style="{ aspectRatio: getAspectFromUrl(img) }"
      >
        <!-- Appear animation image with lazy loading -->
        <AppearingImage
          :lazy-src="img"
          :alt="`carousel image ${i}`"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import AppearingImage from './AppearingImage.vue'
  
  // your image list
  const images = [
    "https://a.storyblok.com/f/319504/1280x1024/cef0e21159/img_3510.jpeg",
    "https://a.storyblok.com/f/319504/800x1074/e9c7b7ca38/img_3504.jpeg",
    "https://a.storyblok.com/f/319504/800x1074/62c88a8a6c/img_3502.jpeg",
    "https://a.storyblok.com/f/319504/800x1074/f6286f193b/img_3499.jpeg",
    "https://a.storyblok.com/f/319504/800x1074/fc6798a9fb/img_3501.jpeg",
    "https://a.storyblok.com/f/319504/800x1074/f7c6ceff55/img_3497.jpeg",
    "https://a.storyblok.com/f/319504/800x1074/853a749832/img_3503.jpeg",
    "https://a.storyblok.com/f/319504/800x1074/cad5d76b57/img_3498.jpeg",
    "https://a.storyblok.com/f/319504/800x1074/5652d198c8/img_3500.jpeg"
  ]
  
  // extract width/height ratio from Storyblok URLs
  const getAspectFromUrl = (url) => {
    const match = url.match(/\/(\d+)x(\d+)\//)
    if (!match) return '4 / 5'
    const [, w, h] = match
    return `${w} / ${h}`
  }
  </script>
  
  <style scoped>
  .carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    height: 80vh;
    gap: 0px;
    padding: 0 10px;
  }
  
  .item {
    flex: 0 0 auto;
    scroll-snap-align: center;
    height: 100%;
    position: relative;
    background: #ffffff; /* placeholder while waiting */
    border-radius: 1rem;
    overflow: hidden;
  }
  
  .appearing-image-container {
    width: 100%;
    height: 100%;
    display: block;
  }
  </style>