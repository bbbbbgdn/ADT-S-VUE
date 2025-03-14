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
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    outlined: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: 'black',
      validator: (value) => ['black', 'grey', 'active'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: null
    },
    keepClickable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  data() {
    return {
      slotContent: ''
    };
  },
  computed: {
    hasContent() {
      return this.slotContent.trim().length > 0;
    }
  },
  methods: {
    handleClick() {
      if (this.to) {
        event.preventDefault();
        this.$router.push(this.to);
        return;
      }
      this.$emit('click');
    },
    updateSlotContent() {
      // Get the text content of the default slot
      const slotElement = this.$slots.default && this.$slots.default();
      if (slotElement && slotElement.length > 0) {
        // Extract text content from VNode
        this.slotContent = this.getTextFromVNode(slotElement[0]);
        
        // Log warning if content is empty
        if (!this.slotContent || this.slotContent.trim().length === 0) {
          console.warn('Empty button content detected', {
            variant: this.variant,
            to: this.to
          });
        }
      } else {
        this.slotContent = '';
        console.warn('Empty button content detected (no slot content)', {
          variant: this.variant,
          to: this.to
        });
      }
    },
    getTextFromVNode(vnode) {
      if (!vnode) return '';
      
      // If it's a text node, return its content
      if (typeof vnode.children === 'string') {
        return vnode.children;
      }
      
      // If it has children, recursively get text from them
      if (Array.isArray(vnode.children)) {
        return vnode.children.map(child => this.getTextFromVNode(child)).join('');
      }
      
      return '';
    }
  },
  mounted() {
    this.updateSlotContent();
  },
  updated() {
    this.updateSlotContent();
  }
}
</script>

<style scoped>
.base-button {
  display: inline-block;
  padding: 4rem 12rem 6rem 12rem;
  white-space: nowrap;
  border-radius: 100rem;
  
  min-height: 42.4rem;
  line-height: 1.2;

  white-space: wrap;
  text-align: left;

  /* Set initial transition properties */
  transition: all 0.5s ease-in-out !important;
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
  background-color: #C3C3C3;
  color: rgb(0, 0, 0);
  pointer-events: none;
}

.button-black:disabled {
  pointer-events: none;
}

/* Hover effect with smooth transition */
.button-black:hover {
  background-color: var(--color-pink-primary);
  color: black;
  transition: all 0.5s ease !important;
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