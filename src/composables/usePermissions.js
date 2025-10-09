// src/composables/usePermissions.js
import { computed } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useDialogStore } from '../stores/dialogStore';
import { useUiStore } from '../stores/uiStore';

export function usePermissions() {
  const userStore = useUserStore();
  const settingsStore = useSettingsStore();
  const dialogStore = useDialogStore();
  const uiStore = useUiStore();

  // для блокировки кнопки NEW DIALOG
  const canGenerate = computed(() => {
    if (userStore.isPro) return true;
    const limit = settingsStore.limit;
    const dailyCount = settingsStore.dailyCount.countNew;
    const totalCount = dialogStore.allDialogs.length;
    return dailyCount <= limit.dailyGenerations && totalCount <= limit.totalDialogs;
  });

  const can = () => {
    if (userStore.isPro) {
      return true;
    } else {
      return false;
    }
  };

  const isButtonActive = () => {
    if (!userStore.isPro) {
      return settingsStore.dailyCount.countView <= settingsStore.limit.useProMode;
    } else {
      return true;
    }
  };

  return { can, canGenerate, isButtonActive };
}
