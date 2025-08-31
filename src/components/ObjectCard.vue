<template>
  <div
    class="object-card"
    :style="{ '--object-image-url': `url(${image})` }"
    role="link"
    tabindex="0"
    @click="onCardClick"
    @keydown.enter="onCardClick"
    @keydown.space.prevent="onCardClick"
  >
    <img
      :src="image"
      alt="object image"
      class="object-bg"
      @load="onLoad"
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
    }
  },
  methods: {
    onLoad() {
      // Ти можеш додати будь-яку логіку, якщо потрібно після завантаження
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
  object-fit: contain;
  z-index: 0;
  transition: opacity 0.5s ease;
  border-radius: 0; /* чітко встановлено без округлення */
}

.object-tags {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: var(--space-sm);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  z-index: 1;
  /* background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); */
}


/* Mirror button hover state when card is hovered */
.object-card:hover .button-black {
  background-color: var(--color-pink-primary);
  color: black;
}



/* Ensure blur looks good even if underlying image has transparency.
   We render a blurred copy of the object image inside the grey button. */
.object-tags :deep(.button-grey) {
  position: relative;
  overflow: hidden;
}

.object-tags :deep(.button-grey)::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: var(--object-image-url);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  filter: blur(18px);
  /* Place above the button background but below text */
  z-index: 0;
}

.object-tags :deep(.button-text) {
  position: relative;
  z-index: 1;
}

</style>
