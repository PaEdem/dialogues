<!-- \\src\views\Welcome.vue -->
<template>
  <div class="page">
    <div class="page-container">
      <div class="page-info">
        <div class="page-info-subtitle subtitle">{{ $t('welcome.subtitle') }}</div>
        <div class="page-info-title title">{{ $t('welcome.title') }}</div>
        <div class="page-info-text text">
          {{ $t('welcome.text1') }}
          <hr />
          {{ $t('welcome.text2') }}
          <hr />
          {{ $t('welcome.text3') }}
        </div>
        <div class="btn-container">
          <select v-model="uiLanguage">
            <option
              v-for="lang in uiLanguages"
              :key="lang.code"
              :value="lang.code"
            >
              {{ lang.name }}
            </option>
          </select>
          <router-link
            to="/auth"
            class="btn btn-action"
          >
            <span class="material-symbols-outlined">account_circle</span>
            {{ $t('buttons.done') }}
          </router-link>
        </div>
      </div>
      <div class="page-image">
        <img
          class="image"
          src="../assets/wordcloud.png"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';
const settingsStore = useSettingsStore();

const uiLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
];

const uiLanguage = computed({
  get: () => settingsStore.uiLanguage,
  set: (value) => settingsStore.setUiLanguage(value),
});
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--bg-card);
}
.page-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 2rem;
}
.page-info-title {
  font-size: var(--xxxl);
  line-height: 1.2;
  margin: 1.5rem 0;
  color: var(--text-head);
}
.page-info-subtitle {
  font-size: var(--xl);
  color: var(--text-title);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: right;
}
.page-info-text {
  font-size: var(--base);
  line-height: 1.6;
  color: var(--text-title);
  margin-bottom: 2rem;
  text-align: center;
}
.btn-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.image {
  width: 100%;
  height: auto;
}
select {
  width: 150px;
  height: 50px;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--g3);
  background-color: var(--g1);
  font-size: var(--base);
  color: var(--g3);
}
@media (min-width: 992px) {
  .page-container {
    flex-direction: row;
    align-items: center;
    max-width: 1200px;
    text-align: left;
  }
  .page-info {
    width: 50%;
    align-items: flex-start;
  }
  .btn-container {
    justify-content: space-between;
  }
  .page-image {
    -webkit-box-flex: auto;
    -ms-flex: auto;
    flex: auto;
    width: 200px;
    margin: 0.5vw;
  }
  .page-info-title {
    font-size: 3rem;
  }
  .page-info-text {
    font-size: var(--lg);
  }
}
</style>
