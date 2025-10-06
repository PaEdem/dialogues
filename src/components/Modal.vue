<!-- \\src\components\Modal.vue -->
<template>
  <Transition name="modal">
    <div
      v-if="uiStore.isModalActive"
      class="modal-mask"
      @click.self="uiStore.hideModal()"
    >
      <div class="modal-container">
        <div
          class="modal-header"
          v-if="$slots.header"
        >
          <slot name="header"></slot>
        </div>

        <div class="modal-body">
          <slot></slot>
        </div>

        <div
          class="modal-footer"
          v-if="$slots.footer"
        >
          <slot name="footer"></slot>
        </div>

        <div
          v-else
          class="modal-footer"
        >
          <button
            class="btn btn-common btn-modal"
            @click="uiStore.hideModal()"
          >
            <span class="material-symbols-outlined">close</span>
            Sulje
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useUiStore } from '../stores/uiStore';
const uiStore = useUiStore();
</script>

<style>
/* Общие стили */
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 900;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  transition: opacity 0.3s ease;
}
.modal-container {
  width: 100%;
  max-width: 1024px;
  margin: auto;
  background-color: var(--bg-main);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--shadow);
  transition: all 0.3s ease;

  /* Структура для контента */
  display: flex;
  flex-direction: column;
  max-height: 90vh; /* Максимальная высота */
}
.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.modal-header .title {
  font-size: var(-xl);
  color: var(--text-head);
  margin: 0;
}
.modal-body {
  overflow-y: auto;
  padding: 1.5rem;
  flex-grow: 1;
}
.modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  box-shadow: 0 -4px 8px var(--shadow);
  flex-shrink: 0;
}
.modal-footer .btn.btn-modal {
  width: 240px;
}
/* Стили для контента, генерируемого v-html */
.modal-body h3 {
  font-size: var(--lg);
  color: var(--g3);
  text-align: center;
  margin: 1rem 0;
}
.modal-body ul {
  list-style-type: none;
  padding-left: 0.5rem;
}
.modal-body ul li {
  font-size: var(--base);
  color: var(--text-base);
  font-style: italic;
  margin-bottom: 0.25rem;
}
.modal-body li code,
.modal-body li strong code {
  font-family: 'Open Sans', 'Roboto', 'Segoe UI', sans-serif !important;
  font-weight: 600;
  color: var(--g3);
}
.modal-body li strong {
  font-family: 'Open Sans', 'Roboto', 'Segoe UI', sans-serif !important;
  font-weight: 700;
  color: var(--r3);
}
.modal-info ul li ul li {
  padding-left: 1rem;
}
/*
.ohi {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.ohi-title {
  font-size: var(--xxl);
  padding-top: 2rem;
  text-align: center;
  margin: 0 auto;
  color: var(--r3);
}
.ohi-message {
  font-size: var(--xl);
  text-align: center;
  padding: 2rem;
  color: var(--text-head);
} */
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
