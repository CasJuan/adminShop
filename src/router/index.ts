import { adminRoutes } from '@/modules/admin/routes';
import { authRoutes } from '@/modules/auth';
import ShopLayouts from '@/modules/shop/layouts/ShopLayouts.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'shop',
      component: ShopLayouts,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../modules/shop/views/HomeView.vue'),
        },
      ],
    },
    authRoutes,
    adminRoutes,
  ],
});

export default router;
