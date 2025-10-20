<template>
  <div class="show-card">
    <div v-if="!hasImages" class="gallery-placeholder" :style="{ height: imageHeight }"></div>
    <ImageGallery
      v-else
      :images="images"
      :name="name || ''"
      :location="location || ''"
      :date="resolvedDate"
      :slug="slug"
      :isOngoing="resolvedIsOngoing"
      :repeatCount="1"
      :imageHeight="imageHeight"
      :imageWidth="imageWidth"
      :imageQuality="imageQuality"
      :imageFormat="imageFormat"
      :resolutionRatio="resolutionRatio"
      :enableAutoScroll="enableAutoScroll"
      :speedRandomness="speedRandomness"
      :isActive="false"
      :style="{ '--mobile-gallery-height': mobileGalleryHeight }"
      @gallery-error="$emit('gallery-error')"
      @gallery-success="$emit('gallery-success')"
    />
  </div>
  
</template>

<script>
import ImageGallery from './ImageGallery.vue';

export default {
  name: 'ShowCard',
  components: { ImageGallery },
  props: {
    slug: { type: String, required: true },
    images: { type: Array, required: true },
    name: String,
    location: String,
    // If provided, these take precedence
    date: String,
    isOngoing: { type: Boolean, default: false },
    // Raw date props for internal computation (optional)
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
    dateTag: { type: String, default: '' },
    imageHeight: { type: String, default: '115rem' },
    imageWidth: { type: String, default: 'auto' },
    imageQuality: { type: Number, default: 85 },
    imageFormat: { type: String, default: null },
    resolutionRatio: { type: Number, default: 2 },
    enableAutoScroll: { type: Boolean, default: true },
    speedRandomness: { type: Number, default: 0.3 },
    mobileGalleryHeight: { type: String, default: '22svh' }
  },
  computed: {
    hasImages() {
      return Array.isArray(this.images) && this.images.length > 0;
    },
    resolvedDate() {
      if (this.date && this.date.trim().length > 0) return this.date;
      return this.formatDateRangeFromProps();
    },
    resolvedIsOngoing() {
      if (this.isOngoing) return true;
      return this.isShowOngoingFromProps();
    }
  },
  methods: {
    formatDateRangeFromProps() {
      const startDate = this.startDate;
      const endDate = this.endDate;
      if (!startDate || !endDate) {
        return this.dateTag || '';
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}.${month}.${year}`;
      };
      return `${formatDate(start)}-${formatDate(end)}`;
    },
    isShowOngoingFromProps() {
      const startDate = this.startDate;
      const endDate = this.endDate;
      if (!startDate || !endDate) return false;
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      return now >= start && now <= end;
    }
  }
};
</script>

<style scoped>
.show-card {
  width: 100%;
}

.gallery-placeholder {
  width: 100%;
  background-color: #f5f5f5;
}
</style>


