# Auto-Scroll Gallery Guide

## Overview

The `ImageGallery` component now supports programmatic auto-scrolling that can be activated for specific cases like hover, mobile center detection, or manual control. This feature uses CSS transforms for smooth 60fps scrolling and doesn't interfere with regular user scrolling.

## Key Features

- ✅ **Smooth Performance**: Uses CSS transforms for 60fps scrolling
- ✅ **Non-Interfering**: Doesn't block regular user scrolling
- ✅ **Hover Pause**: Automatically pauses on mouse hover
- ✅ **Touch Pause**: Automatically pauses on touch/swipe (mobile)
- ✅ **Center Detection**: Can detect when gallery is in viewport center
- ✅ **Mobile Optimized**: Different behavior and speeds for mobile devices
- ✅ **Programmatic Control**: Full control via methods and props

## Props

### Auto-Scroll Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableAutoScroll` | Boolean | `false` | Enable/disable auto-scroll functionality |
| `autoScrollSpeed` | Number | `1` | Scroll speed in pixels per frame (0.5-3 recommended) |
| `autoScrollPauseOnHover` | Boolean | `true` | Pause auto-scroll on mouse hover |
| `autoScrollPauseOnTouch` | Boolean | `true` | Pause auto-scroll on touch/swipe |

## Events

### `center-visibility-changed`

Emitted when the gallery enters/leaves the center of the viewport.

```javascript
@center-visibility-changed="handleCenterVisibilityChanged"
```

**Parameters:**
- `isInCenter` (Boolean): Whether the gallery is in the center of the viewport

## Public Methods

### `startAutoScrollProgrammatically()`
Start auto-scroll manually.

### `stopAutoScrollProgrammatically()`
Stop auto-scroll manually.

### `pauseAutoScroll()`
Pause auto-scroll temporarily (resumes after user interaction timeout).

### `resumeAutoScroll()`
Resume auto-scroll immediately.

### `isAutoScrollActive()`
Check if auto-scroll is currently active and not paused.

**Returns:** Boolean

## Usage Examples

### Basic Auto-Scroll

```vue
<template>
  <ImageGallery
    :images="images"
    :repeat-count="3"
    slug="my-gallery"
    :enable-auto-scroll="true"
    :auto-scroll-speed="1.2"
    image-height="300px"
  />
</template>
```

### Hover-Activated Auto-Scroll

```vue
<template>
  <ImageGallery
    ref="galleryRef"
    :images="images"
    :repeat-count="3"
    slug="hover-gallery"
    :enable-auto-scroll="isHovering"
    :auto-scroll-speed="1"
    :auto-scroll-pause-on-hover="false"
    image-height="250px"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  />
</template>

<script>
export default {
  data() {
    return {
      isHovering: false,
      images: [/* your images */]
    };
  }
};
</script>
```

### Center-Detection Auto-Scroll

```vue
<template>
  <ImageGallery
    ref="galleryRef"
    :images="images"
    :repeat-count="3"
    slug="center-gallery"
    :enable-auto-scroll="isInCenter"
    :auto-scroll-speed="autoScrollSpeed"
    image-height="300px"
    @center-visibility-changed="handleCenterVisibilityChanged"
  />
</template>

<script>
export default {
  data() {
    return {
      isInCenter: false,
      autoScrollSpeed: 1.2,
      images: [/* your images */]
    };
  },
  methods: {
    handleCenterVisibilityChanged(isInCenter) {
      this.isInCenter = isInCenter;
    }
  }
};
</script>
```

### Mobile-Optimized Auto-Scroll

```vue
<template>
  <ImageGallery
    ref="galleryRef"
    :images="images"
    :repeat-count="3"
    slug="mobile-gallery"
    :enable-auto-scroll="shouldEnableAutoScroll"
    :auto-scroll-speed="mobileAutoScrollSpeed"
    :auto-scroll-pause-on-touch="true"
    image-height="250px"
    @center-visibility-changed="handleCenterVisibilityChanged"
  />
</template>

<script>
export default {
  data() {
    return {
      isInCenter: false,
      images: [/* your images */]
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 768;
    },
    
    shouldEnableAutoScroll() {
      // Only enable on mobile when in center
      return this.isMobile && this.isInCenter;
    },
    
    mobileAutoScrollSpeed() {
      // Slower speed on mobile for better UX
      return this.isMobile ? 0.8 : 1.2;
    }
  },
  methods: {
    handleCenterVisibilityChanged(isInCenter) {
      this.isInCenter = isInCenter;
    }
  }
};
</script>
```

### Programmatic Control

```vue
<template>
  <div>
    <button @click="startAutoScroll">Start</button>
    <button @click="stopAutoScroll">Stop</button>
    <button @click="pauseAutoScroll">Pause</button>
    <button @click="resumeAutoScroll">Resume</button>
    
    <ImageGallery
      ref="galleryRef"
      :images="images"
      :repeat-count="3"
      slug="controlled-gallery"
      :enable-auto-scroll="false"
      image-height="300px"
    />
  </div>
</template>

<script>
export default {
  methods: {
    startAutoScroll() {
      this.$refs.galleryRef.startAutoScrollProgrammatically();
    },
    
    stopAutoScroll() {
      this.$refs.galleryRef.stopAutoScrollProgrammatically();
    },
    
    pauseAutoScroll() {
      this.$refs.galleryRef.pauseAutoScroll();
    },
    
    resumeAutoScroll() {
      this.$refs.galleryRef.resumeAutoScroll();
    }
  }
};
</script>
```

## Performance Considerations

### Speed Recommendations

- **Desktop**: 1.0 - 2.0 pixels/frame
- **Mobile**: 0.5 - 1.5 pixels/frame
- **Fast**: 2.0 - 3.0 pixels/frame (use sparingly)

### Best Practices

1. **Use CSS Transforms**: The implementation uses `transform: translateX()` for optimal performance
2. **RequestAnimationFrame**: Smooth 60fps animation using `requestAnimationFrame`
3. **Pause on Interaction**: Always enable pause on hover/touch for better UX
4. **Mobile Optimization**: Use slower speeds on mobile devices
5. **Center Detection**: Use center detection to avoid unnecessary scrolling when gallery is not visible

### Memory Management

The component automatically:
- Cleans up animation frames on unmount
- Resets scroll position when reaching the end
- Pauses animation when gallery is not visible
- Handles window resize events

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Auto-scroll not working

1. Check if `enableAutoScroll` is set to `true`
2. Verify the gallery has enough content to scroll
3. Ensure the gallery is visible in the viewport
4. Check browser console for errors

### Performance issues

1. Reduce `autoScrollSpeed` value
2. Ensure images are optimized
3. Check if too many galleries are auto-scrolling simultaneously
4. Verify hardware acceleration is enabled

### Mobile issues

1. Use slower speeds on mobile (`0.5 - 1.0`)
2. Enable `autoScrollPauseOnTouch`
3. Test on actual mobile devices, not just browser dev tools
4. Consider disabling auto-scroll on very small screens

## Examples

See the following example components:
- `AutoScrollDemo.vue` - Basic usage and controls
- `SmartAutoScrollExample.vue` - Advanced usage with center detection and mobile optimization 