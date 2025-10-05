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
  gap: 1rem;
  font-size: var(--base);
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}
.icon {
  color: var(--primary);
}
</style>
