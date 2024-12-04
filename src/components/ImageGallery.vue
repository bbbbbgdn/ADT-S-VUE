<template>
  <div class="gallery-container">
    <div class="gallery" ref="gallery">
      <div 
        v-for="(image, index) in images" 
        :key="index" 
        class="gallery-item"
      >
        <img :src="image.url" :alt="image.alt">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageGallery',
  data() {
    return {
      images: [
        { url: 'https://picsum.photos/400/300', alt: 'Gallery Image 1' },
        { url: 'https://picsum.photos/400/300', alt: 'Gallery Image 2' },
        { url: 'https://picsum.photos/400/300', alt: 'Gallery Image 3' },
        { url: 'https://picsum.photos/400/300', alt: 'Gallery Image 4' },
        { url: 'https://picsum.photos/400/300', alt: 'Gallery Image 5' },
        { url: 'https://picsum.photos/400/300', alt: 'Gallery Image 6' },
        { url: 'https://picsum.photos/400/300', alt: 'Gallery Image 7' }
      ]
    }
  }
}
</script>

<style scoped>
.gallery-container {
  width: 100%;
  overflow: hidden;
  /* padding: 1rem 0; */
}

.gallery {
  display: flex;
  /* gap: 0rem; */
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.gallery::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.gallery-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
}

.gallery-item img {
  /* width: 400px; */
  height: 400 px;
  object-fit: cover;
}

</style> 