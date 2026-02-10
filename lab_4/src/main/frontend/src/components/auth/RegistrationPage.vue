<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore';

import Header from '../header/Header.vue';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

const serverError = ref(null);

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
  errors.username = '';
  errors.password = '';
  errors.confirmPassword = '';

  if (!formData.username) {
    errors.username = "Username is required";
    isValid = false;
  } else if (formData.username.length < 6) {
    errors.username = "Username should be at-least 6 characters";
    isValid = false;
  } else if (formData.username.length > 30) {
    errors.username = "Username should be less than 30 characters";
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
  } else if (formData.password.length > 30) {
    errors.password = "Password should be less than 30 characters";
    isValid = false;
  } else {
    const regexResult = validateRegex(formData.password);
    if (regexResult !== true) {
      errors.password = regexResult;
      isValid = false;
    }
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Password confirmation is required";
    isValid = false;
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Password and password confirmation must be equal";
    isValid = false;
  }

  return isValid;
};

const handleInput = (field) => {
  formData[field] = formData[field].replace(/[\t ]/g, "");

  if (errors[field]) errors[field] = '';
  if (serverError.value) serverError.value = null;
};

const onSubmit = async () => {
  if (!validateAll()) return;

  try {
    await authStore.register({
      username: formData.username,
      password1: formData.password,
      password2: formData.confirmPassword
    });

    router.push('/login');

  } catch (err) {
    if (err.response && err.response.status === 401) {
      serverError.value = 'A user with this name already exists';
    } else if (err.message) {
      serverError.value = err.message || 'Error occurred.';
    } else {
      serverError.value = 'Error occurred.';
    }
  }
};
</script>

<template>
  <div class="login-page"> <Header pageName="Registration" />

    <div class="login-container"> <h2>Create Account</h2>

      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label class="input-label" for="username">Username</label>
          <input
              id="username"
              type="text"
              name="username"
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
              name="password"
              placeholder="Type password"
              v-model="formData.password"
              @input="handleInput('password')"
          />
          <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
        </div>

        <div class="form-group">
          <label for="password_confirm">Confirm Password</label>
          <input
              id="password_confirm"
              type="password"
              name="password_confirm"
              placeholder="Repeat your password"
              v-model="formData.confirmPassword"
              @input="handleInput('confirmPassword')"
          />
          <p v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</p>
          <p v-if="serverError" class="error-message">{{ serverError }}</p>
        </div>

        <div class="form-group">
          <button type="submit">Sign Up</button>
        </div>

        <div class="auth-footer">
          <span>Already have an account? </span>
          <RouterLink to="/login">Sign In</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
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

.login-page :deep(.header) {
  position: absolute;
  top: 0;
  width: 100%;
}

.login-container {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  border: 1px solid #d2b48c;
  margin-top: 60px;
}

h2 {
  color: #003366;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: #003366;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fdfaf5;
  box-sizing: border-box;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #003366;
  box-shadow: 0 0 5px rgba(0, 51, 102, 0.2);
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
  margin-top: 0.5rem;
  transition: background 0.3s;
}

button:hover {
  background-color: #004d99;
}

.auth-footer {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #666;
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
  font-size: 0.75rem;
  margin-top: 0.2rem;
}
</style>