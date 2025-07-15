<template>
  <div class="main-text" :class="{ 'single-line': isSingleLine }">
    <template v-if="$slots.default">
      <p v-for="(line, index) in slotTextLines" :key="index" :class="{ 'empty-line': line === '' }">
        {{ line }}
      </p>
    </template>
    <template v-else-if="text && text.length > 0">
      <p v-for="(line, index) in textLines" :key="index" :class="{ 'empty-line': line === '' }">
        {{ line }}
      </p>
    </template>
    <p v-else class="empty-text">No content available</p>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

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

const slots = useSlots()

const processText = (text) => {
  if (!text) return []
  return text.split('\n').map(line => line.trim())
}

const textLines = computed(() => {
  return processText(props.text)
})

const slotTextLines = computed(() => {
  if (!slots.default) return []
  
  // Get slot content as text
  const slotContent = slots.default()
  if (!slotContent || !slotContent[0]) return []
  
  // Extract text from slot
  const slotText = slotContent[0].children || ''
  return processText(slotText)
})

const isSingleLine = computed(() => {
  const content = props.text || (slots.default ? slots.default()[0]?.children : '')
  if (content) {
    // Check if text contains line breaks or is short enough to be single line
    return !content.includes('\n') && content.length < 50
  }
  return false
})
</script>

<style>
.main-text {
  width: 100%;
  padding: var(--space-md);
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

.main-text p.empty-line {
  min-height: var(--text-4xl);
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