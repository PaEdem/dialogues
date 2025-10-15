<!--\\src\views\Profile.vue -->
<template>
  <div class="profile-page">
    <main class="profile-content">
      <header class="page-header">
        <h1 class="page-title">{{ $t('profile.title') }}</h1>
        <button
          @click="goBack"
          class="btn btn-action mobile"
        >
          {{ $t('buttons.done') }}
        </button>
      </header>
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
        <div
          class="pro-card"
          v-if="!userStore.isPro"
        >
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
      <div class="grow"></div>
      <section class="profile-group">
        <h3 class="group-title">{{ $t('profile.accountMenag') }}</h3>
        <div class="actions-list">
          <button
            class="btn btn-danger mobile"
            @click="handleDeleteAccount"
          >
            <span class="material-symbols-outlined">delete_forever</span>
            {{ $t('buttons.delete') }}
          </button>
          <button
            class="btn btn-danger mobile"
            @click="handleLogout"
          >
            <span class="material-symbols-outlined">logout</span>
            {{ $t('buttons.logOut') }}
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
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: var(--y-10) var(--x-15);
  min-height: 0;
  height: 100vh;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--y-10);
}
.page-title {
  font-size: var(--xxxl);
  font-family: 'Roboto Condensed', sans-serif;
  color: var(--text-head);
  margin: 0;
}
.profile-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--y-05);
}
.profile-group {
  margin-bottom: var(--y-15);
}
.group-title {
  font-size: var(--sm);
  font-weight: 700;
  color: var(--text-base);
  text-transform: uppercase;
  padding-bottom: var(--y-05);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--y-05);
}
.user-info {
  display: flex;
  align-items: center;
  gap: var(--x-15);
}
.avatar,
.avatar-placeholder {
  width: var(--x-30);
  height: var(--x-30);
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
  font-size: var(--xl);
  color: var(--text-base);
}
.user-name {
  font-size: var(--xl);
  font-weight: 700;
  color: var(--text-head);
}
.user-email {
  font-size: var(--lg);
  color: var(--text-title);
  word-break: break-all;
}
.current-plan-card {
  background-color: var(--bg-group);
  padding: var(--y-10) var(--x-15);
  border-radius: 8px;
  margin-bottom: var(--y-15);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.plan-info p {
  color: var(--text-title);
  font-size: var(--lg);
}
.plan-info strong {
  color: var(--text-head);
  font-weight: 700;
}
.usage-info {
  font-size: var(--lg);
  color: var(--text-title);
}

/* Карточка PRO */
.pro-card {
  background: var(--gradient-pro);
  color: var(--t-pro);
  border-radius: 12px;
  padding: var(--y-10) var(--x-15);
  text-align: center;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 20px var(--shadow);
}
.pro-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--x-10);
  margin-bottom: var(--y-15);
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
  margin: 0 var(--x-10);
  margin-bottom: var(--y-20);
}
.btn-pro {
  font-size: var(--lg);
  padding: var(--y-10) var(--x-15);
  margin: 0 var(--x-30);
  font-size: var(--xl);
}

.actions-list {
  display: flex;
  justify-content: center;
  gap: var(--y-10);
  margin-top: var(--y-10);
}

/* 2. Улучшения для ДЕСКТОПОВ */
@media (min-width: 768px) {
  .profile-page {
    padding: var(--y-20) var(--x-20);
  }
  .avatar,
  .avatar-placeholder {
    width: var(--y-30);
    height: var(--y-30);
  }
  .user-name {
    font-size: var(--xxl);
  }
  .user-email {
    font-size: var(--lg);
  }
  .pro-card {
    padding: var(--y-20) var(--x-20);
  }
  .pro-header h2 {
    font-family: 'Roboto Condensed', sans-serif;
    font-size: var(--xxxl);
  }
  .actions-list {
    flex-direction: row;
  }
}
</style>
