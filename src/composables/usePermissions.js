// src/composables/usePermissions.js
import { useUserStore } from '../stores/userStore';
// import { useDialogStore } from '../stores/dialogStore';

export function usePermissions() {
  const userStore = useUserStore();
  // const dialogStore = useDialogStore();

  const can = (feature) => {
    if (userStore.isPro) {
      return true; // PRO-пользователям можно всё
    }

    // Правила для Free-пользователей
    switch (feature) {
      case 'useAdvancedTraining': // Level 2, 3
      case 'useDialogAnalysis': // Анализ диалога
        return false;

      // ✨ 2. ДОБАВЛЯЕМ ЛОГИКУ ПРОВЕРКИ ЛИМИТОВ
      case 'generateDialog': {
        const usage = userStore.dailyUsage;
        const dailyLimitReached = usage.daily.count >= usage.daily.limit;
        const totalLimitReached = usage.total.count >= usage.total.limit;

        if (dailyLimitReached) {
          alert(`Вы достигли дневного лимита генераций (${usage.daily.limit}). Возвращайтесь завтра!`);
          return false;
        }
        if (totalLimitReached) {
          alert(
            `Вы достигли лимита на общее количество диалогов (${usage.total.limit}). Удалите старый диалог, чтобы создать новый, или перейдите на PRO.`
          );
          return false;
        }
        return true; // Если лимиты не достигнуты
      }

      default:
        return true; // Все остальные функции разрешены
    }
  };

  return { can };
}
