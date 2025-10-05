<!-- src\views\Level_1.vue -->
<template>
  <DialogLayout>
    <template #sidebar-content>
      <TrainingSidebar
        :dialogId="props.id"
        description="Финский текст, русский перевод и финская речь. Учи построчно."
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

    <div class="dialog-text-container">
      <div class="panel">
        <p
          class="finnish text"
          v-for="(line, index) in visibleLines.fin"
          :key="`fin-${index}`"
        >
          {{ line }}
        </p>
      </div>
      <div class="panel">
        <p
          class="russian text"
          v-for="(line, index) in visibleLines.rus"
          :key="`rus-${index}`"
        >
          {{ line }}
        </p>
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
import { computed, onMounted } from 'vue';
import { useDialogStore } from '../stores/dialogStore';
import { useTrainingStore } from '../stores/trainingStore';
// import { useUiStore } from '../stores/uiStore';
import DialogLayout from '../components/DialogLayout.vue';
import TrainingSidebar from '../components/TrainingSidebar.vue';
import Modal from '../components/Modal.vue';

const props = defineProps({ id: { type: String, required: true } });
const dialogStore = useDialogStore();
const trainingStore = useTrainingStore();
// const uiStore = useUiStore();

const lineIndex = computed(() => trainingStore.currentLineIndex);
const dialog = computed(() => dialogStore.currentDialog);

const visibleLines = computed(() => {
  if (!dialog.value) return { fin: [], rus: [] };
  // +1 чтобы показать текущую строчку
  return {
    fin: dialog.value.fin.slice(0, lineIndex.value + 1),
    rus: dialog.value.rus.slice(0, lineIndex.value + 1),
  };
});

onMounted(async () => {
  await dialogStore.fetchDialogById(props.id);
  // Запускаем тренировку только после того, как диалог точно загружен
  if (dialogStore.currentDialog) {
    trainingStore.startLevel();
  }
});
</script>

<!-- <style scoped></style> -->

<style scoped>
.dialog-text-container {
  display: flex;
  flex-direction: column; /* На мобильных колонки друг под другом */
  width: 100%;
  height: 100%;
  gap: 1rem;
}
.panel {
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem;
}
.text {
  font-size: var(--font-size-base);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  line-height: 1.6;
}
.finnish {
  font-weight: 500;
  color: var(--color-text-primary);
}
.russian {
  font-style: italic;
  color: var(--color-text-secondary);
}
@media (min-width: 768px) {
  .dialog-text-container {
    flex-direction: row; /* На десктопе - рядом */
    gap: 2rem;
  }
  .panel {
    padding: 0;
  }
}
</style>
