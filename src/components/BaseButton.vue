<template>
  <button 
    v-if="hasContent"
    class="base-button"
    :class="[
      `button-${variant}`,
      { 'keep-clickable': keepClickable && variant === 'active' },
      { 'transition-exempt': true }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="button-text">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import { useRouter } from 'vue-router'
import navigationManager from '../utils/navigationManager'

// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'black',
    validator: (value) => ['black', 'grey', 'active'].includes(value)
  },
  disabled: { type: Boolean, default: false },
  to: { 
    type: String, 
    default: null,
    validator: value => value === null || /^\/(?!\/)|^https?:\/\//.test(value)
  },
  keepClickable: { type: Boolean, default: false }
})

// Emits
const emit = defineEmits(['click'])

// Slots
const slots = useSlots()
const router = useRouter()

// Computed
const hasContent = computed(() => {
  if (!slots.default) return false;
  // Check if any slot content is not just whitespace or empty
  const content = slots.default().map(vnode => {
    if (typeof vnode.children === 'string') {
      return vnode.children.trim();
    }
    return vnode.children ? String(vnode.children).trim() : '';
  }).join('');
  return content.length > 0;
})

// Methods
const handleClick = (event) => {
  if (props.disabled) return;

  if (props.to) {
    event.preventDefault()
    navigationManager.navigateTo(router, props.to)
  } else {
    emit('click')
  }
}
</script>


<style scoped>
.base-button {
  display: inline-block;
  position: relative;

  padding-top: var(--button-padding-y);
  padding-bottom: var(--button-padding-y);
  padding-right: var(--button-padding-x);
  padding-left: var(--button-padding-x);

  white-space: nowrap;
  border-radius: var(--button-border-radius);
  
  min-height: var(--button-min-height);
  line-height: 1;

  text-align: left;
}

.button-text {
  display: inline-block;
  transform: translateY(var(--text-y-offset, -1.5rem));
}

/* Black Button */
.button-black {
  background-color: black;
  color: white;
  pointer-events: all;
  cursor: pointer;
}

/* Grey Button */
.button-grey, .button-black:disabled {
  background-color: rgba(195, 195, 195, 0.6);
  backdrop-filter: blur(100px);
  color: rgb(0, 0, 0);
  /* pointer-events: none; */
}

.button-grey:hover {
  /* background-color: rgba(195, 195, 195, 0.3); */
  cursor:default !important;
  /* color: rgba(0, 0, 0, 0.7) !important; */
}

.button-black:disabled {
  pointer-events: none;
}

/* Hover effect with smooth transition */
.button-black:hover {
  background-color: var(--color-pink-primary);
  color: black;
  /* transition: background-color 0.5s ease !important; */
}

/* Active Button */
.button-active {
  background-color: var(--color-pink-primary);
  color: black;
  pointer-events: none;
}

/* Override for active buttons that should remain clickable */
.keep-clickable {
  pointer-events: auto !important;
  cursor: pointer !important;
}

/* During page transitions, non-active buttons fade to black */
body.page-transitioning .button-black {
  background-color: black !important;
  color: white !important;
}
</style> 