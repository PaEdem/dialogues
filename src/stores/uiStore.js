//src/stores/uiStore.js
import { defineStore } from 'pinia';
import { useDialogStore } from './dialogStore';
import { useUserStore } from './userStore';
import { useTrainingStore } from './trainingStore';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isModalActive: false,
    modalContent: 'default', // 'default', 'upgrade', 'analysis'
    toasts: [],
    toastIdCounter: 0,
  }),
  actions: {
    showModal(content = 'default') {
      this.modalContent = content;
      this.isModalActive = true;
    },
    showUpgradeModal() {
      this.showModal('upgrade');
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
