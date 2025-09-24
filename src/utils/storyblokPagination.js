import { useStoryblokApi } from '@storyblok/vue';

/**
 * Fetches all stories from Storyblok by handling pagination automatically
 * @param {Object} options - Request options
 * @param {string} options.starts_with - Path prefix to filter stories
 * @param {string} options.version - Version to fetch ('published' or 'draft')
 * @param {Object} options.extraParams - Additional parameters to pass to the API
 * @returns {Promise<Array>} - Array of all stories
 */
export async function fetchAllStories(options = {}) {
  const {
    starts_with = '',
    version = 'published',
    extraParams = {}
  } = options;

  const storyblokApi = useStoryblokApi();
  const allStories = [];
  const perPage = 100; // Maximum allowed by Storyblok
  let currentPage = 1;
  let hasMorePages = true;

  console.log(`🔄 Starting to fetch all stories with prefix: "${starts_with}"`);

  while (hasMorePages) {
    try {
      console.log(`📦 Fetching page ${currentPage} (items ${(currentPage - 1) * perPage + 1}-${currentPage * perPage})`);
      
      const response = await storyblokApi.get('cdn/stories', {
        starts_with,
        version,
        per_page: perPage,
        page: currentPage,
        ...extraParams
      });

      const stories = response.data.stories || [];
      allStories.push(...stories);

      // Check if we have more pages
      // Storyblok includes pagination info in headers
      const totalStories = parseInt(response.headers['total']) || stories.length;
      const currentTotal = currentPage * perPage;
      
      hasMorePages = stories.length === perPage && currentTotal < totalStories;
      
      console.log(`✅ Page ${currentPage}: Found ${stories.length} stories (Total so far: ${allStories.length})`);
      
      if (hasMorePages) {
        currentPage++;
        // Small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`❌ Error fetching page ${currentPage}:`, error);
      hasMorePages = false; // Stop on error
    }
  }

  console.log(`🎉 Finished! Total stories fetched: ${allStories.length}`);
  return allStories;
}

/**
 * Fetches all objects from Storyblok
 * @returns {Promise<Array>} - Array of all object stories
 */
export async function fetchAllObjects() {
  return fetchAllStories({
    starts_with: 'objects/',
    version: 'published'
  });
}

/**
 * Fetches all projects from Storyblok
 * @returns {Promise<Array>} - Array of all project stories
 */
export async function fetchAllProjects() {
  return fetchAllStories({
    starts_with: 'projects/',
    version: 'published'
  });
}

/**
 * Fetches all shows from Storyblok
 * @returns {Promise<Array>} - Array of all show stories
 */
export async function fetchAllShows() {
  return fetchAllStories({
    starts_with: 'shows/',
    version: 'published'
  });
}
