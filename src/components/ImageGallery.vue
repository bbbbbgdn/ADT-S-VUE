<template>
  <div class="gallery-container">
    <div class="gallery" ref="gallery">
      <div 
        v-for="(image, index) in repeatedImages" 
        :key="index" 
        class="gallery-item"
      >
        <img :src="image.url" :alt="image.alt">
      </div>
    </div>
    <div class="gallery-tags">
      <ButtonBase :to="`/shows/${slug}`">{{ name }}</ButtonBase>
      <ButtonBase variant="grey">{{ location }}</ButtonBase>
      <ButtonBase variant="grey">{{ date }}</ButtonBase>
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
    slug: {
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
    },
    images: {
      type: Array,
      required: true
    },
    repeatCount: {
      type: Number,
      required: true
    }
  },

  computed: {
  repeatedImages() {
    const repeated = [];
    for (let i = 0; i < this.repeatCount; i++) {
      repeated.push(...this.images);
    }
    return repeated;
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

.gallery-item:first-of-type {
  padding-left: 3rem;
}

.gallery-tags {
  display: flex;
  gap: 3rem;
  margin: 3rem;
}

.gallery-item img {
  width: auto;
  height: 400px;
  object-fit: cover;
}
</style> 