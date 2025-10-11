<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        :class="`toast toast--${toast.type}`"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useUiStore } from '../stores/uiStore';
const uiStore = useUiStore();
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.toast {
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  color: var(--text-head);
  font-weight: 500;
  box-shadow: 0 4px 12px var(--shadow);
  transition: all 0.3s ease;
}
.toast--info {
  background-color: var(--bg-t-info);
}
.toast--success {
  background-color: var(--bg-t-success);
}
.toast--warning {
  background-color: var(--bg-t-warning);
  color: var(--r3);
}
.toast--error {
  background-color: var(--bg-t-error);
}

/* Анимации */
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-active {
  position: absolute; /* Чтобы элементы под ним плавно подтягивались */
}
</style>
