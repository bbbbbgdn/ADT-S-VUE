import { createRouter, createWebHistory } from 'vue-router';

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
      redirect: '/'
    }
  ]
});

// Global after-navigation hook to ensure the page is visible
router.afterEach((to, from) => {
  // Make sure transition class is removed
  setTimeout(() => {
    if (document.body.classList.contains('page-transitioning')) {
      document.body.classList.remove('page-transitioning');
    }
    
    // Force profile images to be visible when navigating to profile
    if (to.path === '/profile') {
      setTimeout(() => {
        const profileImages = document.querySelectorAll('.profile-image');
        profileImages.forEach(img => {
          img.classList.add('image-loaded');
        });
      }, 100);
    }
  }, 800);
});

export default router;
