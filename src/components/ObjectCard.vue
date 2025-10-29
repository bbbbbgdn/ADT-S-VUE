<template>
  <div
    class="object-card"
    role="link"
    tabindex="0"
    @click="onCardClick"
    @keydown.enter="onCardClick"
    @keydown.space.prevent="onCardClick"
  >
    <img
      v-lazy-load="{
        url: image,
        index: galleryIndex,
        galleryId: galleryId,
        threshold: 0.05,
        rootMargin: isBigGallery ? '200px' : '400px',
        preloadCount: isBigGallery ? 2 : 4,
        isBigGallery: isBigGallery,
        resetQueue: galleryIndex === 0
      }"
      :alt="`${objectName} image`"
      class="object-bg"
      @load="onImageLoad"
      @error="onImageError"
    />

    <div class="object-tags">
      <BaseButton :to="`/objects/${slug}`">{{ objectName }}</BaseButton>
      <BaseButton v-if="showPrice && price" variant="grey">{{ price }}</BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue';
import navigationManager from '../utils/navigationManager';

export default {
  name: 'ObjectCard',
  components: {
    BaseButton
  },
  props: {
    objectName: {
      type: String,
      default: 'Sample Object',
      required: true
    },
    price: {
      type: String,
      default: '',
      required: false
    },
    showPrice: {
      type: Boolean,
      default: true
    },
    image: {
      type: String,
      default: 'https://picsum.photos/800/600',
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    galleryIndex: {
      type: Number,
      default: 0
    },
    galleryId: {
      type: String,
      default: 'objects-gallery'
    },
    totalItems: {
      type: Number,
      default: 0
    },
    preloadCount: {
      type: Number,
      default: 3
    },
    isBigGallery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageLoaded: false,
      imageError: false
    }
  },
  methods: {
    onImageLoad() {
      this.imageLoaded = true;
      this.imageError = false;
      // You can add any additional logic after image loads
    },
    onImageError() {
      this.imageError = true;
      this.imageLoaded = false;
    },
    onCardClick() {
      const targetPath = `/objects/${this.slug}`;
      if (this.$router) {
        navigationManager.navigateTo(this.$router, targetPath);
      } else {
        window.location.href = targetPath;
      }
    }
  }
};
</script>

<style scoped>

img {
    background-color: transparent !important;
}

.object-card {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  overflow: hidden;
  /* border-radius: 12px; <-- видалено */
  /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); */
  cursor: pointer;
}

.object-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  transition: opacity 0.5s ease;
  border-radius: 0; /* чітко встановлено без округлення */
  object-fit: contain;
}

/* Loading state styles */
.object-bg.image-loading {
  opacity: 0;
  filter: blur(2px);
}

.object-bg.image-loaded {
  opacity: 1;
  filter: blur(0);
}

.object-bg.image-error {
  opacity: 0.5;
  filter: grayscale(100%);
}

.object-tags {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: var(--space-md);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.4s ease-in;
  /* background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); */
}

/* Show tags on hover for desktop */
@media screen and (min-width: 769px) {
  .object-card:hover .object-tags {
    opacity: 1;
  }
}

/* Always show tags on mobile */
@media screen and (max-width: 768px) {
  .object-tags {
    opacity: 1;
  }
}


/* Keep buttons black, no active state needed */



/* Ensure blur looks good even if underlying image has transparency.
   We render a blurred copy of the object image inside the grey button. */
.object-tags :deep(.button-grey) {
  background-color: rgb(207 207 207) !important;
  /* position: relative; */
  /* overflow: hidden; */
}



</style>
