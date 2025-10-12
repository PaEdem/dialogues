<!--\\src\views\Profile.vue -->
<template>
  <div class="profile-page">
    <header class="page-header">
      <h1 class="page-title">{{ $t('profile.title') }}</h1>
      <button
        @click="goBack"
        class="btn btn-action btn-ok"
      >
        {{ $t('buttons.done') }}
      </button>
    </header>

    <main class="profile-content">
      <section class="profile-group user-info">
        <img
          v-if="user?.photoURL"
          :src="user.photoURL"
          alt="User avatar"
          class="avatar"
        />
        <div
          v-else
          class="avatar-placeholder"
        >
          <span class="material-symbols-outlined">person</span>
        </div>
        <div class="user-details">
          <h2 class="user-name">{{ user?.displayName || 'Käyttäjä' }}</h2>
          <p class="user-email">{{ user?.email }}</p>
        </div>
      </section>

      <section class="profile-group">
        <h3 class="group-title">{{ $t('profile.subscr') }}</h3>

        <div class="current-plan-card">
          <p class="usage-info">
            {{ $t('profile.yourSubscr') }}<strong>{{ userStore.isPro ? 'PRO' : 'Free' }}</strong>
          </p>
          <p class="usage-info">{{ $t('profile.genToday') }} {{ dialogsCreatedToday }} / {{ usage.daily.limit }}</p>
          <p class="usage-info">{{ $t('profile.savedDialog') }} {{ usage.total.count }} / {{ usage.total.limit }}</p>
        </div>
        <div class="pro-card">
          <div class="pro-header">
            <span class="material-symbols-outlined">rocket_launch</span>
            <h2>{{ $t('profile.upgrade') }}</h2>
          </div>
          <ul class="benefits-list">
            <ProBenefitItem>{{ $t('profile.unlimGen') }}</ProBenefitItem>
            <ProBenefitItem>{{ $t('profile.unlimStor') }}</ProBenefitItem>
            <ProBenefitItem>{{ $t('profile.qualityVoice') }}</ProBenefitItem>
            <ProBenefitItem>{{ $t('profile.allLevels') }}</ProBenefitItem>
            <ProBenefitItem>{{ $t('profile.allModes') }}</ProBenefitItem>
            <ProBenefitItem>{{ $t('profile.analysis') }}</ProBenefitItem>
          </ul>
          <button
            class="btn btn-action btn-pro"
            @click="handleUpgrade"
          >
            {{ $t('buttons.startFree') }}
          </button>
        </div>
      </section>

      <section class="profile-group">
        <h3 class="group-title">{{ $t('profile.accountMenag') }}</h3>
        <div class="actions-list">
          <button
            class="btn btn-danger"
            @click="handleLogout"
          >
            <span class="material-symbols-outlined">logout</span>
            {{ $t('buttons.logOut') }}
          </button>
          <button
            class="btn btn-danger"
            @click="handleDeleteAccount"
          >
            <span class="material-symbols-outlined">delete_forever</span>
            {{ $t('buttons.delete') }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { useDialogStore } from '../stores/dialogStore';
import { useSettingsStore } from '../stores/settingsStore.js';
import ProBenefitItem from '../components/ProBenefitItem.vue';
import { resetFreeTierCache } from '../utils/dataTransformer.js';

const router = useRouter();
const userStore = useUserStore();
const dialogStore = useDialogStore();
const settingsStore = useSettingsStore();

const user = computed(() => userStore.user);

const usage = computed(() => {
  return {
    total: {
      count: dialogStore.allDialogs.length,
      limit: settingsStore.limit.totalDialogs,
    },
    daily: {
      count: settingsStore.dailyGenerationCount,
      limit: settingsStore.limit.dailyGenerations,
    },
  };
});

const dialogsCreatedToday = computed(() => {
  const todayString = new Date().toDateString();
  return dialogStore.allDialogs.filter((dialog) => {
    if (!dialog.createdAt || typeof dialog.createdAt.seconds !== 'number') {
      return false;
    }
    const dialogDate = new Date(dialog.createdAt.seconds * 1000);
    return dialogDate.toDateString() === todayString;
  }).length;
});

const goBack = () => {
  router.back();
};
const handleLogout = async () => {
  await userStore.logout();
  router.push({ name: 'auth' });
};
const handleUpgrade = () => {
  alert('PRO-versio tulossa pian!');
};
const handleDeleteAccount = () => {
  resetFreeTierCache();
  router.push({ name: 'all-dialogs' });
};
</script>

<style scoped>
/* 1. Стили для МОБИЛЬНЫХ (по умолчанию) */
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 0;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.page-title {
  font-size: var(--xxxl);
  font-family: 'Roboto Condensed', sans-serif;
  color: var(--text-head);
  margin: 0;
}
.profile-group {
  margin-bottom: 1.5rem;
}
.group-title {
  font-size: var(--sm);
  font-weight: 700;
  color: var(--text-base);
  text-transform: uppercase;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 0.5rem;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.avatar,
.avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.avatar-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-group);
  border: 1px solid var(--border);
}
.avatar-placeholder .material-symbols-outlined {
  font-size: 32px;
  color: var(--text-base);
}
.user-name {
  font-size: var(--xl); /* Уменьшаем для мобильных */
  font-weight: 700;
  color: var(--text-head);
}
.user-email {
  font-size: var(--sm); /* Уменьшаем для мобильных */
  color: var(--text-title);
  word-break: break-all; /* Перенос длинных email */
}
.current-plan-card {
  background-color: var(--bg-group);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.plan-info p {
  color: var(--text-title);
  font-size: var(--base);
}
.plan-info strong {
  color: var(--text-head);
  font-weight: 700;
}
.usage-info {
  font-size: var(--sm) !important;
  color: var(--text-title);
}

/* Карточка PRO */
.pro-card {
  background: var(--gradient-pro);
  color: var(--t-pro);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 20px var(--shadow);
}
.pro-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
.pro-header h2 {
  font-size: var(--xl);
  font-weight: 700;
}
.benefits-list {
  list-style: none;
  padding: 0;
  text-align: left;
  display: inline-block;
  margin: 0 1rem;
  margin-bottom: 2rem;
}
.btn-pro {
  font-size: var(--lg);
  padding: 0.8rem;
  margin: 0 1rem;
}
.btn-ok {
  width: auto;
  padding-left: 2rem;
  padding-right: 2.5rem;
}
.actions-list {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 1rem;
  margin-top: 1rem;
}

/* 2. Улучшения для ДЕСКТОПОВ */
@media (min-width: 768px) {
  .profile-page {
    padding: 2rem; /* Увеличиваем отступы */
  }
  .avatar,
  .avatar-placeholder {
    width: 64px;
    height: 64px;
  }
  .user-name {
    font-size: var(--xxl);
  }
  .user-email {
    font-size: var(--base);
  }
  .pro-card {
    padding: 2rem;
  }
  .pro-header h2 {
    font-size: var(--xxl);
  }
  .actions-list {
    flex-direction: row;
  }
}
</style>
