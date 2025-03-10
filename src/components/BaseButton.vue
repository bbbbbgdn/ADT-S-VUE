<template>
  <button 
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
  methods: {
    handleClick() {
      if (this.to) {
        event.preventDefault();
        this.$router.push(this.to);
        return;
      }
      this.$emit('click');
    }
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