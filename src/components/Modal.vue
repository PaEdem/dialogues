<!-- \\src\components\Modal.vue -->
<template>
  <Transition name="modal">
    <div
      v-if="uiStore.isModalActive"
      class="modal-mask"
      @click.self="uiStore.hideModal()"
    >
      <div class="modal-container">
        <div class="modal-body">
          <div class="modal-info">
            <slot></slot>
          </div>
        </div>

        <div class="modal-footer">
          <div class="grow"></div>
          <button
            class="btn grey"
            @click="uiStore.hideModal()"
          >
            <span class="material-symbols-outlined icon">close</span>
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

<!-- <style>
.modal-mask {
  position: fixed;
  z-index: 900;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}
.modal-container {
  flex: 0 1 70%;
  min-width: 960px;
  margin: auto;
  padding: 1rem;
  background-color: var(--grey-95);
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  transition: all 0.3s ease;
}
.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 0.5rem 0 1rem;
}
.modal-info h3 {
  font-size: var(--subtitle);
  color: var(--tiffany-20);
  text-align: center;
}
.modal-info ul {
  padding: 0.5rem 0 1rem;
}
.modal-info ul li {
  font-size: var(--text);
  color: var(--winkle-20);
  font-style: italic;
  margin-bottom: 0.25rem;
}
.modal-info li::marker {
  content: '';
}
.modal-info li strong,
.modal-info li code,
.modal-info li strong code {
  font-family: 'Roboto Condensed', 'Open Sans', 'Roboto', 'Segoe UI', sans-serif !important;
  font-weight: 500;
  color: var(--red-30);
}
.modal-info ul li ul li {
  padding-left: 1rem;
}
.ohi {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.ohi-title {
  font-size: var(--title);
  padding-top: 2rem;
  text-align: center;
  margin: 0 auto;
  color: var(--red-20);
}
.ohi-message {
  font-size: var(--subtitle);
  text-align: center;
  padding: 2rem;
  margin: 0 auto;
  color: var(--red-20);
}
.modal-footer {
  display: flex;
  padding: 0 2rem;
}
.modal-enter-from {
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style> -->

<style>
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 900;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem; /* Отступы для мобильных */
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 100%;
  max-width: 800px; /* Максимальная ширина на десктопах */
  margin: auto;
  background-color: var(--color-bg-main);
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  /* Структура для контента */
  display: flex;
  flex-direction: column;
  max-height: 90vh; /* Максимальная высота */
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0; /* Шапка не сжимается */
}
.modal-header .title {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
  margin: 0;
}

.modal-body {
  overflow-y: auto;
  padding: 1.5rem; /* Отступы вокруг контента */
  flex-grow: 1; /* Тело занимает все доступное место */
}

.modal-footer {
  display: flex;
  justify-content: flex-end; /* Кнопка справа */
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  flex-shrink: 0; /* Футер не сжимается */
}

/* Стили для контента, генерируемого v-html */
.modal-info h3 {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.modal-info ul {
  list-style-type: none;
  padding-left: 0.5rem;
}

.modal-info ul li {
  font-size: var(--text);
  color: var(--winkle-20);
  font-style: italic;
  margin-bottom: 0.25rem;
}
.modal-info li::marker {
  content: '';
}
.modal-info li strong,
.modal-info li code,
.modal-info li strong code {
  font-family: 'Roboto Condensed', 'Open Sans', 'Roboto', 'Segoe UI', sans-serif !important;
  font-weight: 500;
  color: var(--red-30);
}
.modal-info ul li ul li {
  padding-left: 1rem;
}

.ohi {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.ohi-title {
  font-size: var(--title);
  padding-top: 2rem;
  text-align: center;
  margin: 0 auto;
  color: var(--red-20);
}

.ohi-message {
  font-size: var(--font-size-xl);
  text-align: center;
  padding: 2rem;
  color: var(--color-text-primary);
}

/* Анимации (без изменений) */
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
