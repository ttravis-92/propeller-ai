<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const currentLang = computed(() => {
  return locale.value === 'zh' ? '中文' : 'English';
});

const languages = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' }
];

function handleCommand(command: string) {
  locale.value = command;
  localStorage.setItem('locale', command);
}
</script>

<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <div class="lang-switcher">
      <svg class="lang-icon" viewBox="0 0 1024 1024" width="14" height="14">
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 832c-212.1 0-384-171.9-384-384s171.9-384 384-384 384 171.9 384 384-171.9 384-384 384z" fill="currentColor"/>
        <path d="M512 192c-28.3 0-54.8 7.4-78.6 20.8 46.5 31.2 78.6 81.3 78.6 137.2 0 56-32.2 106-78.8 137.2 23.8 13.4 50.3 20.8 78.8 20.8 106 0 192-86 192-192s-86-192-192-192z m0 320c-70.8 0-128-57.2-128-128s57.2-128 128-128 128 57.2 128 128-57.2 128-128 128z" fill="currentColor"/>
        <path d="M480 448h-64v-192h64v192z m96 0h-64v-192h64v192z" fill="currentColor"/>
      </svg>
      <span>{{ currentLang }}</span>
      <svg class="dropdown-arrow" viewBox="0 0 1024 1024" width="10" height="10">
        <path d="M831.872 340.864L512 652.672 192.128 340.864z" fill="currentColor"/>
      </svg>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in languages"
          :key="lang.value"
          :command="lang.value"
          :class="{ active: locale === lang.value }"
        >
          {{ lang.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px 5px 6px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  color: #eee;
  border: 1px solid #0f3460;
  background: rgba(15, 52, 96, 0.5);
}

.lang-switcher:hover {
  background: rgba(233, 69, 96, 0.2);
  border-color: #e94560;
  color: #e94560;
}

.lang-icon {
  flex-shrink: 0;
}

.lang-switcher span {
  font-size: 12px;
  white-space: nowrap;
}

.dropdown-arrow {
  opacity: 0.6;
  flex-shrink: 0;
}

:deep(.el-dropdown-menu__item.active) {
  color: #e94560;
  font-weight: 600;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: rgba(233, 69, 96, 0.1);
}
</style>
