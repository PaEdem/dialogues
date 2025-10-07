<!-- \\src\views\ViewDialog.vue -->
<template>
  <!-- FOR DESKTOP -->
  <div v-if="isDesktop">
    <DialogLayout>
      <template #sidebar-content>
        <button
          class="btn btn-menu"
          @click="getInfo"
          :disabled="!isButtonActive()"
        >
          <span class="material-symbols-outlined">analytics</span>
          {{ $t('buttons.analysis') }}
          <span
            v-if="!userStore.isPro"
            class="pro-badge"
            >PRO</span
          >
        </button>
        <div class="play">
          <button
            class="btn btn-menu"
            @click="toggleListening"
          >
            <span class="material-symbols-outlined">volume_up</span>
            {{ $t('buttons.listen') }}
          </button>
        </div>
        <div class="grow"></div>
        <p class="training-title">{{ $t('view.training') }}</p>
        <button
          v-for="level in trainingLevels"
          :key="level.name"
          class="btn btn-action"
          :disabled="level.isPro && !isButtonActive()"
          @click="goToTraining(level)"
        >
          <span class="material-symbols-outlined">{{ level.icon }}</span>
          <span class="text-mobile">{{ level.text }}</span>
          <span
            v-if="!userStore.isPro && level.isPro"
            class="pro-badge"
            >PRO</span
          >
        </button>
        <div class="grow"></div>
        <button
          class="btn btn-danger"
          @click="handleDelete"
        >
          <span class="material-symbols-outlined">delete</span>
          {{ $t('buttons.delDialog') }}
        </button>
      </template>

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
        aria-label="Назад"
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
          :disabled="!isButtonActive()"
        >
          <span class="material-symbols-outlined">analytics</span>
          <span
            v-if="!userStore.isPro"
            class="pro-badge-mobile"
            >PRO</span
          >
          {{ $t('buttons.analysisM') }}
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
          :disabled="level.isPro && !isButtonActive()"
          @click="goToTraining(level)"
        >
          <span class="material-symbols-outlined">{{ level.icon }}</span>
          <span class="text-mobile">{{ level.text }}</span>
          <span
            v-if="userStore.isPro"
            class="pro-badge-mobile"
            >PRO</span
          >
        </button>
      </div>
    </footer>
  </div>

  <div
    v-else
    class="loading-container"
  >
    <Loader />
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
          <ProBenefitItem>{{ $t('profile.unlimGen') }}</ProBenefitItem>
          <ProBenefitItem>{{ $t('profile.unlimStor') }}</ProBenefitItem>
          <ProBenefitItem>{{ $t('profile.qualityVoice') }}</ProBenefitItem>
          <ProBenefitItem>{{ $t('profile.allLevels') }}</ProBenefitItem>
          <ProBenefitItem>{{ $t('profile.allModes') }}</ProBenefitItem>
          <ProBenefitItem>{{ $t('profile.analysis') }}</ProBenefitItem>
        </ul>
      </div>

      <template #footer>
        <router-link
          to="/profile"
          @click="uiStore.hideModal()"
        >
          <button class="btn btn-action w-10">
            <span class="material-symbols-outlined">details</span>
            {{ $t('buttons.findMore') }}
          </button>
        </router-link>
        <button
          class="btn btn-common w-10"
          @click="uiStore.hideModal()"
        >
          <span class="material-symbols-outlined">close</span>
          Sulje
        </button>
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
import ProBenefitItem from '../components/ProBenefitItem.vue';
import Modal from '../components/Modal.vue';
import Loader from '../components/Loader.vue';

const { t } = useI18n();
const props = defineProps({ id: { type: String, required: true } });
const router = useRouter();
const settingsStore = useSettingsStore();
const dialogStore = useDialogStore();
const trainingStore = useTrainingStore();
const uiStore = useUiStore();
const userStore = useUserStore();
const { isButtonActive, PREVIEW_LIMIT } = usePermissions();
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
const handleProFeatureClick = (action) => {
  // 1. Если пользователь PRO, просто выполняем действие
  if (userStore.isPro) {
    action();
    return;
  }
  if (settingsStore.dailyPreviewCount < PREVIEW_LIMIT) {
    settingsStore.incrementPreviewCount();
    const previewsLeft = PREVIEW_LIMIT - settingsStore.dailyPreviewCount;

    let toastMessage = `Использован PRO-доступ. Осталось: ${previewsLeft}.`;
    if (previewsLeft === 0) {
      toastMessage = 'Использован последний PRO-доступ на сегодня.';
    }

    uiStore.showToast(toastMessage, 'info');
    action();
  } else {
    settingsStore.incrementPreviewCount();
    uiStore.showUpgradeModal();
  }
};
const goToTraining = (level) => {
  if (level.isPro) {
    handleProFeatureClick(() => {
      router.push({ name: level.name, params: { id: props.id } });
    });
  } else {
    // Для бесплатных уровней просто переходим
    router.push({ name: level.name, params: { id: props.id } });
  }
};
const getInfo = async () => {
  handleProFeatureClick(async () => {
    await trainingStore.fetchDialogAnalysis();
    uiStore.showModal('analysis');
  });
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
.pro-badge {
  margin-left: auto;
  font-size: 0.7rem;
  font-weight: 700;
  background-color: var(--bg-pro);
  color: var(--t-pro);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}
.title {
  text-align: center;
  color: var(--t-pro);
}
.subtitle {
  color: var(--text-head);
  margin-bottom: 1rem;
  margin-left: 2rem;
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
.play {
  display: flex;
  gap: 0.5rem;
}
.play > :first-child {
  flex-grow: 1;
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
.pro-badge-mobile {
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 0.25rem;
  margin-top: 0.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  background-color: var(--bg-pro);
  color: var(--t-pro);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}
</style>
