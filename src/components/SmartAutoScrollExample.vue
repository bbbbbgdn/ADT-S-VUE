<template>
  <div class="smart-auto-scroll-example">
    <h2>Smart Auto-Scroll Gallery</h2>
    <p class="description">
      This gallery automatically starts scrolling when it's in the center of the screen,
      pauses on hover/touch, and has different behavior on mobile vs desktop.
    </p>
    
    <div class="status">
      <div class="status-item">
        <span class="label">Auto-scroll:</span>
        <span class="value" :class="{ active: isAutoScrolling }">
          {{ isAutoScrolling ? 'Active' : 'Inactive' }}
        </span>
      </div>
      <div class="status-item">
        <span class="label">In center:</span>
        <span class="value" :class="{ active: isInCenter }">
          {{ isInCenter ? 'Yes' : 'No' }}
        </span>
      </div>
      <div class="status-item">
        <span class="label">Device:</span>
        <span class="value">{{ isMobile ? 'Mobile' : 'Desktop' }}</span>
      </div>
    </div>
    
    <ImageGallery
      ref="galleryRef"
      :images="galleryImages"
      :repeat-count="3"
      slug="smart-gallery"
      :enable-auto-scroll="shouldEnableAutoScroll"
      :auto-scroll-speed="autoScrollSpeed"
      :auto-scroll-pause-on-hover="true"
      :auto-scroll-pause-on-touch="true"
      image-height="250px"
      name="Smart Gallery"
      location="Interactive Demo"
      date="2024"
      @center-visibility-changed="handleCenterVisibilityChanged"
    />
    
    <div class="controls">
      <button @click="toggleAutoScroll" :class="{ active: shouldEnableAutoScroll }">
        {{ shouldEnableAutoScroll ? 'Disable' : 'Enable' }} Auto-Scroll
      </button>
      
      <div class="speed-control">
        <label>Speed: {{ autoScrollSpeed }}px/frame</label>
        <input 
          type="range" 
          min="0.5" 
          max="2" 
          step="0.1" 
          v-model="autoScrollSpeed"
        />
      </div>
    </div>
    
    <div class="info">
      <h3>Smart Features:</h3>
      <ul>
        <li><strong>Center Detection:</strong> Auto-scroll starts when gallery is in the center of the viewport</li>
        <li><strong>Mobile Optimization:</strong> Different behavior and speed on mobile devices</li>
        <li><strong>Hover Pause:</strong> Pauses on mouse hover (desktop)</li>
        <li><strong>Touch Pause:</strong> Pauses on touch/swipe (mobile)</li>
        <li><strong>Performance:</strong> Uses CSS transforms for smooth 60fps scrolling</li>
      </ul>
    </div>
  </div>
</template>

<script>
import ImageGallery from './ImageGallery.vue';

export default {
  name: 'SmartAutoScrollExample',
  components: { ImageGallery },
  data() {
    return {
      isInCenter: false,
      isAutoScrolling: false,
      autoScrollSpeed: 1,
      galleryImages: [
        {
          url: 'https://picsum.photos/400/250?random=10',
          alt: 'Gallery Image 1'
        },
        {
          url: 'https://picsum.photos/400/250?random=11',
          alt: 'Gallery Image 2'
        },
        {
          url: 'https://picsum.photos/400/250?random=12',
          alt: 'Gallery Image 3'
        },
        {
          url: 'https://picsum.photos/400/250?random=13',
          alt: 'Gallery Image 4'
        },
        {
          url: 'https://picsum.photos/400/250?random=14',
          alt: 'Gallery Image 5'
        },
        {
          url: 'https://picsum.photos/400/250?random=15',
          alt: 'Gallery Image 6'
        },
        {
          url: 'https://picsum.photos/400/250?random=16',
          alt: 'Gallery Image 7'
        },
        {
          url: 'https://picsum.photos/400/250?random=17',
          alt: 'Gallery Image 8'
        }
      ]
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 768;
    },
    
    shouldEnableAutoScroll() {
      // Enable auto-scroll when in center, with different logic for mobile
      if (this.isMobile) {
        // On mobile, only enable when in center and not too fast
        return this.isInCenter && this.autoScrollSpeed <= 1.5;
      } else {
        // On desktop, enable when in center
        return this.isInCenter;
      }
    }
  },
  mounted() {
    // Set appropriate speed based on device
    this.autoScrollSpeed = this.isMobile ? 0.8 : 1.2;
    
    // Listen for auto-scroll state changes
    this.$nextTick(() => {
      this.checkAutoScrollState();
    });
  },
  methods: {
    handleCenterVisibilityChanged(isInCenter) {
      this.isInCenter = isInCenter;
      this.checkAutoScrollState();
    },
    
    checkAutoScrollState() {
      if (this.$refs.galleryRef) {
        this.isAutoScrolling = this.$refs.galleryRef.isAutoScrollActive();
      }
    },
    
    toggleAutoScroll() {
      // This will override the automatic behavior
      if (this.$refs.galleryRef) {
        if (this.$refs.galleryRef.isAutoScrollActive()) {
          this.$refs.galleryRef.stopAutoScrollProgrammatically();
        } else {
          this.$refs.galleryRef.startAutoScrollProgrammatically();
        }
        this.checkAutoScrollState();
      }
    }
  },
  watch: {
    shouldEnableAutoScroll(newValue) {
      // Update auto-scroll state when conditions change
      this.$nextTick(() => {
        this.checkAutoScrollState();
      });
    }
  }
};
</script>

<style scoped>
.smart-auto-scroll-example {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.description {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.status {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-item .label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.status-item .value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.status-item .value.active {
  color: #28a745;
}

.controls {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.controls button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s;
}

.controls button:hover {
  background: #007bff;
  color: white;
}

.controls button.active {
  background: #007bff;
  color: white;
}

.speed-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.speed-control label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.speed-control input {
  width: 150px;
}

.info {
  margin-top: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.info h3 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1rem;
}

.info ul {
  margin: 0;
  padding-left: 1.5rem;
}

.info li {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.info li strong {
  color: #007bff;
}

@media (max-width: 768px) {
  .status {
    flex-direction: column;
    gap: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .speed-control {
    align-items: center;
  }
}
</style> 