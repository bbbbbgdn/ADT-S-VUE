<template>
  <div class="info-text-container" v-if="hasContent">
    <div class="info-text" v-if="$slots.default" :style="columnStyle">
      <slot></slot>
    </div>
    <div class="info-text" v-else-if="html" v-html="html" :style="columnStyle"></div>
    <div class="info-text" v-else-if="text" :style="columnStyle">{{ text }}</div>
  </div>
  <div class="info-text-container" v-else>
    <div class="info-text empty-text">No information available</div>
  </div>
</template>

<script>
export default {
  name: 'InfoText',
  props: {
    text: {
      type: String,
      default: ''
    },
    html: {
      type: String,
      default: ''
    },
    columnCount: {
      type: Number,
      default: 2
    }
  },
  computed: {
    columnStyle() {
      return {
        columnCount: this.columnCount
      };
    },
    hasContent() {
      return (this.text && this.text.trim().length > 0) || 
             (this.html && this.html.trim().length > 0) ||
             this.$slots.default;
    }
  }
};
</script>

<style>
.info-text-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.info-text {
  column-count: 2;
  column-gap: 20px;
  width: 100%;
  text-align: left;
  margin: 10vh 70rem;
}

.info-text p {
  /* margin: 5px 0; */
  /* text-align: justify; */
}

.info-text .empty-text {
  color: #888;
  font-style: italic;
  text-align: center;
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  .info-text {
    column-count: 1;
    width: 90%;
    margin: 5vh 5vw;
  }
}
</style> 