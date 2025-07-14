// Debug script for investigating image visibility issues
// Run this in the browser console to monitor image states

function debugImageVisibility() {
  console.log('=== Image Visibility Debug Tool ===');
  
  // Find all galleries
  const galleries = document.querySelectorAll('.gallery-container');
  console.log(`Found ${galleries.length} galleries`);
  
  galleries.forEach((gallery, galleryIndex) => {
    const galleryId = gallery.querySelector('.gallery-image')?.dataset?.galleryId || `gallery-${galleryIndex}`;
    const images = gallery.querySelectorAll('img.gallery-image');
    
    console.log(`\n--- Gallery ${galleryIndex + 1} (ID: ${galleryId}) ---`);
    console.log(`Total images: ${images.length}`);
    
    let loadingCount = 0;
    let loadedCount = 0;
    let visibleCount = 0;
    let hiddenCount = 0;
    let errorCount = 0;
    
    images.forEach((img, index) => {
      const isVisible = img.classList.contains('image-loaded') && img.style.opacity === '1';
      const isLoaded = img.classList.contains('image-loaded');
      const isLoading = img.classList.contains('image-loading');
      const isError = img.classList.contains('image-error');
      
      if (isLoading) loadingCount++;
      if (isLoaded) loadedCount++;
      if (isVisible) visibleCount++;
      if (isLoaded && !isVisible) hiddenCount++;
      if (isError) errorCount++;
      
      console.log(`  Image ${index}: ${isLoading ? 'Loading' : ''}${isLoaded ? 'Loaded' : ''}${isError ? 'Error' : ''}${isVisible ? ' (Visible)' : isLoaded ? ' (Hidden)' : ''} - opacity: ${img.style.opacity}`);
    });
    
    console.log(`\n  Summary: Loading: ${loadingCount}, Loaded: ${loadedCount}, Visible: ${visibleCount}, Hidden: ${hiddenCount}, Errors: ${errorCount}`);
    
    if (hiddenCount > 0) {
      console.warn(`  ⚠️  WARNING: ${hiddenCount} loaded images are hidden!`);
      
      // Try to restore hidden images
      console.log('  Attempting to restore hidden images...');
      const debugGallery = window[`debugGallery_${galleryId}`];
      if (debugGallery && debugGallery.restoreHidden) {
        const restored = debugGallery.restoreHidden();
        console.log(`  Restored ${restored} hidden images`);
      } else {
        console.log('  No debug methods available for this gallery');
      }
    }
  });
  
  console.log('\n=== Debug Complete ===');
}

// Auto-run the debug function
debugImageVisibility();

// Set up periodic monitoring
const monitorInterval = setInterval(() => {
  const galleries = document.querySelectorAll('.gallery-container');
  let totalHidden = 0;
  
  galleries.forEach(gallery => {
    const images = gallery.querySelectorAll('img.gallery-image');
    images.forEach(img => {
      if (img.classList.contains('image-loaded') && img.style.opacity !== '1') {
        totalHidden++;
      }
    });
  });
  
  if (totalHidden > 0) {
    console.warn(`🚨 MONITOR: Found ${totalHidden} hidden loaded images across all galleries`);
    debugImageVisibility();
  }
}, 10000); // Check every 10 seconds

console.log('Image visibility monitor started. Run clearInterval(monitorInterval) to stop monitoring.');

// Export functions for manual use
window.debugImageVisibility = debugImageVisibility;
window.stopImageMonitoring = () => clearInterval(monitorInterval); 