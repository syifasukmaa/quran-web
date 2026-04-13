import App from '@/App.vue';
import Home from '@/views/home/Home.vue';
import QuranDetail from '@/views/quran-list/detail/QuranDetail.vue';
import QuranList from '@/views/quran-list/QuranList.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/list-quran',
      component: QuranList,
    },
    {
      path: '/list-quran/:id',
      component: QuranDetail,
    },
  ],
});

export default router;
