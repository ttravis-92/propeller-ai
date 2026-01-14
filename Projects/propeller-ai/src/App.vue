<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePropellerStore } from './stores/propeller';
import PropellerForm from './components/PropellerForm.vue';
import PropellerPreview from './components/PropellerPreview.vue';
import PerformanceCharts from './components/PerformanceCharts.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import { ElMessage } from 'element-plus';
import { Promotion, Plus, FolderChecked, Upload, Download } from '@element-plus/icons-vue';

const { t, locale } = useI18n();
const store = usePropellerStore();

onMounted(() => {
  store.generateDefaultDistributions();
});

function handleImport(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    store.importDesign(input.files[0]).then(() => {
      ElMessage.success(t('messages.imported'));
    }).catch(err => {
      ElMessage.error(t('messages.error.import') + ': ' + err.message);
    });
  }
}

function handleNewDesign(): void {
  store.newDesign();
  ElMessage.success(t('messages.created'));
}

function handleSave(): void {
  store.saveCurrentDesign();
  ElMessage.success(t('messages.saved'));
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo">
        <el-icon :size="28"><Promotion /></el-icon>
        <span>{{ t('app.title') }}</span>
      </div>
      <div class="header-actions">
        <LanguageSwitcher />
        <el-button @click="handleNewDesign" :icon="Plus">{{ t('header.newDesign') }}</el-button>
        <el-button @click="handleSave" :icon="FolderChecked">{{ t('header.save') }}</el-button>
        <el-upload
          class="import-btn"
          :show-file-list="false"
          :auto-upload="false"
          accept=".json"
          @change="handleImport"
        >
          <el-button :icon="Upload">{{ t('header.import') }}</el-button>
        </el-upload>
        <el-button @click="store.exportDesign()" :icon="Download">{{ t('header.export') }}</el-button>
      </div>
    </header>

    <main class="app-main">
      <aside class="left-panel">
        <PropellerForm />
      </aside>

      <section class="center-panel">
        <PropellerPreview />
      </section>

      <aside class="right-panel">
        <PerformanceCharts />
      </aside>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1a1a2e;
  color: #eee;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: #16213e;
  border-bottom: 1px solid #0f3460;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: 600;
  color: #e94560;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.import-btn {
  display: inline-block;
}

.app-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.left-panel {
  width: 340px;
  background: #16213e;
  border-right: 1px solid #0f3460;
  overflow-y: auto;
}

.center-panel {
  flex: 1;
  background: #1a1a2e;
}

.right-panel {
  width: 380px;
  background: #16213e;
  border-left: 1px solid #0f3460;
  overflow-y: auto;
}
</style>
