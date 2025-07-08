<template>
  <div class="auto-scroll-demo">
    <h2>Auto-Scroll Gallery Demo</h2>
    
    <div class="controls">
      <button @click="toggleAutoScroll" :class="{ active: enableAutoScroll }">
        {{ enableAutoScroll ? 'Stop' : 'Start' }} Auto-Scroll
      </button>
      
      <button @click="pauseAutoScroll" :disabled="!enableAutoScroll">
        Pause
      </button>
      
      <button @click="resumeAutoScroll" :disabled="!enableAutoScroll">
        Resume
      </button>
      
      <div class="speed-control">
        <label>Speed: {{ autoScrollSpeed }}px/frame</label>
        <input 
          type="range" 
          min="0.5" 
          max="3" 
          step="0.1" 
          v-model="autoScrollSpeed"
          :disabled="!enableAutoScroll"
        />
      </div>
    </div>
    
    <ImageGallery
      ref="galleryRef"
      :images="demoImages"
      :repeat-count="3"
      slug="demo-gallery"
      :enable-auto-scroll="enableAutoScroll"
      :auto-scroll-speed="autoScrollSpeed"
      :auto-scroll-pause-on-hover="true"
      :auto-scroll-pause-on-touch="true"
      image-height="300px"
      name="Demo Gallery"
      location="Demo Location"
      date="2024"
    />
    
    <div class="info">
      <h3>Usage Examples:</h3>
      <ul>
        <li><strong>Hover to pause:</strong> Move mouse over gallery to pause auto-scroll</li>
        <li><strong>Touch to pause:</strong> Touch/swipe on mobile to pause auto-scroll</li>
        <li><strong>Programmatic control:</strong> Use the buttons above to control auto-scroll</li>
        <li><strong>Speed control:</strong> Adjust the slider to change scroll speed</li>
      </ul>
      
      <h3>Parent Component Usage:</h3>
      <pre><code>
// In parent component
&lt;ImageGallery
  ref="galleryRef"
  :enable-auto-scroll="true"
  :auto-scroll-speed="1.5"
  :auto-scroll-pause-on-hover="true"
  :auto-scroll-pause-on-touch="true"
  ...other props
/&gt;

// Control from parent
this.$refs.galleryRef.startAutoScrollProgrammatically();
this.$refs.galleryRef.stopAutoScrollProgrammatically();
this.$refs.galleryRef.pauseAutoScroll();
this.$refs.galleryRef.resumeAutoScroll();
      </code></pre>
    </div>
  </div>
</template>

<script>
import ImageGallery from './ImageGallery.vue';

export default {
  name: 'AutoScrollDemo',
  components: { ImageGallery },
  data() {
    return {
      enableAutoScroll: false,
      autoScrollSpeed: 1,
      demoImages: [
        {
          url: 'https://picsum.photos/400/300?random=1',
          alt: 'Demo Image 1'
        },
        {
          url: 'https://picsum.photos/400/300?random=2',
          alt: 'Demo Image 2'
        },
        {
          url: 'https://picsum.photos/400/300?random=3',
          alt: 'Demo Image 3'
        },
        {
          url: 'https://picsum.photos/400/300?random=4',
          alt: 'Demo Image 4'
        },
        {
          url: 'https://picsum.photos/400/300?random=5',
          alt: 'Demo Image 5'
        },
        {
          url: 'https://picsum.photos/400/300?random=6',
          alt: 'Demo Image 6'
        }
      ]
    };
  },
  methods: {
    toggleAutoScroll() {
      this.enableAutoScroll = !this.enableAutoScroll;
    },
    
    pauseAutoScroll() {
      this.$refs.galleryRef?.pauseAutoScroll();
    },
    
    resumeAutoScroll() {
      this.$refs.galleryRef?.resumeAutoScroll();
    }
  }
};
</script>

<style scoped>
.auto-scroll-demo {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.controls button:hover:not(:disabled) {
  background: #f0f0f0;
}

.controls button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.speed-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.speed-control label {
  font-size: 0.9rem;
  color: #666;
}

.speed-control input {
  width: 150px;
}

.info {
  margin-top: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.info h3 {
  margin-top: 0;
  color: #333;
}

.info ul {
  margin-bottom: 2rem;
}

.info li {
  margin-bottom: 0.5rem;
}

.info pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
}

.info code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .speed-control {
    align-items: center;
  }
}
</style> 