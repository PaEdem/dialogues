<!-- src\components\DialogCard.vue -->
<template>
  <router-link
    :to="{ name: 'view-dialog', params: { id: dialog.id } }"
    class="dialog-card"
  >
    <div class="card-content">
      <div class="card-title">{{ dialog.title }}</div>
      <div class="card-info">
        <span class="levelClass">Taso {{ dialog.level }}</span>
        <span>{{ dialog.replicasCount }} riviä</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
const props = defineProps({
  dialog: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.dialog-card {
  display: block;
  width: 100%;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--y-05) var(--x-15);
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.dialog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px var(--shadow);
}
.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.card-title {
  color: var(--text-head);
  font-size: var(--xl);
  font-weight: 700;
  margin-bottom: var(--y-05);
}
.card-info {
  display: flex;
  justify-content: space-between;
  font-size: var(--base);
  color: var(--text-title);
  margin-top: auto;
}
.levelClass {
  font-size: var(--base);
  color: var(--text-title);
  font-weight: 600;
}
.card-info span {
  color: var(--text-title);
}
</style>
