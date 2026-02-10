<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
  studentName: { type: String, default: 'Leonteva Arina' },
  studentGroup: { type: String, default: 'P3213' },
  variant: { type: String, default: '1755' }
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isMenuOpen = ref(false);

const isMainPage = computed(() => route.path === '/');
const username = computed(() => authStore.user);

const logoutHandler = () => {
  authStore.logout();
  router.push('/login');
};

const handleStorageChange = () => {
  const numericKeys = Object.keys(localStorage).filter(key => /^\d+$/.test(key));
  if (numericKeys.length === 0) {
    authStore.logout();
  }
};

onMounted(() => {
  window.addEventListener("storage", handleStorageChange);
});

onUnmounted(() => {
  window.removeEventListener("storage", handleStorageChange);
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  document.body.classList.toggle('_lock', isMenuOpen.value);
};
</script>

<template>
  <div class="header">
    <div class="header__row">
      <div class="header__title" :class="{ '_active': isMenuOpen }">
        <a href="https://github.com/lntwa" target="_blank" class="header__link">
          {{ studentName }} | {{ studentGroup }} | #{{ variant }}
        </a>
      </div>

      <div v-if="isMainPage" class="header__menu menu">
        <div class="menu__icon" :class="{ '_active': isMenuOpen }" @click="toggleMenu">
          <span />
        </div>

        <div class="menu__body" :class="{ '_active': isMenuOpen }">
          <ul class="menu__list">
            <li v-if="username" class="menu__item user-info">User: {{ username }}</li>
            <li class="menu__item">
              <a href="#" @click.prevent="logoutHandler" class="logout-link">Logout</a>
            </li>
          </ul>
        </div>
      </div>
      <span v-else></span>
    </div>
  </div>
</template>

<style scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  background: rgba(0, 31, 63, 0.8);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #d2b48c;
}

.header__row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}

.header__link {
  color: #d2b48c !important;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.header__link:hover {
  color: #ffffff !important;
  text-shadow: 0 0 10px rgba(210, 180, 140, 0.5);
}

.menu__list {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.user-info {
  color: #ffffff;
  font-size: 0.9rem;
  opacity: 0.8;
}

.logout-link {
  color: #ffffff !important;
  text-decoration: underline;
  font-weight: 500;
}

.logout-link:hover {
  color: #ff4d4d !important;
}

.menu__icon {
  display: none;
}

@media (max-width: 767px) {
  .header__row {
    justify-content: space-between;
  }
}
</style>