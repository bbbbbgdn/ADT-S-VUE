<template>
  <div
    class="object-card"
    role="link"
    tabindex="0"
    @click="onCardClick"
    @keydown.enter="onCardClick"
    @keydown.space.prevent="onCardClick"
  >
    <AppearingImage
      :lazy-src="image"
      :alt="`${objectName} image`"
      @animation-complete="onImageLoad"
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
import AppearingImage from './AppearingImage.vue';
import navigationManager from '../utils/navigationManager';

export default {
  name: 'ObjectCard',
  components: {
    BaseButton,
    AppearingImage
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
.object-card {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  overflow: hidden;
  cursor: pointer;
}

/* AppearingImage container should fill the card */
.object-card .appearing-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Ensure images inside AppearingImage use contain fit */
.object-card .appearing-image-container .image {
  object-fit: contain;
  background-size: contain;
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

/* Ensure blur looks good even if underlying image has transparency */
.object-tags :deep(.button-grey) {
  background-color: rgb(207 207 207) !important;
}
</style>
