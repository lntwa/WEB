import { createRouter, createWebHashHistory } from 'vue-router'

import LoginPage from '../components/auth/LoginPage.vue'
import RegistrationPage from '../components/auth/RegistrationPage.vue'
import MainPage from '../components/main/MainPage.vue'
import { useAuthStore } from '@/stores/AuthStore'

const routes = [
    {
        path: '/',
        name: 'Main',
        component: MainPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { requiresGuest: true }
    },
    {
        path: '/registration',
        name: 'Registration',
        component: RegistrationPage,
        meta: { requiresGuest: true }
    }
]

const index = createRouter({
    history: createWebHashHistory(),
    routes
})


index.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login');
    }

    if (to.meta.requiresGuest && isAuthenticated) {
        return next('/');
    }

    next();
});

export default index