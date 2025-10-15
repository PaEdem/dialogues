<!-- \\src\App.vue -->
<template>
  <div class="app-wrapper">
    <Loader v-if="isLoading" />
    <main class="main">
      <router-view></router-view>
    </main>
    <ToastContainer />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUiStore } from './stores/uiStore';
import ToastContainer from './components/ToastContainer.vue';
import Loader from './components/Loader.vue';

const uiStore = useUiStore();

const isLoading = computed(() => uiStore.loading);
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
}
.main {
  flex: 1;
  width: 100%;
  margin: 0 auto;
}
</style>
