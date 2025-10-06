<!-- src\views\AllDialogs.vue -->
<template>
  <div class="page-wrapper">
    <aside class="desktop-sidebar">
      <h1 class="sidebar-title">Dialogit</h1>
      <router-link
        :to="{ name: 'new-dialog' }"
        class="btn btn-action"
      >
        <span class="material-symbols-outlined">add</span>
        {{ $t('all.createNew') }}
      </router-link>
      <div class="grow"></div>
      <div class="user-profile">
        <router-link
          to="/profile"
          class="btn btn-common"
        >
          <span class="material-symbols-outlined">person</span>
          <span>{{ $t('all.profile') }}</span>
        </router-link>
        <router-link
          to="/settings"
          class="btn btn-common"
        >
          <span class="material-symbols-outlined">settings</span>
          <span>{{ $t('all.settings') }}</span>
        </router-link>
      </div>
    </aside>

    <header class="mobile-header">
      <h1 class="header-title">Dialogit</h1>
      <router-link
        :to="{ name: 'new-dialog' }"
        class="btn btn-action btn--icon-only"
        aria-label="Luo uusi dialogi"
      >
        <span class="material-symbols-outlined">add</span>
      </router-link>
    </header>

    <main class="content">
      <div v-if="dialogStore.isLoading"><Loader /></div>
      <div
        v-else-if="dialogs.length > 0"
        class="dialogs-grid"
      >
        <div
          v-if="!userStore.isPro"
          class="usage-indicator"
        >
          <div class="usage-text">
            <span>{{ $t('all.savedDialogs') }}</span>
            <span>{{ usage.total.count }} / {{ usage.total.limit }}</span>
          </div>
          <progress
            class="usage-progress"
            :value="usage.total.count"
            :max="usage.total.limit"
          ></progress>
        </div>
        <template
          v-for="level in levels"
          :key="level"
        >
          <div v-if="groupedDialogs[level].length > 0">
            <h2 class="level-title">{{ level }}</h2>
            <div class="dialogs-list">
              <DialogCard
                v-for="dialog in groupedDialogs[level]"
                :key="dialog.id"
                :dialog="dialog"
              />
            </div>
          </div>
        </template>
      </div>
      <div
        v-else-if="!dialogStore.isLoading"
        class="message-container"
      >
        <p class="message-text">{{ $t('all.notDialogs') }}</p>
        <router-link
          :to="{ name: 'new-dialog' }"
          class="btn btn-action"
        >
          <span class="material-symbols-outlined">add</span>
          {{ $t('all.createFirst') }}
        </router-link>
      </div>
    </main>

    <footer class="mobile-footer">
      <div class="tab-bar">
        <router-link
          to="/settings"
          class="tab-item"
        >
          <span class="material-symbols-outlined">settings</span>
          <span>{{ $t('all.settings') }}</span>
        </router-link>
        <router-link
          to="/profile"
          class="tab-item"
        >
          <span class="material-symbols-outlined">person</span>
          <span>{{ $t('all.profile') }}</span>
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useDialogStore } from '../stores/dialogStore';
import { useUserStore } from '../stores/userStore';
import DialogCard from '../components/DialogCard.vue';
import Loader from '../components/Loader.vue';

const dialogStore = useDialogStore();
const userStore = useUserStore();

const levels = ['A1', 'A2.1', 'A2.2', 'B1.1', 'B1.2', 'B2.1', 'B2.2', 'C1.1', 'C1.2'];
const dialogs = computed(() => dialogStore.allDialogs);

const usage = computed(() => {
  return {
    total: {
      count: dialogStore.allDialogs.length,
      limit: userStore.planLimits.totalDialogs,
    },
  };
});

const groupedDialogs = computed(() => {
  const groups = {};
  levels.forEach((level) => {
    groups[level] = dialogs.value.filter((d) => d.level === level);
  });
  return groups;
});

onMounted(() => {
  if (dialogStore.allDialogs.length === 0) {
    dialogStore.fetchAllDialogs();
  }
});
</script>

<style scoped>
/* ============================================= */
/* 1. СТИЛИ ДЛЯ МОБИЛЬНЫХ (по умолчанию) */
/* ============================================= */
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Fallback для старых браузеров */
  overflow: hidden;
  background-color: var(--bg-main);
}
.desktop-sidebar {
  display: none;
}
/* Мобильная шапка */
.mobile-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--bg-side);
  border-bottom: 1px solid var(--border);
}
.header-title {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: var(--xl);
  font-weight: 700;
  color: var(--text-head);
}
.btn--icon-only {
  padding: 0.5rem;
  border-radius: 50%;
  line-height: 1;
}
.btn--icon-only .material-symbols-outlined {
  margin-right: 0;
}
/* Основной контент */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}
.level-title {
  font-size: var(--sm);
  font-weight: 700;
  color: var(--text-title);
  text-transform: uppercase;
  margin: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}
.dialogs-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
/* Мобильный футер */
.mobile-footer {
  flex-shrink: 0;
}
.tab-bar {
  display: flex;
  justify-content: space-around;
  background-color: var(--bg-side);
  border-top: 1px solid var(--border);
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  color: var(--text-head);
  font-size: 0.7rem;
}
.message-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.message-text {
  font-size: var(--base);
  font-weight: 700;
  color: var(--text-head);
  margin-top: 5rem;
  margin-bottom: 2rem;
}
.usage-indicator {
  margin-bottom: 2rem;
}
.usage-text {
  display: flex;
  justify-content: space-between;
  font-size: var(--sm);
  color: var(--text-title);
  margin-bottom: 0.5rem;
}
.usage-progress {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
}
.usage-progress::-webkit-progress-bar {
  background-color: var(--bg-group);
  border-radius: 4px;
}
.usage-progress::-webkit-progress-value {
  background-color: var(--y5);
  border-radius: 4px;
  transition: width 0.3s ease;
}
/* ============================================= */
/* 2. СТИЛИ ДЛЯ ПЛАНШЕТОВ И ДЕСКТОПОВ */
/* ============================================= */
@media (min-width: 768px) {
  .page-wrapper {
    flex-direction: row;
    height: auto;
    min-height: 100vh;
  }

  /* Включаем десктопный сайдбар */
  .desktop-sidebar {
    display: flex;
    flex-direction: column;
    width: 280px;
    flex-shrink: 0;
    padding: 2rem 1.5rem;
    background: var(--bg-side);
    border-right: 1px solid var(--border);
    gap: 1.5rem;
    height: 100vh;
    position: sticky; /* Приклеиваем сайдбар при скролле страницы */
    top: 0;
  }
  .sidebar-title {
    font-size: var(-xxl);
    color: var(--text-head);
    text-align: center;
    margin-bottom: 1rem;
  }
  .user-profile {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  /* Выключаем мобильные элементы */
  .mobile-header,
  .mobile-footer {
    display: none;
  }

  .content {
    padding: 2rem;
    overflow-y: visible;
  }
  .dialogs-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}
</style>
