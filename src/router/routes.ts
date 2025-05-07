// router/routes.ts
import type { RouteRecordRaw } from 'vue-router';
import QaPage from '@/views/QaPage.vue';
import SteelPhase from '@/views/SteelPhase.vue';
import HomePage from '@/views/HomeView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: '首页' }
  },
  {
    path: '/qa',
    name: 'QA',
    component: QaPage,
    meta: { title: '智能问答' }
  },
  {
    path:'/sphase',
    name:'SteelPhase',
    component: SteelPhase,
    meta: { title: '钢铁相图' }
  },
  {
    path: '/:pathMatch(.*)*', // 404页面
    redirect: '/'
  }
];

export default routes;
