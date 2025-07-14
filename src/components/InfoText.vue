<template>
  <div class="info-text-container" v-if="hasContent">
    <div class="info-text" v-if="$slots.default">
      <slot></slot>
    </div>
    <div class="info-text" v-else-if="html" v-html="html"></div>
    <div class="info-text" v-else-if="text">{{ text }}</div>
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
  box-sizing: border-box;
}

.info-text {
  column-count: 2;
  column-gap: var(--space-3xl);
  /* max-width: 1000px; */
  width: 100%;
  padding: var(--space-xl) var(--space-3xl);
  text-align: left;
  margin: 0 auto;
  box-sizing: border-box;
  /* text-indent: var(--space-3xl); */
  word-break: break-all;
  overflow-wrap: anywhere;
}

.info-text * {
  word-break: break-all;
  overflow-wrap: anywhere;
}

.info-text p {
  margin-bottom: 1rem;
}

.info-text p:empty {
  min-height: 1em; /* or use margin for more space */
  display: block;
}

.info-text .empty-text {
  color: #888;
  font-style: italic;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .info-text {
    column-count: 1;
    max-width: 100%;
    
    margin: 0 auto;
    text-indent: 0;

    padding: var(--space-xl) var(--space-md);
  }
}
</style>
