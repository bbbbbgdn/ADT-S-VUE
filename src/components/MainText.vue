<template>
  <div class="main-text" :class="{ 'single-line': isSingleLine }">
    <slot v-if="$slots.default"></slot>
    <p v-else-if="text && text.length > 0">{{ text }}</p>
    <p v-else class="empty-text">No content available</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  useSpan: {
    type: Boolean,
    default: false
  }
})

const isSingleLine = computed(() => {
  if (props.text) {
    // Check if text contains line breaks or is short enough to be single line
    return !props.text.includes('\n') && props.text.length < 50
  }
  return false
})
</script>

<style>
.main-text {
  width: 100%;
  /* padding: var(--space-md); */
  margin: 0;
  box-sizing: border-box;
  /* overflow-y: visible; */
  /* overflow-x: hidden; */
  font-weight: 670;
  font-size: var(--text-4xl);
  line-height: var(--text-4xl);
  text-indent: var(--space-3xl);
  margin-bottom: var(--space-2xl);
}

.main-text.single-line {
  text-indent: 0;
}

.main-text p {
  margin: 0;
  padding: 0;
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
  text-indent: inherit;
}

/* Example span styles that could be used within MainText */
.main-text span.highlight {
  color: #e63946;
  font-weight: 700;
}

.main-text span.italic {
  font-style: italic;
}

.main-text span.small {
  font-size: 0.8em;
}

.main-text .empty-text {
  color: #888;
  font-style: italic;
}

/* Responsive adjustments for mobile */
@media screen and (max-width: 768px) {
  .main-text {
  }
}
</style> 