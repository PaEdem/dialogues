<!-- \\src\views\Settings.vue -->
<template>
  <div class="settings-page">
    <header class="page-header">
      <h1 class="page-title">{{ $t('settings.title') }}</h1>
      <button
        @click="goBack"
        class="btn btn-action mobile-only btn-auto"
      >
        {{ $t('buttons.done') }}
      </button>
    </header>

    <main class="settings-content">
      <div class="settings-group">
        <h2 class="group-title">{{ $t('settings.appearance') }}</h2>
        <div class="setting-item">
          <label>{{ $t('settings.theme') }}</label>
          <div class="theme-switcher">
            <button
              @click="settingsStore.setTheme('light')"
              :class="{ active: settingsStore.theme === 'light' }"
            >
              <span class="material-symbols-outlined">light_mode</span>
              {{ $t('settings.light') }}
            </button>
            <button
              @click="settingsStore.setTheme('dark')"
              :class="{ active: settingsStore.theme === 'dark' }"
            >
              <span class="material-symbols-outlined">dark_mode</span>
              {{ $t('settings.dark') }}
            </button>
          </div>
        </div>
      </div>

      <div class="settings-group">
        <h2 class="group-title">{{ $t('settings.language') }}</h2>
        <div class="setting-item">
          <label for="ui-lang-select">{{ $t('settings.appLanguage') }}</label>
          <select
            id="ui-lang-select"
            v-model="uiLanguage"
          >
            <option
              v-for="lang in uiLanguages"
              :key="lang.code"
              :value="lang.code"
            >
              {{ lang.name }}
            </option>
          </select>
        </div>
        <div class="setting-item">
          <label for="learning-lang-select">{{ $t('settings.languageToLearn') }}</label>
          <select
            id="learning-lang-select"
            v-model="learningLanguage"
          >
            <option
              v-for="lang in learningLanguages"
              :key="lang"
              :value="lang"
            >
              {{ lang }}
            </option>
          </select>
        </div>
      </div>

      <div class="settings-group">
        <h2 class="group-title">
          {{ $t('settings.voiceSettings') }}
          <span
            v-if="!userStore.isPro"
            class="material-symbols-outlined pro"
            >crown</span
          >
        </h2>
        <div class="setting-item">
          <label for="voice-select">{{ $t('settings.voice') }}</label>
          <select
            id="voice-select"
            v-model="selectedVoice"
            :disabled="!userStore.isPro"
          >
            <option value="default">{{ $t('settings.defaultVoice') }}</option>
          </select>
        </div>
        <div class="setting-item">
          <label for="speed-slider">{{ $t('settings.speechRate') }}</label>
          <div class="slider-container">
            <input
              id="speed-slider"
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              v-model="speechRate"
              :disabled="!userStore.isPro"
            />
            <span>{{ speechRate }}x</span>
          </div>
        </div>
        <div class="setting-item">
          <label>{{ $t('settings.preListening') }}</label>
          <button
            class="btn btn-common btn-auto"
            @click="togglePlayTest"
          >
            <span class="material-symbols-outlined">play_circle</span>
            {{ $t('settings.test') }}
          </button>
        </div>
      </div>
    </main>

    <footer class="page-footer desktop-only">
      <button
        @click="goBack"
        class="btn btn-action btn-desktop-auto"
      >
        {{ $t('buttons.done') }}
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

const settingsStore = useSettingsStore();
const userStore = useUserStore();
const router = useRouter();

const uiLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
];

const learningLanguages = [
  'English',
  'Español',
  'Français',
  'Deutsch',
  'Italiano',
  'Русский',
  'Português',
  'Nederlands',
  'Svenska',
  'Polski',
  'Українська',
  'Čeština',
  'Magyar',
  'Suomi',
  'Norsk',
  'Dansk',
  'Română',
  'Hrvatski',
  'Slovenčina',
];

// --- "Умные" computed свойства для v-model ---
const uiLanguage = computed({
  get: () => settingsStore.uiLanguage,
  set: (value) => settingsStore.setUiLanguage(value),
});
const learningLanguage = computed({
  get: () => settingsStore.learningLanguage,
  set: (value) => settingsStore.setLearningLanguage(value),
});

const selectedVoice = ref('default');
const speechRate = ref(1.0);

const togglePlayTest = () => {
  console.log('PLAY / STOP профессиональная озвучка');
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.settings-page {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.page-title {
  font-size: var(--xxl);
  font-family: 'Roboto Condensed', sans-serif;
  color: var(--text-head);
  margin: 0;
}
.desktop-only {
  display: none;
}
.mobile-only {
  display: inline-flex;
}
.settings-content {
  display: flex;
  flex-direction: column;
}
.settings-group {
  padding: 1rem 0;
}
.group-title {
  font-size: var(--sm);
  font-weight: 700;
  color: var(--text-base);
  text-align: center;
  text-transform: uppercase;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}
.group-title .pro {
  font-size: 1rem;
  color: var(--bg-pro);
  vertical-align: middle;
  margin-left: 0.5rem;
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.5rem;
}
.setting-item label {
  font-size: var(--lg);
  color: var(--text-title);
}
select {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background-color: var(--bg-group);
  color: var(--base);
}
.theme-switcher {
  display: flex;
  border-radius: 8px;
  background-color: var(--bg-group);
  padding: 0.25rem;
  gap: 0.35rem;
}
.theme-switcher button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: var(--base);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.theme-switcher button.active {
  background-color: var(--bg-main);
  color: var(--y3);
  box-shadow: 0 1px 3px var(--shadow);
}
.slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.slider-container span {
  font-size: var(--sm);
  color: var(--text-base);
  min-width: 30px;
}
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 150px;
  height: 8px;
  background: var(--bg-group);
  border-radius: 5px;
  border: 1px solid var(--border);
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--g3);
  cursor: pointer;
  border-radius: 50%;
}
input[type='range']::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--g3);
  cursor: pointer;
  border-radius: 50%;
}
.setting-item *:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.setting-item *:disabled::-webkit-slider-thumb {
  background: var(--text-base);
}
.setting-item *:disabled::-moz-range-thumb {
  background: var(--text-base);
}
.btn-auto {
  width: auto;
}
@media (min-width: 768px) {
  .settings-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 2rem;
  }
  .mobile-only {
    display: none;
  }
  .desktop-only {
    display: flex;
  }
  .settings-content {
    flex-grow: 1;
    overflow-y: auto;
    padding-right: 1rem;
  }
  .page-footer {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }
  .btn-desktop-auto {
    width: 30%;
  }
}
</style>
