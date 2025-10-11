<!-- src\components\DialogLayout.vue -->
<template>
  <div
    class="dialog-layout"
    v-if="dialog"
  >
    <aside class="sidebar">
      <div class="buttons-wrapper">
        <router-link
          to="/dialogs"
          class="btn btn-common"
        >
          <span class="material-symbols-outlined">arrow_back_ios</span>
          {{ $t('buttons.dialogList') }}
        </router-link>
      </div>

      <slot name="sidebar-content"></slot>
    </aside>

    <main class="content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDialogStore } from '../stores/dialogStore';

const dialogStore = useDialogStore();
const dialog = computed(() => dialogStore.currentDialog);
</script>

<style scoped>
/* 1. Стили для МОБИЛЬНЫХ УСТРОЙСТВ */
.dialog-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.sidebar {
  width: 100%;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg-side);
  flex-shrink: 0;
}
.dialog-title-wrapper {
  display: flex;
  align-items: center;
  text-align: center;
}
.back-link {
  color: var(--text-title);
  text-decoration: none;
  margin-right: 0.5rem;
}
.dialog-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-head);
  flex-grow: 1;
}
.content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* 2. Улучшения для ПЛАНШЕТОВ И БОЛЬШЕ */
@media (min-width: 768px) {
  .dialog-layout {
    flex-direction: row;
  }
  .sidebar {
    width: 320px;
    height: 100%;
    border-bottom: none;
    border-right: 1px solid var(--border);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .buttons-wrapper {
    margin-bottom: 2rem;
  }
  .content {
    padding: 2rem;
  }
  .dialog-title {
    font-size: 1.4rem;
  }
  .dialog-title-wrapper {
    margin-bottom: 1.5rem;
  }
}
</style>
