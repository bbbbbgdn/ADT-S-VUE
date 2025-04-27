<template>
  <div class="object-card">
    <img
      :src="image"
      alt="object image"
      class="object-bg"
      @load="onLoad"
    />
    <div class="object-tags">
      <BaseButton :to="`/objects/${slug}`">{{ objectName }}</BaseButton>
      <BaseButton variant="grey">{{ price }}</BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue';

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
      required: true
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
  /* border-radius: 12px; <-- видалено */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  z-index: 1;
  /* background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); */
}



</style>
