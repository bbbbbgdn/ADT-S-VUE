<template>
  <button 
    v-if="hasContent"
    class="base-button"
    :class="[
      `button-${variant}`,
      { 'keep-clickable': keepClickable && variant === 'active' }
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
  
  transition: all .8s;
  min-height: 42.4rem;
  line-height: 1.2;
}

/* Black Button */
.button-black {
  background-color: black;
  color: white;
  cursor: pointer;
}

/* Grey Button */
.button-grey {
  background-color: #C3C3C3;
  color: rgb(0, 0, 0);
}

.button-black:disabled {
  pointer-events: none;
}

.button-black:hover ,.button-black:disabled {
  opacity: 0.75;
}

/* Active Button */
.button-active {
  background-color: #E788FF;
  color: black;
  pointer-events: none;
}

/* Override for active buttons that should remain clickable */
.keep-clickable {
  pointer-events: auto !important;
  cursor: pointer !important;
}
</style> 