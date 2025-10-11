<!-- src\components\TrainingSidebar.vue -->
<template>
  <div class="training-sidebar-content">
    <div class="readme">
      <p class="slogan">{{ slogan }}</p>
      <p class="description">{{ description }}</p>
    </div>
    <div class="grow"></div>
    <div class="controls">
      <button
        class="btn btn-menu"
        @click="trainingStore.repeatLevel()"
      >
        <span class="material-symbols-outlined icon">repeat</span>
        {{ $t('buttons.reDialog') }}
      </button>
      <button
        class="btn btn-menu"
        @click="trainingStore.playCurrentLineAudio()"
      >
        <span class="material-symbols-outlined icon">repeat_one</span>
        {{ $t('buttons.reLine') }}
      </button>
      <button
        class="btn btn-menu play"
        @click="trainingStore.nextLine()"
      >
        <span class="material-symbols-outlined icon">play_arrow</span>
        {{ $t('buttons.nextLine') }}
      </button>
      <slot name="extra-controls"></slot>
      <router-link
        @click="trainingStore.stopSpeech()"
        :to="{ name: 'view-dialog', params: { id: dialogId } }"
        class="btn btn-menu"
      >
        <span class="material-symbols-outlined icon">output_circle</span>
        {{ $t('buttons.endPractice') }}
      </router-link>
    </div>
    <div class="grow"></div>
  </div>
</template>

<script setup>
import { useTrainingStore } from '../stores/trainingStore';

defineProps({
  slogan: { type: String, required: false },
  description: { type: String, required: true },
  dialogId: { type: String, required: true },
});

const trainingStore = useTrainingStore();
</script>

<style scoped>
.training-sidebar-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 2rem;
}
.readme {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.slogan {
  font-size: var(--base);
  color: var(--g3);
  font-weight: bold;
  text-align: center;
}
.description {
  font-size: var(--sm);
  font-style: italic;
  color: var(--text-head);
  text-align: center;
  line-height: 1.5;
}
.controls {
  display: grid;
  /* Для мобильных - 2 колонки */
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.grow {
  flex-grow: 1;
}
/* Для планшетов делаем сетку 3x2, если есть 5-6 кнопок */
@media (min-width: 768px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
