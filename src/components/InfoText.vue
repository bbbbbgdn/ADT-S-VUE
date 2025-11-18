<template>
  <div class="info-text-container" v-if="hasContent">
    <div class="info-text" :class="{ 'single-hr': hasSingleHr }" v-if="$slots.default" :style="inlineStyle">
      <slot></slot>
    </div>
    <div class="info-text" :class="{ 'single-hr': hasSingleHr }" v-else-if="html" :style="inlineStyle" v-html="html"></div>
    <div class="info-text" :class="{ 'single-hr': hasSingleHr }" v-else-if="text" :style="inlineStyle">{{ text }}</div>
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
    },
    inlineStyle() {
      return {
        columnCount: this.columnCount
      };
    },
    hasSingleHr() {
      const content = this.html || this.text || '';
      if (!content) return false;
      
      // Count <hr> tags (case-insensitive, with or without attributes)
      const hrMatches = content.match(/<hr\s*[^>]*>/gi);
      return hrMatches && hrMatches.length === 1;
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
  column-fill: auto;
  /* max-width: 1000px; */
  width: 100%;
  padding: var(--space-xl) var(--space-3xl);
  text-align: left;
  margin: 0 auto;
  box-sizing: border-box;
  /* text-indent: var(--space-3xl); */
  /* word-break: break-all; */
  /* overflow-wrap: anywhere; */
}

.info-text p,
.info-text div {
  break-inside: avoid;
}

.info-text a {
  overflow-wrap: break-word;
  word-break: break-word;
}

.info-text p {
  margin-bottom: 1rem;
}

.info-text p:empty {
  min-height: 1em; /* or use margin for more space */
  display: block;
}

.info-text hr {
  visibility: hidden;
  margin: 0;
  padding: 0;
  border: none;
  height: 0;
  overflow: hidden;
}

.info-text.single-hr hr {
  break-after: column;
  page-break-after: column;
  -webkit-column-break-after: column;
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
