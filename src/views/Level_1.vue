<!-- src\views\Level_1.vue -->
<template>
  <DialogLayout>
    <template #sidebar-content>
      <TrainingSidebar
        :dialogId="props.id"
        slogan="Учите диалоги пошагово!"
        description="Слушай реплику, читай оригинал и перевод. Шаг за шагом. Повторяй фразу или весь диалог в любой момент."
      >
        <template #extra-controls>
          <button
            class="btn btn-menu"
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
      <template #header>
        <h3 class="title">Harjoitus on ohi</h3>
      </template>

      <div class="end-message">
        <p>Hyvää työtä!</p>
      </div>
    </Modal>
  </Teleport>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useDialogStore } from '../stores/dialogStore';
import { useTrainingStore } from '../stores/trainingStore';
import DialogLayout from '../components/DialogLayout.vue';
import TrainingSidebar from '../components/TrainingSidebar.vue';
import Modal from '../components/Modal.vue';

const props = defineProps({ id: { type: String, required: true } });
const dialogStore = useDialogStore();
const trainingStore = useTrainingStore();

const lineIndex = computed(() => trainingStore.currentLineIndex);
const dialog = computed(() => dialogStore.currentDialog);

const visibleLines = computed(() => {
  if (!dialog.value) return { fin: [], rus: [] };
  return {
    fin: dialog.value.fin.slice(0, lineIndex.value + 1),
    rus: dialog.value.rus.slice(0, lineIndex.value + 1),
  };
});

onMounted(async () => {
  await dialogStore.fetchDialogById(props.id);
  if (dialogStore.currentDialog) {
    trainingStore.startLevel();
  }
});
</script>

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
  font-size: var(--text-base);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
  line-height: 1.6;
}
.finnish {
  font-weight: 500;
  color: var(--text-head);
}
.russian {
  font-style: italic;
  color: var(--text-title);
}
.end-message {
  font-size: 1.25rem;
  text-align: center;
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
