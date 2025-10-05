<!-- src\views\Level_4.vue -->
<template>
  <DialogLayout>
    <template #sidebar-content>
      <TrainingSidebar
        :dialogId="props.id"
        description="Только финская речь. Выбери правильный вариант."
      >
        <template #extra-controls>
          <button
            class="btn-control mic off"
            disabled
          >
            <span class="material-symbols-outlined icon">mic_off</span>
            Микрофон OFF
          </button>
        </template>
      </TrainingSidebar>
    </template>

    <div class="quiz-content">
      <div class="options-container">
        <button
          class="btn-quiz"
          v-for="(option, index) in trainingStore.currentQuizOptions"
          :key="`${trainingStore.currentLineIndex}-${index}`"
          @click="handleAnswer(option)"
          :class="{
            correct: answerStatus[option.text] === 'correct',
            incorrect: answerStatus[option.text] === 'incorrect',
          }"
          :disabled="answerStatus[option.text] === 'incorrect' || isAnswered"
        >
          {{ option.text }}
        </button>
      </div>
    </div>
  </DialogLayout>

  <Teleport to="body">
    <Modal>
      <div class="ohi">
        <h3 class="ohi-title">Harjoitus on ohi</h3>
        <div class="ohi-message">
          Hyvää työtä! Voit aloittaa alusta tai valita toisen harjoituksen.<br />
          <br />
          Отличная работа! Можете начать заново или выбрать другую тренировку.
        </div>
      </div>
    </Modal>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useDialogStore } from '../stores/dialogStore';
import { useTrainingStore } from '../stores/trainingStore';
import DialogLayout from '../components/DialogLayout.vue';
import TrainingSidebar from '../components/TrainingSidebar.vue';
import Modal from '../components/Modal.vue';

const props = defineProps({ id: { type: String, required: true } });
const dialogStore = useDialogStore();
const trainingStore = useTrainingStore();

const answerStatus = ref({});
const isAnswered = ref(false);

watch(
  () => trainingStore.currentLineIndex,
  () => {
    answerStatus.value = {};
    isAnswered.value = false;
  }
);

const handleAnswer = (option) => {
  if (isAnswered.value) return;

  if (option.correct) {
    isAnswered.value = true;
    answerStatus.value[option.text] = 'correct';
    setTimeout(() => {
      trainingStore.nextLine();
    }, 1000);
  } else {
    answerStatus.value[option.text] = 'incorrect';
    trainingStore.playCurrentLineAudio();
  }
};

onMounted(async () => {
  trainingStore.currentTrainingType = 'level-4';
  await dialogStore.fetchDialogById(props.id);
  if (dialogStore.currentDialog) {
    trainingStore.startLevel();
  }
});
</script>

<!-- <style scoped>
/* Оставляем только уникальные стили */
.quiz-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.options-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 90%;
  max-width: 960px;
}
.btn-quiz {
  font-family: 'Roboto Condensed', sans-serif;
  height: 160px; /* Фиксированная высота для единообразия */
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  background: var(--winkle-80);
  color: var(--winkle-20);
  border-radius: 1rem;
  border: 1px solid var(--winkle-70);
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
}
.btn-quiz:not(:disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35);
  border-color: var(--winkle-30);
}
.btn-quiz.correct {
  background-color: var(--tiffany-60);
  color: var(--tiffany-20);
  border-color: var(--tiffany-10);
  transform: scale(1.05);
}
.btn-quiz.incorrect {
  background-color: var(--red-80);
  color: var(--red-20);
  border-color: var(--red-70);
  opacity: 0.8;
  cursor: not-allowed;
}
</style> -->

<style scoped>
/* 1. Стили для МОБИЛЬНЫХ (по умолчанию) */
.quiz-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
}
.options-container {
  display: grid;
  grid-template-columns: 1fr; /* Одна колонка */
  gap: 1rem;
  width: 100%;
  max-width: 500px;
}
.btn-quiz {
  /* Используем базовый класс .btn, но переопределяем некоторые стили */
  height: 90px;
  padding: 1rem;
  font-size: var(--font-size-lg);
  font-weight: 500;
  text-transform: none; /* Убираем uppercase */
  background-color: var(--color-bg-main);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
.btn-quiz:not(:disabled):hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.btn-quiz.correct {
  background-color: var(--tiffany-60); /* Используем яркие цвета для статусов */
  color: var(--tiffany-10);
  border-color: var(--tiffany-60);
}
.btn-quiz.incorrect {
  background-color: var(--red-90);
  color: var(--color-danger);
  border-color: var(--red-80);
  opacity: 0.8;
  cursor: not-allowed;
}

/* 2. Улучшения для ПЛАНШЕТОВ И БОЛЬШЕ */
@media (min-width: 768px) {
  .quiz-content {
    padding: 2rem;
  }
  .options-container {
    grid-template-columns: 1fr 1fr; /* Две колонки */
    gap: 2rem;
    max-width: 960px;
  }
  .btn-quiz {
    height: 120px;
    font-size: var(--font-size-xl);
  }
}
</style>
