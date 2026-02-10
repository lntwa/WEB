<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import Header from '../header/Header.vue';
import ChartView from './ChartView.vue';
import MultiSelect from 'primevue/multiselect';
import api from '../auth/Api.js';

const results = ref([]);
const isLoading = ref(false);
const isError = ref(false);

const selectedX = ref(null);
const selectedR = ref(null);
const inputY = ref("");

const values = ['-2', '-1.5', '-1', '-0.5', '0', '0.5', '1', '1.5', '2'];
const errors = ref({ x: "", y: "", r: "" });

const lastR = computed(() => selectedR.value);

const fetchResults = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/results');
    results.value = response.data;
    isError.value = false;
  } catch (e) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const checkCoordinates = async (payload) => {
  try {
    await api.post('/results', payload);
  } catch (e) {
    console.error("Check failed", e);
  }
};

const handleClearTable = async () => {
  try {
    await api.delete('/results');
    await fetchResults();
  } catch (e) {
    console.error("Clear failed", e);
  }
};

const validate = () => {
  let isValid = true;
  errors.value = { x: "", y: "", r: "" };

  if (selectedX.value === null) {
    errors.value.x = "X must be selected";
    isValid = false;
  }

  const yNum = parseFloat(inputY.value.replace(',', '.'));
  if (isNaN(yNum) || yNum <= -3 || yNum >= 3) {
    errors.value.y = "Y must be in (-3; 3)";
    isValid = false;
  }

  if (selectedR.value === null) {
    errors.value.r = "R must be selected";
    isValid = false;
  }

  return isValid;
};

const onSubmit = async () => {
  if (!validate()) return;

  const y = inputY.value.replace(',', '.');

  await checkCoordinates({
    x: selectedX.value,
    y: y,
    r: selectedR.value
  });

  await fetchResults();
};

const handleClickChart = async (coordinate) => {
  if (selectedR.value === null) {
    errors.value.r = "Select R on the form first";
    return;
  }
  await checkCoordinates({ ...coordinate, r: selectedR.value });
  await fetchResults();
};

const xItems = [ -3, -2, -1, 0, 1, 2, 3, 4, 5 ].map(v => ({ label: v.toString(), value: v }));
const rItems = xItems;

const chartItems = computed(() => {
  return results.value
      .filter(res => parseFloat(res.r) === Number(lastR.value))
      .map(res => ({
        x: res.x,
        y: res.y,
        hit: res.hit
      }));
});

const formatTimestamp = (ts) => new Date(ts).toLocaleString();

onMounted(() => {
  fetchResults();
  window.addEventListener('focus', fetchResults);
});

onUnmounted(() => {
  window.removeEventListener('focus', fetchResults);
});
</script>

<template>
  <div class="main">
    <Header student-name="Leonteva Arina" />

    <h1 class="main__title">Web-programming, Lab №4</h1>

    <div class="main__row">
      <div class="main__left-block">

        <div class="graph">
          <div v-if="isLoading" class="loading-overlay">Loading...</div>
          <ChartView
              :width="300" :height="300"
              :min-x="-3" :max-x="3"  :min-y="-3" :max-y="3"
              :radius="Number(lastR) || 0"
              :items="chartItems"
              @on-click-chart="handleClickChart"
          />
        </div>

        <div class="form">
          <form @submit.prevent="onSubmit">
            <div class="form-inputs">

              <div class="form__row">
                <label class="form__label">Select X:</label>
                <div class="radio-group">
                  <div v-for="val in values" :key="'x'+val" class="radio-item">
                    <input type="radio" :id="'x'+val" :value="val" v-model="selectedX" name="x-radio" />
                    <label :for="'x'+val">{{ val }}</label>
                  </div>
                </div>
                <p v-if="errors.x" class="error">{{ errors.x }}</p>
              </div>

              <div class="form__row">
                <label class="form__label">Input Y (-3 ... 3):</label>
                <input v-model="inputY" type="text" placeholder="Value from -3 to 3" />
                <p v-if="errors.y" class="error">{{ errors.y }}</p>
              </div>

              <div class="form__row">
                <label class="form__label">Select R:</label>
                <div class="radio-group">
                  <div v-for="val in values" :key="'r'+val" class="radio-item">
                    <input type="radio" :id="'r'+val" :value="val" v-model="selectedR" name="r-radio" />
                    <label :for="'r'+val">{{ val }}</label>
                  </div>
                </div>
                <p v-if="errors.r" class="error">{{ errors.r }}</p>
              </div>
            </div>

            <div class="form__row form__btn-row">
              <button type="submit" class="btn-check">Check</button>
              <button type="button" @click="handleClearTable" class="btn-clear">Clear Table</button>
            </div>
          </form>
        </div>
      </div>

      <div class="main__table-block">
        <table v-if="results.length > 0">
          <thead>
          <tr>
            <th>X</th> <th>Y</th> <th>R</th> <th>Result</th> <th>Time</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="res in results" :key="res.id">
            <td>{{ res.x }}</td>
            <td>{{ res.y }}</td>
            <td>{{ res.r }}</td>
            <td :style="{ color: res.hit ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }">
              {{ res.hit ? 'HIT' : 'MISS' }}
            </td>
            <td>{{ res.currentTime }}</td>
          </tr>
          </tbody>
        </table>
        <div v-else-if="!isLoading" class="no-results">
          <p>No results yet. Try to check some coordinates!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.main {
  min-height: 100vh;
  width: 100vw;
  padding-top: 80px;
  background: url('/sail.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
}

.main__title {
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: rgba(0, 51, 102, 0.7);
  padding: 10px 30px;
  border-radius: 30px;
  border: 1px solid #d2b48c;
  margin-bottom: 20px;
}

.main__row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
  width: 95%;
  max-width: 1200px;
  padding-bottom: 40px;
}

.main__left-block {
  flex: 1;
  min-width: 320px;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.graph, .form, .main__table-block {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  border: 1px solid #d2b48c;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.graph {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form__label {
  display: block;
  color: #003366;
  font-weight: bold;
  margin-bottom: 10px;
}

.form__row {
  margin-bottom: 15px;
}

.radio-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #fdfaf5;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: #fdfaf5;
}

button {
  background-color: #003366;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  flex: 1;
}

button:hover {
  background-color: #004d99;
  transform: translateY(-2px);
}

button[type="button"] {
  background-color: #666;
}

.form__btn-row {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.main__table-block {
  flex: 2;
  min-width: 400px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #003366;
  color: #d2b48c;
  padding: 12px;
  text-align: left;
}

td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  color: #333;
}

tr:hover {
  background: rgba(210, 180, 140, 0.1);
}

.error {
  color: #cc0000;
  font-size: 0.8rem;
  margin-top: 5px;
}

@media (max-width: 900px) {
  .main__row {
    flex-direction: column;
    align-items: center;
  }
  .main__table-block {
    width: 100%;
    min-width: unset;
  }
}
</style>