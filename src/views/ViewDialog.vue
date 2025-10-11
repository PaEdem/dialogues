<!-- \\src\views\ViewDialog.vue -->
<template>
  <!-- FOR DESKTOP -->
  <div v-if="isDesktop">
    <DialogLayout>
      <template #sidebar-content>
        <!-- кнопка анализ диалога -->
        <button
          class="btn btn-menu"
          @click="getInfo"
          :disabled="!canView()"
        >
          <span class="material-symbols-outlined">analytics</span>
          {{ $t('buttons.analysis') }}
          <span
            v-if="!userStore.isPro"
            class="material-symbols-outlined pro"
            >crown</span
          >
        </button>
        <!-- кнопка прослушать диалог -->
        <button
          class="btn btn-menu"
          @click="toggleListening"
        >
          <span class="material-symbols-outlined">volume_up</span>
          {{ $t('buttons.listen') }}
        </button>
        <div class="grow"></div>
        <!-- кнопки тренировок -->
        <p class="training-title">{{ $t('view.training') }}</p>
        <button
          v-for="level in trainingLevels"
          :key="level.name"
          class="btn btn-action"
          :disabled="level.isPro && !canView()"
          @click="goToTraining(level)"
        >
          <span class="material-symbols-outlined">{{ level.icon }}</span>
          {{ level.text }}
          <span
            v-if="!userStore.isPro && level.isPro"
            class="material-symbols-outlined pro"
            >crown</span
          >
        </button>
        <div class="grow"></div>
        <!-- кнопка удалить диалог -->
        <button
          class="btn btn-danger"
          @click="handleDelete"
        >
          <span class="material-symbols-outlined">delete</span>
          {{ $t('buttons.delDialog') }}
        </button>
      </template>
      <!-- текст диалога -->
      <div
        v-if="dialog"
        class="scroll-container"
      >
        <div
          v-for="(fin, index) in dialog.fin"
          :key="index"
          class="dialog-line"
        >
          <p class="finnish-text">{{ fin }}</p>
          <p class="russian-text">{{ dialog.rus[index] }}</p>
        </div>
      </div>
    </DialogLayout>
  </div>

  <!-- FOR MOBILE -->
  <div
    v-else-if="dialog"
    class="page-container"
  >
    <header class="header">
      <button
        @click="router.back()"
        class="header-btn"
      >
        <span class="material-symbols-outlined i">arrow_back_ios</span>
      </button>
      <div class="header-title">
        <h1>{{ dialog.title }}</h1>
        <span class="badge">{{ dialog.level }}</span>
      </div>
      <div style="width: 40px"></div>
    </header>

    <main class="content">
      <div class="chat-container">
        <div
          v-for="(line, index) in dialog.fin"
          :key="index"
          class="message-bubble"
          :class="index % 2 === 0 ? 'left' : 'right'"
        >
          <p class="finnish-text-mobile">{{ line }}</p>
          <p class="russian-text-mobile">{{ dialog.rus[index] }}</p>
        </div>
      </div>
    </main>

    <footer class="actions-footer">
      <div class="actions-grid">
        <button
          class="btn btn-menu text-mobile"
          @click="toggleListening"
        >
          <span class="material-symbols-outlined">volume_up</span>
          {{ $t('buttons.listenM') }}
        </button>
        <button
          class="btn btn-menu mobile text-mobile"
          @click="getInfo"
          :disabled="!canView()"
        >
          <span class="material-symbols-outlined">analytics</span>
          {{ $t('buttons.analysisM') }}
          <span
            v-if="!userStore.isPro"
            class="material-symbols-outlined pro"
            >crown</span
          >
        </button>
        <button
          class="btn btn-danger half"
          @click="handleDelete"
        >
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
      <div class="trainings-grid">
        <button
          v-for="level in trainingLevels"
          :key="level.name"
          class="btn btn-action mobile"
          :disabled="level.isPro && !canView()"
          @click="goToTraining(level)"
        >
          <span class="material-symbols-outlined">{{ level.icon }}</span>
          {{ level.text }}
          <span
            v-if="!userStore.isPro && level.isPro"
            class="material-symbols-outlined pro"
            >crown</span
          >
        </button>
      </div>
    </footer>
  </div>

  <Teleport to="body">
    <Modal>
      <template #header>
        <h3
          v-if="uiStore.modalContent === 'analysis'"
          class="title"
        >
          {{ $t('view.headerAnalysis') }}
        </h3>
        <h3
          v-else-if="uiStore.modalContent === 'upgrade'"
          class="title"
        >
          {{ $t('view.goToPro') }}
        </h3>
      </template>

      <div
        v-if="uiStore.modalContent === 'analysis'"
        v-html="trainingStore.geminiResult"
      ></div>
      <div
        v-else-if="uiStore.modalContent === 'upgrade'"
        class="pro-benefits"
      >
        <h4 class="subtitle">{{ $t('view.unlock') }}</h4>
        <ul>
          <li class="description">{{ $t('view.description1') }}</li>
          <li class="description">{{ $t('view.description2') }}</li>
          <li class="description">{{ $t('view.description3') }}</li>
          <li class="description">{{ $t('view.description4') }}</li>
        </ul>
      </div>

      <template
        #footer
        v-if="uiStore.modalContent !== 'analysis'"
      >
        <button
          class="btn btn-common w-10"
          @click="uiStore.hideModal()"
        >
          <span class="material-symbols-outlined">close</span>
          {{ $t('buttons.close') }}
        </button>
        <router-link
          to="/profile"
          @click="uiStore.hideModal()"
        >
          <button class="btn btn-action w-10">
            <span class="material-symbols-outlined">details</span>
            {{ $t('buttons.findMore') }}
          </button>
        </router-link>
      </template>
    </Modal>
  </Teleport>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '../stores/settingsStore';
import { useDialogStore } from '../stores/dialogStore';
import { useTrainingStore } from '../stores/trainingStore';
import { useUiStore } from '../stores/uiStore';
import { useUserStore } from '../stores/userStore';
import { useBreakpoint } from '../composables/useBreakpoint';
import { usePermissions } from '../composables/usePermissions';
import DialogLayout from '../components/DialogLayout.vue';
import Modal from '../components/Modal.vue';

const { t } = useI18n();
const props = defineProps({ id: { type: String, required: true } });
const router = useRouter();
const settingsStore = useSettingsStore();
const dialogStore = useDialogStore();
const trainingStore = useTrainingStore();
const uiStore = useUiStore();
const userStore = useUserStore();
const { canView } = usePermissions();
const { isDesktop } = useBreakpoint();

const dialog = computed(() => dialogStore.currentDialog);
const trainingLevels = [
  {
    name: 'level-1',
    icon: 'interactive_space',
    text: t('buttons.learning'),
    isPro: false,
    feature: 'useBasicTraining',
  },
  { name: 'level-4', icon: 'hearing', text: t('buttons.listening'), isPro: false, feature: 'useBasicTraining' },
  {
    name: 'level-2',
    icon: 'record_voice_over',
    text: t('buttons.speaking'),
    isPro: true,
    feature: 'useAdvancedTraining',
  },
  { name: 'level-3', icon: 'translate', text: t('buttons.translation'), isPro: true, feature: 'useAdvancedTraining' },
];

onMounted(() => {
  dialogStore.fetchDialogById(props.id);
});
const handleDelete = async () => {
  const success = await dialogStore.deleteDialog(props.id);
  if (success) {
    router.push({ name: 'all-dialogs' });
  }
};
const toggleListening = () => {
  if (!dialog.value) return;
  trainingStore.togglePlayStop(dialog.value.fin.join('. '));
};
const handleProClick = (action) => {
  if (userStore.isPro) {
    action();
    return;
  }
  if (settingsStore.dailyPreviewCount < settingsStore.limit.useProMode) {
    settingsStore.incrementCount('view');
    const previewsLeft = settingsStore.limit.useProMode - settingsStore.dailyPreviewCount;
    let toastMessage = `Использован PRO-доступ. Осталось: ${previewsLeft}.`;
    if (previewsLeft === 0) {
      toastMessage = 'Использован последний PRO-доступ на сегодня.';
    }
    uiStore.showToast(toastMessage, 'warning');
    action();
  } else {
    settingsStore.incrementCount('view');
    uiStore.showUpgradeModal();
  }
};
const getInfo = async () => {
  handleProClick(async () => {
    await trainingStore.fetchDialogAnalysis();
    uiStore.showModal('analysis');
  });
};
const goToTraining = (level) => {
  if (level.isPro) {
    handleProClick(() => {
      router.push({ name: level.name, params: { id: props.id } });
    });
  } else {
    router.push({ name: level.name, params: { id: props.id } });
  }
};
</script>

<style scoped>
/* ============================================= */
/* 1. ОБЩИЕ СТИЛИ (для обеих версий)             */
/* ============================================= */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.pro {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 0.35rem;
  margin-right: 0.35rem;
  font-size: var(--base);
  color: var(--bg-pro);
  background: none;
}
.title {
  text-align: center;
  color: var(--t-pro);
}
.subtitle {
  text-align: center;
  color: var(--text-head);
  margin-bottom: 1rem;
  margin-left: 2rem;
}
.description {
  text-align: center;
  color: var(--text-base);
  margin: 0.5rem 0;
}
/* ============================================= */
/* 2. СТИЛИ ДЛЯ ДЕСКТОПНОГО МАКЕТА (>= 768px)    */
/* ============================================= */
.scroll-container {
  padding: 1rem 0;
}
.dialog-line {
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}
.finnish-text {
  font-size: var(--lg);
  font-weight: 500;
  color: var(--text-head);
  margin-bottom: 0.25rem;
}
.russian-text {
  font-size: var(--base);
  font-style: italic;
  color: var(--text-title);
  padding-left: 1rem;
}
.training-title {
  text-align: center;
  color: var(--text-base);
  margin: 1rem 0 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  font-size: var(--sm);
}
/* ============================================= */
/* 3. СТИЛИ ДЛЯ МОБИЛЬНОГО МАКЕТА (< 768px)      */
/* ============================================= */
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-main);
}
.header {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--bg-side);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.header-btn {
  background: none;
  color: var(--text-head);
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-btn .i {
  font-size: 40px;
}
.header-title {
  flex-grow: 1;
  text-align: center;
}
.header-title h1 {
  font-size: var(--lg);
  font-weight: 700;
  color: var(--text-head);
  line-height: 1.2;
}
.badge {
  font-size: var(--xs);
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  display: inline-block;
  margin-left: 0.5rem;
}
.content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}
.chat-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.message-bubble {
  color: var(--text-head);
  padding: 0.75rem 1rem;
  border-radius: 1.75rem;
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
  font-size: var(--base);
}
.russian-text-mobile {
  font-size: var(--sm);
  margin-top: 0.25rem;
}
.actions-grid > .btn.half {
  padding: 0.75rem;
  flex: 0 1 50px;
}
.actions-footer {
  flex-shrink: 0;
  padding: 1rem;
  background-color: var(--bg-side);
  border-top: 1px solid var(--border);
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
}
.actions-grid {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.actions-grid > .btn {
  flex: 1;
}
.trainings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.btn.btn-action.mobile,
.actions-grid .btn.btn-menu.mobile {
  position: relative;
}
.actions-grid .btn.btn-menu.text-mobile {
  gap: 0.5rem;
}
.text-mobile {
  font-size: var(--sm);
}
</style>
