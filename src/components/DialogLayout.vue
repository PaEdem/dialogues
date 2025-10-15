<!-- src\components\DialogLayout.vue -->
<template>
  <div
    class="dialog-layout"
    v-if="dialog"
  >
    <aside class="sidebar">
      <router-link
        to="/dialogs"
        class="btn btn-common back-link"
      >
        <span class="material-symbols-outlined">arrow_back_ios</span>
        {{ $t('buttons.dialogList') }}
      </router-link>
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
  padding: var(--y-05) var(--x-10);
  border-bottom: 1px solid var(--border);
  background-color: var(--bg-side);
  flex-shrink: 0;
  overflow-y: auto;
}
.dialog-title-wrapper {
  display: flex;
  align-items: center;
  text-align: center;
}
.back-link {
  margin-bottom: var(--y-10);
}
.dialog-title {
  font-size: var(--lg);
  font-weight: 700;
  color: var(--text-head);
  flex-grow: 1;
}
.content {
  flex: 1;
  overflow-y: auto;
  padding: var(--y-10) var(--x-10);
  min-height: 0;
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
    height: 100vh;
    overflow-y: auto;
  }
  .sidebar {
    width: 320px;
    min-height: 100%;
    border-bottom: none;
    border-right: 1px solid var(--border);
    padding: var(--y-15) var(--x-15);
    display: flex;
    flex-direction: column;
    gap: var(--y-05);
  }
  .content {
    padding: var(--y-20) var(--x-20);
    overflow-y: auto;
  }
  .dialog-title {
    font-size: var(--xxl);
  }
  .dialog-title-wrapper {
    margin-bottom: var(--y-15);
  }
}
</style>
