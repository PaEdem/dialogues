<!-- \\src\components\Modal.vue -->
<template>
  <Transition name="modal">
    <div
      v-if="uiStore.isModalActive"
      class="modal-mask"
      @click.self="uiStore.hideModal()"
    >
      <div
        class="modal-container"
        :class="{
          analysis: uiStore.modalContent === 'analysis',
          upgrade: uiStore.modalContent === 'upgrade',
          default: uiStore.modalContent === 'default',
        }"
      >
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
          :class="{ 'footer-analysis': uiStore.modalContent !== 'analysis' }"
          v-if="$slots.footer"
        >
          <slot name="footer"></slot>
        </div>

        <div
          v-else
          class="modal-footer"
        >
          <button
            class="btn btn-common w-150"
            @click="uiStore.hideModal()"
          >
            <span class="material-symbols-outlined">close</span>
            {{ $t('buttons.close') }}
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
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 900;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
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
  max-height: 90vh;
}
.modal-container.default {
  max-width: 640px;
  background: var(--bg-main);
}
.modal-container.analysis {
  max-width: 1024px;
  background: var(--bg-main);
}
.modal-container.upgrade {
  max-width: 640px;
  background: var(--gradient-pro);
}
.modal-header {
  padding: 16px 0;
  flex-shrink: 0;
}
.modal-header .title {
  font-size: var(--xxl);
  color: var(--text-head);
  margin: 0;
  text-align: center;
}
.modal-body {
  overflow-y: auto;
  padding: 24px;
  flex-grow: 1;
}
.modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid var(--border);
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}
.modal-footer.footer-analysis {
  justify-content: space-between;
}
.end-message {
  font-size: var(--md);
  text-align: center;
}
/* Стили для контента, генерируемого v-html */
.analysis h1,
.analysis h3,
.analysis .subtitle {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: var(--xl) !important;
  color: var(--g3) !important;
  text-align: center;
  margin-bottom: 16px;
}
.analysis .modal-body h2,
.analysis .modal-body h3 {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: var(--xl);
  color: var(--text-head);
  text-align: center;
  margin-bottom: 8px;
}
.analysis .modal-body ul {
  list-style-type: none;
  padding-left: 8px;
  margin-bottom: 32px;
}
.analysis .modal-body ul li {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: var(--md);
  color: var(--text-base);
  font-weight: 500;
  margin-bottom: 8px;
}
.modal-body li code,
.modal-body li strong code {
  font-family: 'Roboto Condensed', sans-serif !important;
  font-weight: 600;
  color: var(--g3);
}
.modal-body li strong {
  font-family: 'Roboto Condensed', sans-serif !important;
  font-weight: 700;
  color: var(--r3);
}
.modal-info ul li ul li {
  padding-left: 16px;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
