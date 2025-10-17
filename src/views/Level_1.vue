<!-- src\views\Level_1.vue -->
<template>
  <div v-if="isDesktop">
    <DialogLayout>
      <template #sidebar-content>
        <TrainingSidebar
          :dialogId="props.id"
          :slogan="$t('level1.slogan')"
          :description="$t('level1.description')"
        >
          <template #extra-controls>
            <button
              class="btn btn-control"
              disabled
            >
              <span class="material-symbols-outlined icon">mic_off</span>
              <span class="btn-text">{{ $t('buttons.mic') }}</span>
            </button>
          </template>
        </TrainingSidebar>
      </template>

      <div
        v-if="dialog"
        class="dialog-text-container-desktop"
        ref="desktopContent"
      >
        <div
          v-for="(line, index) in visibleLines.fin"
          :key="index"
          class="message-bubble-desktop fade-in"
          :class="index % 2 === 0 ? 'left' : 'right'"
        >
          <p class="finnish-text">{{ line }}</p>
          <p class="russian-text">{{ visibleLines.rus[index] }}</p>
        </div>
      </div>
    </DialogLayout>
  </div>

  <div
    v-else-if="dialog"
    class="page-container"
  >
    <header class="header">
      <router-link
        to="/dialogs"
        class="header-btn"
      >
        <span class="material-symbols-outlined i">arrow_back_ios</span>
      </router-link>
      <div class="header-title">
        <p class="description-mobile">{{ $t('level1.descriptionMobile') }}</p>
      </div>
    </header>

    <main
      class="content"
      ref="mobileContent"
    >
      <div class="chat-container">
        <div
          v-for="(line, index) in visibleLines.fin"
          :key="index"
          class="message-bubble fade-in"
          :class="index % 2 === 0 ? 'left' : 'right'"
        >
          <p class="finnish-text-mobile">{{ line }}</p>
          <p class="russian-text-mobile">{{ visibleLines.rus[index] }}</p>
        </div>
      </div>
    </main>

    <footer class="actions-footer">
      <TrainingSidebar
        :dialogId="props.id"
        :description="$t('level1.description_mobile')"
      >
        <template #extra-controls>
          <button
            class="btn btn-control mobile"
            disabled
          >
            <span class="material-symbols-outlined icon">mic_off</span>
          </button>
        </template>
      </TrainingSidebar>
    </footer>
  </div>

  <Teleport to="body">
    <Modal>
      <template #header>
        <h3 class="title">{{ $t('modal.title') }}</h3>
      </template>

      <div class="end-message">
        <p>{{ $t('modal.text') }}</p>
      </div>
    </Modal>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useDialogStore } from '../stores/dialogStore';
import { useTrainingStore } from '../stores/trainingStore';
import { useBreakpoint } from '../composables/useBreakpoint';
import DialogLayout from '../components/DialogLayout.vue';
import TrainingSidebar from '../components/TrainingSidebar.vue';
import Modal from '../components/Modal.vue';

const props = defineProps({ id: { type: String, required: true } });
const dialogStore = useDialogStore();
const trainingStore = useTrainingStore();
const { isDesktop } = useBreakpoint();

const lineIndex = computed(() => trainingStore.currentLineIndex);
const dialog = computed(() => dialogStore.currentDialog);

// ✨ ЛОГИКА АВТОСКРОЛЛА
const mobileContent = ref(null);
const desktopContent = ref(null);

watch(lineIndex, () => {
  // Даём Vue время отрисовать новую реплику
  setTimeout(() => {
    const container = isDesktop.value ? desktopContent.value : mobileContent.value;
    if (container) {
      // Плавно скроллим до самого низа контейнера
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, 100);
});

const visibleLines = computed(() => {
  if (!dialog.value) return { fin: [], rus: [] };
  return {
    fin: dialog.value.fin.slice(0, lineIndex.value + 1),
    rus: dialog.value.rus.slice(0, lineIndex.value + 1),
  };
});

onMounted(async () => {
  trainingStore.setCurrentTrainingType('level-1');
  await dialogStore.fetchDialogById(props.id);
  if (dialogStore.currentDialog) {
    trainingStore.startLevel();
  }
});

// При уходе со страницы останавливаем озвучку
onUnmounted(() => {
  trainingStore.stopSpeech();
});
</script>

<style scoped>
/* ======================== ДЕСКТОП ======================== */
.dialog-text-container-desktop {
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 100%;
  gap: 16px;
  margin: 0 auto;
  padding-right: 8px;
  overflow-y: auto;
}
.message-bubble-desktop {
  color: var(--text-head);
  padding: 16px 24px;
  border-radius: 32px;
  max-width: 80%;
  border: 1px solid var(--bb);
}
.message-bubble-desktop.left {
  background-color: var(--bg-chat-l);
  border-bottom-left-radius: 2px;
  align-self: flex-start;
}
.message-bubble-desktop.right {
  background-color: var(--bg-chat-r);
  border-bottom-right-radius: 2px;
  align-self: flex-end;
}
.finnish-text {
  font-size: var(--lg);
  font-weight: 600;
}
.russian-text {
  font-size: var(--lg);
  font-style: italic;
  text-align: right;
  margin-top: 8px;
}

/* ======================== МОБИЛЬНЫЙ ======================== */
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: var(--bg-side);
  border-bottom: 1px solid var(--bb);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}
.header-btn {
  background: none;
  color: var(--text-head);
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-btn .i {
  font-size: 40px;
  margin-left: 32px;
}
.header-title {
  flex-grow: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.description-mobile {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: var(--md);
  font-style: italic;
  font-weight: 500;
  color: var(--g3);
  text-align: center;
}
.content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
}
.chat-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.message-bubble {
  color: var(--text-head);
  padding: 8px 16px;
  border-radius: 32px;
  max-width: 80%;
  border: 1px solid var(--bb);
}
.message-bubble.left {
  background-color: var(--bg-chat-l);
  border-bottom-left-radius: 2px;
  align-self: flex-start;
}
.message-bubble.right {
  background-color: var(--bg-chat-r);
  border-bottom-right-radius: 2px;
  align-self: flex-end;
}
.finnish-text-mobile {
  font-size: var(--md);
  font-weight: 600;
}
.russian-text-mobile {
  font-size: var(--md);
  font-style: italic;
  text-align: right;
  padding-left: 8px;
  margin-top: 8px;
}
.actions-footer {
  flex-shrink: 0;
  padding: 16px;
  background-color: var(--y10);
  border-top: 1px solid var(--bb);
  box-shadow: 0 -4px 8px var(--shadow);
}
/* .end-message {
  font-size: var(--md);
  text-align: center;
} */
</style>
