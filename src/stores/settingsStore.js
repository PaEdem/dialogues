// src/stores/settingsStore.js
import { defineStore } from 'pinia';
import i18n from '../i18n';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    uiLanguage: 'en',
    learningLanguage: 'Finnish',
    dailyPreviewUsed: false,
  }),
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
    markDailyPreviewAsUsed() {
      this.dailyPreviewUsed = true;
      localStorage.setItem('previewUsedDate', new Date().toDateString());
    },
    initSettings() {
      const savedTheme = localStorage.getItem('app-theme');
      this.setTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

      const savedUiLang = localStorage.getItem('app-ui-language');
      this.setUiLanguage(savedUiLang || 'en');

      const savedLearningLang = localStorage.getItem('app-learning-language');
      if (savedLearningLang) {
        this.setLearningLanguage(savedLearningLang);
      }

      const savedPreviewDate = localStorage.getItem('previewUsedDate');
      if (savedPreviewDate === new Date().toDateString()) {
        this.dailyPreviewUsed = true;
      }
    },
  },
});
