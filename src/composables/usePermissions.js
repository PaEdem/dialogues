// src/composables/usePermissions.js
import { useUserStore } from '../stores/userStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useDialogStore } from '../stores/dialogStore';
import { useUiStore } from '../stores/uiStore';

export function usePermissions() {
  const userStore = useUserStore();
  const settingsStore = useSettingsStore();
  const dialogStore = useDialogStore();
  const uiStore = useUiStore();

  // Устанавливаем лимит "пробных кликов"
  const PREVIEW_LIMIT = 2;

  // const can = (feature) => {
  //   // PRO-пользователям можно всё
  //   if (userStore.isPro) {
  //     return true;
  //   }
  //   // Правила для Free-пользователей
  //   switch (feature) {
  //     case 'useAdvancedTraining':
  //     case 'useDialogAnalysis':
  //     case 'useCloudTTS':
  //       return false;
  //     case 'generateDialog': {
  //       const limits = userStore.planLimits;
  //       const dailyCount = userStore.dailyGenerationsCount;
  //       const totalCount = dialogStore.allDialogs.length;

  //       if (dailyCount >= limits.dailyGenerations) {
  //         uiStore.showToast(`Дневной лимит генераций (${limits.dailyGenerations}) исчерпан.`, 'warning');
  //         return false;
  //       }
  //       if (totalCount >= limits.totalDialogs) {
  //         uiStore.showToast(`Достигнут лимит диалогов (${limits.totalDialogs}).`, 'warning');
  //         return false;
  //       }
  //       return true;
  //     }

  //     default:
  //       return true;
  //   }
  // };

  // const isButtonActive = (feature) => {
  //   if (can(feature)) return true;
  //   // Для платных функций проверяем, не исчерпан ли лимит
  //   if (['useAdvancedTraining', 'useDialogAnalysis', 'useCloudTTS'].includes(feature)) {
  //     return settingsStore.dailyPreviewCount <= PREVIEW_LIMIT;
  //   }
  //   return false;
  // };

  const can = (feature) => {
    // PRO-пользователям можно всё
    if (userStore.isPro) {
      return true;
    }
    // Правила для Free-пользователей
    if (feature === 'generateDialog') {
      const limits = userStore.planLimits;
      const dailyCount = userStore.dailyGenerationsCount;
      const totalCount = dialogStore.allDialogs.length;

      if (dailyCount >= limits.dailyGenerations) {
        uiStore.showToast(`Дневной лимит генераций (${limits.dailyGenerations}) исчерпан.`, 'warning');
        return false;
      }
      if (totalCount >= limits.totalDialogs) {
        uiStore.showToast(`Достигнут лимит диалогов (${limits.totalDialogs}).`, 'warning');
        return false;
      }
      return true;
    }
  };

  const isButtonActive = () => {
    if (!userStore.isPro) {
      console.log('settingsStore.dailyPreviewCount =', settingsStore.dailyPreviewCount);
      return settingsStore.dailyPreviewCount <= PREVIEW_LIMIT;
    } else {
      return true;
    }
  };

  return { can, isButtonActive, PREVIEW_LIMIT };
}
