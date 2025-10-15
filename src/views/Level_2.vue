<!-- src\views\Level_2.vue -->
<template>
  <div v-if="isDesktop">
    <DialogLayout>
      <template #sidebar-content>
        <TrainingSidebar
          :dialogId="props.id"
          :slogan="$t('level2.slogan')"
          :description="$t('level2.description')"
          :mic-button="true"
        >
          <template #extra-controls>
            <button
              class="btn btn-control mic"
              @click="trainingStore.toggleSpeechRecognition()"
              :class="{ active: trainingStore.isMicActive }"
            >
              <span class="material-symbols-outlined icon">{{ trainingStore.isMicActive ? 'mic' : 'mic_off' }}</span>
              <span class="btn-text">{{ $t('buttons.mic') }}</span>
            </button>
          </template>
        </TrainingSidebar>
      </template>

      <div class="content-wrapper">
        <div
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
        <div class="divider"></div>
        <div class="recognized-text-container">
          <p
            v-if="trainingStore.formattedRecognitionText"
            class="recognized-text"
            v-html="trainingStore.formattedRecognitionText"
          ></p>
          <p
            v-else
            class="placeholder-text"
          >
            {{ $t('level2.info') }}
          </p>
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
        <p class="description-mobile">{{ $t('level2.descriptionMobile') }}</p>
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
      <div class="recognized-text-container-mobile">
        <p
          v-if="trainingStore.formattedRecognitionText"
          class="recognized-text-mobile"
          v-html="trainingStore.formattedRecognitionText"
        ></p>
        <p
          v-else
          class="placeholder-text-mobile"
        >
          {{ $t('level2.info') }}
        </p>
      </div>
      <TrainingSidebar
        :dialogId="props.id"
        :description="$t('level2.description_mobile')"
      >
        <template #extra-controls>
          <button
            class="btn btn-control-mobile mic"
            @click="trainingStore.toggleSpeechRecognition()"
            :class="{ active: trainingStore.isMicActive }"
          >
            <span class="material-symbols-outlined icon">{{ trainingStore.isMicActive ? 'mic' : 'mic_off' }}</span>
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
  setTimeout(() => {
    const container = isDesktop.value ? desktopContent.value : mobileContent.value;
    if (container) {
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
  trainingStore.setCurrentTrainingType('level-2');
  await dialogStore.fetchDialogById(props.id);
  if (dialogStore.currentDialog) {
    trainingStore.startLevel();
  }
});

onUnmounted(() => {
  trainingStore.stopSpeech();
});
</script>

<style scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
/* ======================== ДЕСКТОП ======================== */
.dialog-text-container-desktop {
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 100%;
  gap: var(--y-10);
  margin: 0 auto;
  padding-right: 0.5rem;
  overflow-y: auto;
}
.message-bubble-desktop {
  color: var(--text-head);
  padding: var(--y-10) var(--x-20);
  border-radius: var(--y-20);
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
  font-size: var(--xl);
  font-weight: 600;
}
.russian-text {
  font-size: var(--xl);
  font-style: italic;
  text-align: right;
  margin-top: var(--y-05);
}
.recognized-text-container {
  height: 90px;
  flex-shrink: 0;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.recognized-text,
.placeholder-text {
  font-size: var(--lg);
  font-style: italic;
  color: var(--text-base);
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
  padding: var(--y-05) var(--x-05);
  background-color: var(--bg-side);
  border-bottom: 1px solid var(--bb);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}
.header-btn {
  background: none;
  color: var(--text-head);
  width: var(--y-25);
  height: var(--y-25);
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-btn .i {
  font-size: var(--y-25);
  margin-left: var(--x-20);
}
.header-title {
  flex-grow: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--y-05);
}
.description-mobile {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: var(--xl);
  font-style: italic;
  font-weight: 500;
  color: var(--r3);
  text-align: center;
}
.content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  scroll-behavior: smooth;
}
.chat-container {
  display: flex;
  flex-direction: column;
  gap: var(--y-05);
}
.message-bubble {
  color: var(--text-head);
  padding: var(--y-05) var(--x-15);
  border-radius: 1rem;
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
  font-size: var(--xl);
  font-weight: 600;
}
.russian-text-mobile {
  font-size: var(--xl);
  font-style: italic;
  text-align: right;
  margin-top: var(--y-05);
}
.actions-footer {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  background-color: var(--y10);
  border-top: 1px solid var(--bb);
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.2);
}
.recognized-text-container-mobile {
  height: 60px;
  flex-shrink: 0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.recognized-text-mobile,
.placeholder-text-mobile {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: var(--xl);
  color: var(--text-head);
}
.end-message {
  font-size: 1.25rem;
  text-align: center;
}
</style>
