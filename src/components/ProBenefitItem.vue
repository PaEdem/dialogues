<template>
  <li class="benefit-item">
    <span class="material-symbols-outlined icon">check_circle</span>
    <span class="text"><slot></slot></span>
  </li>
</template>

<style scoped>
.benefit-item {
  display: flex;
  align-items: center;
  gap: var(--y-10);
  font-size: var(--xl);
  color: var(--text-head);
  margin-bottom: var(--y-05);
}
.icon {
  color: var(--g3);
}
</style>
