import { createRouter, createWebHistory } from 'vue-router';
import { transitionTiming } from '../utils/transitionConfig';
import NotFound from '../views/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/Components',
      name: 'Components',
      component: () => import('../views/ComponentsDemo.vue')
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/projects',
      name: 'Projects',
      component: () => import('../views/Projects.vue')
    },
    {
      path: '/projects/:slug',
      name: 'ProjectDetail',
      component: () => import('../views/ProjectPage.vue')
    },
    {
      path: '/objects',
      name: 'Objects',
      component: () => import('../views/Objects.vue')
    },
    {
      path: '/objects/:slug',
      name: 'ObjectDetail',
      component: () => import('../views/ObjectPage.vue')
    },
    {
      path: '/shows',
      name: 'Shows',
      component: () => import('../views/Shows.vue')
    },
    {  
        path: '/shows/:slug',
        name: 'ShowDetail',
        component: () => import('../views/ShowPage.vue'),
        props: true
    },
    {
      path: '/showpage',
      name: 'ShowPage',
      component: () => import('../views/ShowPage.vue')
    },
    {
      path: '/press',
      name: 'Press',
      component: () => import('../views/Press.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue')
    },
    // {
    //   path: '/objects',
    //   name: 'Objects',
    //   component: () => import('../views/Objects.vue')
    // },
    // {
    //   path: '/press',
    //   name: 'Press',
    //   component: () => import('../views/Press.vue')
    // },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
});

// Apply transition for all navigation events
router.beforeEach((to, from, next) => {
  // Skip transition when navigating to 404 page
  if (to.name === 'NotFound') {
    document.body.classList.remove('page-transitioning');
    next();
    return;
  }

  // Only apply transition if we're actually changing routes
  if (to.path !== from.path) {
    document.body.classList.add('page-transitioning');
    void document.body.offsetWidth;
  }
  next();
});

// Global after-navigation hook - safety net only
router.afterEach((to, from) => {
  // Make sure we're at the top of the page after navigation
  window.scrollTo(0, 0);
  
  // Reset the scroll behavior to smooth after navigation
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Track page view with Rybbit
  if (window.rybbit && typeof window.rybbit.pageview === 'function') {
    window.rybbit.pageview();
  }
  
  // We'll let the PageTransition component handle removing the class
  // This is just a safety timeout for any edge cases
  if (to.name === 'NotFound') {
    document.body.classList.remove('page-transitioning');
  } else {
    setTimeout(() => {
      document.body.classList.remove('page-transitioning');
      
      // Make sure all images are properly visible
      document.querySelectorAll('.image-loaded').forEach(img => {
        img.style.opacity = '1';
      });
    }, 100); // Reduced safety timeout
  }
});

export default router;
