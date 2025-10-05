<!-- src\views\NewDialog.vue -->
<template>
  <div class="layout">
    <div class="title">{{ $t('new.createNew') }}</div>
    <form
      @submit.prevent="handleCreateDialog"
      class="dialog-form"
    >
      <div class="form-group">
        <label for="topic">{{ $t('new.topic') }}</label>
        <input
          id="topic"
          v-model="form.topic"
          type="text"
          required
        />
      </div>

      <div class="form-group">
        <label for="words">{{ $t('new.reqWords') }}</label>
        <textarea
          id="words"
          v-model="form.words"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="level">{{ $t('new.level') }}</label>
        <select
          id="level"
          v-model="form.level"
          required
        >
          <option
            v-for="level in levels"
            :key="level"
            :value="level"
          >
            {{ level }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="replicas">{{ $t('new.lines') }}</label>
        <input
          id="replicas"
          v-model.number="form.replicas"
          type="number"
          min="2"
          max="20"
          required
        />
      </div>
      <div class="submit-wrap">
        <router-link
          to="/dialogs"
          class="btn btn-common"
          aria-label="Вернуться ко всем диалогам"
        >
          <span class="material-symbols-outlined icon">cancel</span>
          {{ $t('buttons.cancel') }}
        </router-link>
        <button
          class="btn btn-action width"
          type="submit"
          :disabled="!isFormValid || trainingStore.isLoading"
        >
          <span class="material-symbols-outlined icon">save</span>
          {{ $t('buttons.save') }}
        </button>
      </div>
    </form>

    <p
      v-if="errorMessage"
      class="message error"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTrainingStore } from '../stores/trainingStore';

const router = useRouter();
const trainingStore = useTrainingStore();

const form = ref({
  topic: '',
  words: '',
  level: 'A1',
  replicas: 8,
});
const errorMessage = ref('');
const levels = ['A1', 'A2.1', 'A2.2', 'B1.1', 'B1.2', 'B2.1', 'B2.2', 'C1.1', 'C1.2'];
const isFormValid = computed(() => form.value.topic.trim() !== '');

const handleCreateDialog = async () => {
  errorMessage.value = '';
  const newDialogId = await trainingStore.generateAndCreateDialog(form.value);

  if (newDialogId) {
    router.push({ name: 'view-dialog', params: { id: newDialogId } });
  } else {
    errorMessage.value = 'Произошла ошибка при создании диалога. Попробуйте ещё раз.';
  }
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}
.dialog-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 420px;
  padding: 2rem 1.5rem;
  border-radius: 8px;
  background: var(--bg-group);
  box-shadow: 0 4px 15px var(--shadow);
}
.title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: var(--xxl);
}
.form-group {
  width: 100%;
  margin-bottom: 1.25rem;
}
label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: var(--sm);
  font-weight: 500;
  color: var(--text-title);
}
input,
select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: var(--font-base);
}
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: var(--font-base);
  font-family: inherit;
  resize: vertical;
}
input:focus,
select:focus,
textarea:focus {
  border-color: var(--bb);
}
.submit-wrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 2rem;
}
.submit-wrap .width {
  width: 100%;
}
.error-message {
  color: var(--r3);
  margin-bottom: 1rem;
  font-weight: 500;
  text-align: center;
}
</style>
