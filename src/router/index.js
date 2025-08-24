import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue'
import TabsPage from '../pages/TabsPage.vue'
import CarsPage from '../pages/HomePage.vue';
import BookingPage from '../pages/BookingPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import ProductPage from '../pages/ProductPage.vue';
import PageIndigator from '../pages/PageIndigator.vue';
import ReviewsPage from '../pages/ReviewsPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/cars'
  },
  {
    path: '/product/:id',
    name: 'ProductPage',
    component: ProductPage
  },
   {
    path: '/reviews/:id',
    name: 'ReviewsPage',
    component: ReviewsPage
  },
  {
    path: '/page-indicator',
    name: 'PageIndicator',
    component: PageIndigator
  },
  {
    path: '/landing-page',
    name: 'TabsPage',
    component:TabsPage,
    children: [
      {
        path: '/cars',
        component: CarsPage
      },
      {
        path: '/booking',
        component: BookingPage
      },
      {
        path: '/profile',
        component: ProfilePage
      }
    ]
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
