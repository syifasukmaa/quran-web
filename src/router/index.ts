import Home from '@/views/home/Home.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/quran',
      component: () => import('@/views/Parent.vue'),
      children: [
        {
          path: 'surah',
          component: () => import('@/views/quran-list/QuranList.vue'),
        },
        {
          path: 'doa',
          component: () => import('@/views/doa/DoaList.vue'),
        },
      ],
    },
    {
      path: '/quran/surah/:id',
      component: () => import('@/views/quran-list/detail/QuranDetail.vue'),
    },
    {
      path: '/quran/doa/:id',
      component: () => import('@/views/doa/detail/DoaDetail.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/error/NotFound.vue'),
      meta: { hideFooter: true },
    },
  ],
});

export default router;
