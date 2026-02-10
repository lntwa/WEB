<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../header/Header.vue';

import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  username: '',
  password: ''
});

const errors = reactive({
  username: '',
  password: ''
});

const serverError = ref(null);

const handleInput = (field) => {
  formData[field] = formData[field].replace(/[\t ]/g, "");

  if (errors[field]) {
    errors[field] = '';
  }
  if (serverError.value) {
    serverError.value = null;
  }
};

const validateRegex = (value) => {
  const regex = /^[a-zA-Zа-яА-ЯёЁ0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;
  if (!regex.test(value)) {
    const invalidChars = value.split('').filter((char, index, self) => {
      return !regex.test(char) && self.indexOf(char) === index;
    }).join(', ');
    return `Invalid character(s): ${invalidChars}`;
  }
  return true;
};

const validateAll = () => {
  let isValid = true;

  if (!formData.username) {
    errors.username = "Username is required";
    isValid = false;
  } else if (formData.username.length < 6) {
    errors.username = "Username should be at-least 6 characters";
    isValid = false;
  } else {
    const regexResult = validateRegex(formData.username);
    if (regexResult !== true) {
      errors.username = regexResult;
      isValid = false;
    }
  }

  if (!formData.password) {
    errors.password = "Password is required";
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = "Password should be at-least 6 characters";
    isValid = false;
  } else {
    const regexResult = validateRegex(formData.password);
    if (regexResult !== true) {
      errors.password = regexResult;
      isValid = false;
    }
  }

  return isValid;
};

const onSubmit = async () => {
  if (!validateAll()) return;

  try {
    await authStore.login({
      username: formData.username,
      password: formData.password
    });

    router.push('/');
  } catch (err) {
    serverError.value = 'Check login and password.';
  }
};

const handleStorageChange = () => {
  const numericKeys = Object.keys(localStorage).filter(key => /^\d+$/.test(key));
  if (numericKeys.length > 0) {
    window.location.reload();
  }
};

onMounted(() => {
  window.addEventListener("storage", handleStorageChange);
});

onUnmounted(() => {
  window.removeEventListener("storage", handleStorageChange);
});
</script>

<template>
  <div class="login-page"> <Header pageName="Login" /> <div class="login-container"> <h2>Sign In</h2>

      <form @submit.prevent="onSubmit">
        <div class="form-group"> <label for="username">Username</label>
          <input
              id="username"
              type="text"
              placeholder="Type username"
              v-model="formData.username"
              @input="handleInput('username')"
          />
          <p v-if="errors.username" class="error-text">{{ errors.username }}</p>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
              id="password"
              type="password"
              placeholder="Type password"
              v-model="formData.password"
              @input="handleInput('password')"
          />
          <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          <p v-if="serverError" class="error-message">{{ serverError }}</p>
        </div>

        <div class="form-group">
          <button type="submit">Sign In</button>
        </div>

        <div class="auth-footer"> <span>Don't have an account? </span>
          <RouterLink to="/registration">Sign Up</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

:global(body) {
  margin: 0;
}

.login-page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url('/sail.jpg') no-repeat center center fixed;
  background-size: cover;
  position: relative;
}

.login-container {
  background: rgba(255, 255, 255, 0.9);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  border: 1px solid #d2b48c;
}

h2 {
  color: #003366;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  color: #003366;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fdfaf5;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #003366;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #003366;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.1s;
}

button:hover {
  background-color: #004d99;
}

button:active {
  transform: scale(0.98);
}

.auth-footer {
  text-align: center;
  margin-top: 1rem;
  color: #666;
  font-size: 0.85rem;
}

.auth-footer a {
  color: #003366;
  text-decoration: none;
  font-weight: bold;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.error-text, .error-message {
  color: #cc0000;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.login-page :deep(header),
.login-page :deep(.header) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 51, 102, 0.8);
  color: white;
  padding: 1rem 0;
  text-align: center;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}
</style>