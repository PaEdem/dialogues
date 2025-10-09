// src/stores/settingsStore.js
import { defineStore } from 'pinia';
import i18n from '../i18n';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    uiLanguage: 'en',
    learningLanguage: 'Finnish',
    limit: {
      useProMode: 2,
      dailyGenerations: 2,
      totalDialogs: 6,
    },
    dailyPreviewCount: 0,
    dailyGenerationCount: 0,
  }),
  getters: {
    dailyCount: () => {
      const newUsage = {
        countView: 0,
        countNew: 0,
        date: new Date().toDateString(),
      };
      const usageFromLS = JSON.parse(localStorage.getItem('usage'));
      const today = new Date().toDateString();

      if (usageFromLS.date !== today) {
        return newUsage;
      } else {
        return usageFromLS;
      }
    },
  },
  actions: {
    setTheme(newTheme) {
      this.theme = newTheme;
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('app-theme', newTheme);
    },
    setUiLanguage(lang) {
      this.uiLanguage = lang;
      i18n.global.locale.value = lang;
      localStorage.setItem('app-ui-language', lang);
    },
    setLearningLanguage(lang) {
      this.learningLanguage = lang;
      localStorage.setItem('app-learning-language', lang);
    },
    incrementCount(type) {
      // 1. Получаем существующие данные
      const usageJSON = localStorage.getItem('usage');
      let usage;

      if (usageJSON) {
        usage = JSON.parse(usageJSON);
      } else {
        // Если данных нет, начинаем с базового объекта
        usage = {
          countView: 0,
          countNew: 0,
          date: null,
        };
      }

      // 2. Обновляем нужные свойства в JavaScript-объекте
      usage.date = new Date().toDateString();
      if (type === 'view') {
        this.dailyPreviewCount++;
        usage.countView = this.dailyPreviewCount;
      }
      if (type === 'new') {
        this.dailyGenerationCount++;
        usage.countNew = this.dailyGenerationCount;
      }

      // 3. Преобразуем измененный объект обратно в строку
      const updatedUsageJSON = JSON.stringify(usage);

      // 4. Сохраняем (перезаписываем) обновленную строку
      localStorage.setItem('usage', updatedUsageJSON);
      console.log('Объект usage обновлен и сохранен');
    },
    initSettings() {
      // ЗАГРУЗКИ ТЕМЫ
      const savedTheme = localStorage.getItem('app-theme');
      this.setTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
      // ЗАГРУЗКИ ЯЗЫКОВ
      const savedUiLang = localStorage.getItem('app-ui-language');
      this.setUiLanguage(savedUiLang || 'en');
      const savedLearningLang = localStorage.getItem('app-learning-language');
      if (savedLearningLang) {
        this.setLearningLanguage(savedLearningLang);
      }
      // ЛОГИКА ЗАГРУЗКИ СЧЁТЧИКОВ
      const savedUsage = JSON.parse(localStorage.getItem('usage'));
      if (savedUsage && savedUsage.date === new Date().toDateString()) {
        // Если есть запись за сегодня, загружаем счётчики
        this.dailyPreviewCount = savedUsage.countView;
        this.dailyGenerationCount = savedUsage.countNew;
      } else {
        // Если новый день или нет записи, счётчик равен 0
        this.dailyPreviewCount = 0;
        this.dailyGenerationCount = 0;
      }
    },
  },
});
