// src/composables/usePermissions.js
import { useUserStore } from '../stores/userStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useDialogStore } from '../stores/dialogStore';

export function usePermissions() {
  const userStore = useUserStore();
  const settingsStore = useSettingsStore();
  const dialogStore = useDialogStore();

  const can = (feature) => {
    // PRO-пользователям можно всё
    if (userStore.isPro) {
      return true;
    }
    // Правила для Free-пользователей
    switch (feature) {
      case 'useAdvancedTraining':
      case 'useDialogAnalysis':
      case 'useCloudTTS':
        return false;
      case 'generateDialog': {
        const limits = userStore.planLimits;
        const dailyCount = userStore.dailyGenerationsCount;
        const totalCount = dialogStore.allDialogs.length;

        if (dailyCount >= limits.dailyGenerations) {
          alert(`Дневной лимит генераций (${limits.dailyGenerations}) исчерпан.`);
          return false;
        }
        if (totalCount >= limits.totalDialogs) {
          alert(`Достигнут лимит диалогов (${limits.totalDialogs}).`);
          return false;
        }
        return true;
      }

      default:
        return true;
    }
  };

  const isButtonActive = (feature) => {
    if (can(feature)) return true;
    // Для PRO-функций, которые нельзя использовать, проверяем превью
    if (['useAdvancedTraining', 'useDialogAnalysis', 'useCloudTTS'].includes(feature)) {
      return !settingsStore.dailyPreviewUsed;
    }
    return false;
  };

  return { can, isButtonActive };
}
