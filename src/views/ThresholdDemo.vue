<template>
  <div class="page">
    <h1 class="title">CSS Threshold Filter Demo</h1>

    <div class="demo-container">
      <div
        class="image-container"
        @click="changeImage"
      >
        <AppearingImage
          :key="imageKey"
          :src="currentImageUrl"
          :animation-duration="2500"
          :easing-function="selectedEasing"
          :brightness-min="brightness.min"
          :brightness-max="brightness.max"
          :grayscale-value="grayscale.value"
          :contrast-value="contrast.value"
          alt="Demo Image"
          @animation-complete="onAnimationComplete"
        />
      </div>

      <p class="instruction">
        Click on the image to change it and see the appearing animation
      </p>

      <div class="controls">
        <!-- Brightness Control -->
        <div class="control-group">
          <label class="control-label">Brightness Range</label>
          <div class="input-row">
            <input
              v-model.number="brightness.min"
              type="number"
              class="number-input"
              placeholder="Min"
            >
            <input
              v-model.number="brightness.max"
              type="number"
              class="number-input"
              placeholder="Max"
            >
          </div>

          <label class="control-label">Easing Function</label>
          <select v-model="selectedEasing" class="select-input">
            <option value="linear">Linear</option>
            <option value="ease-in">Ease In (Quadratic)</option>
            <option value="ease-out">Ease Out (Quadratic)</option>
            <option value="ease-in-out">Ease In Out (Quadratic)</option>
            <option value="cubic-in">Cubic In</option>
            <option value="cubic-out">Cubic Out</option>
            <option value="cubic-in-out">Cubic In Out</option>
            <option value="quartic-in">Quartic In</option>
            <option value="quartic-out">Quartic Out</option>
            <option value="quartic-in-out">Quartic In Out</option>
            <option value="sinusoidal-in">Sinusoidal In</option>
            <option value="sinusoidal-out">Sinusoidal Out</option>
            <option value="sinusoidal-in-out">Sinusoidal In Out</option>
            <option value="bounce-out">Bounce Out</option>
            <option value="elastic-out">Elastic Out</option>
          </select>

          <div class="button-row">
            <button
              @click="restartAnimation"
              class="btn btn-primary"
            >
              Present
            </button>
          </div>
        </div>

        <!-- Grayscale Control -->
        <div class="control-group">
          <label class="control-label">Grayscale</label>
          <input
            v-model.number="grayscale.value"
            type="range"
            min="0"
            max="100"
            class="slider"
          >
          <div class="value-display">{{ grayscale.value }}%</div>
        </div>

        <!-- Contrast Control -->
        <div class="control-group">
          <label class="control-label">Contrast</label>
          <input
            v-model.number="contrast.value"
            type="range"
            min="100"
            max="100000"
            step="100"
            class="slider"
          >
          <div class="value-display">{{ contrast.value }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppearingImage from '../components/AppearingImage.vue'

export default {
  name: 'ThresholdDemo',
  components: {
    AppearingImage
  },
  data() {
    return {
      selectedEasing: 'cubic-out',

      // Filter values
      brightness: {
        min: 0,
        max: 1500
      },
      grayscale: {
        value: 100
      },
      contrast: {
        value: 50000
      },

      // Image management
      currentImageUrl: '',
      imageKey: 0
    }
  },
  mounted() {
    this.loadNewImage();
  },
  methods: {
    loadNewImage() {
      const timestamp = Date.now();
      this.currentImageUrl = `https://picsum.photos/300/400?random=1&t=${timestamp}`;
    },

    changeImage() {
      // Increment key to force component re-mount with new image
      this.imageKey++;
      this.loadNewImage();
    },

    restartAnimation() {
      // Increment key to force component re-mount with same image
      this.imageKey++;
    },

    onAnimationComplete() {
      console.log('Animation completed');
    }
  }
}
</script>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.title {
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
}

.demo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.image-container {
  position: relative;
  width: 300px;
  height: 400px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.image-container:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.instruction {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin: 0;
}

.controls {
  width: 300px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.control-group {
  margin-bottom: 20px;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.slider {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  appearance: none;
  cursor: pointer;
  accent-color: #3b82f6;
  margin-bottom: 12px;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.value-display {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 4px;
}

.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.number-input {
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  text-align: center;
}

.number-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  margin-bottom: 12px;
}

.select-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.button-row {
  margin-top: 16px;
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  width: 100%;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-primary:active {
  background: #1d4ed8;
}
</style>