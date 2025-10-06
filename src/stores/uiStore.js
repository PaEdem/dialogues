//src/stores/uiStore.js
import { defineStore } from 'pinia';
import { useDialogStore } from './dialogStore';
import { useUserStore } from './userStore';
import { useTrainingStore } from './trainingStore';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isModalActive: false,
    toasts: [],
    toastIdCounter: 0,
  }),
  getters: {
    isAppLoading() {
      const dialogStore = useDialogStore();
      const userStore = useUserStore();
      const trainingStore = useTrainingStore();

      return dialogStore.isLoading || userStore.isLoading || trainingStore.isLoading;
    },
  },
  actions: {
    showModal() {
      this.isModalActive = true;
    },
    hideModal() {
      this.isModalActive = false;
    },
    showToast(message, type = 'info') {
      const id = this.toastIdCounter++;
      this.toasts.push({ id, message, type });

      setTimeout(() => {
        this.toasts = this.toasts.filter((toast) => toast.id !== id);
      }, 5000);
    },
  },
});
