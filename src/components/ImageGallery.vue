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
      <div class="gallery-tags">

          <ButtonBase to="/project">{{ name }}</ButtonBase>
          <ButtonBase
          variant="grey"
          >{{ location }}</ButtonBase>
          <ButtonBase
          variant="grey"
          >{{ date }}</ButtonBase>
      </div>
  </div>
</template>

<script>
import ButtonBase from './BaseButton.vue';

export default {
  name: 'ImageGallery',
  components: {
    ButtonBase
  },
  props: {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      name: 'Event Name',
      location: 'Event Location',
      date: '5.08.23-22.10.23',
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
    line-height: 0;
}

.gallery {
  display: flex;

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

.gallery-tags {
  display: flex;
  gap: 3rem;
  margin: 3rem;
}

.gallery-item img {
  /* width: 400px; */
  height: 400 px;
  object-fit: cover;
}

</style> 