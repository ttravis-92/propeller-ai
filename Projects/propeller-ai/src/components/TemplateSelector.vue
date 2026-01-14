<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePropellerStore } from '../stores/propeller';
import { PROPELLER_TEMPLATES, applyTemplate, type PropellerTemplate } from '../core/templates';
import { ElDialog, ElSelect, ElOption, ElCard, ElRow, ElCol, ElButton, ElEmpty } from 'element-plus';

const { t } = useI18n();
const store = usePropellerStore();

const dialogVisible = ref(false);
const selectedCategory = ref('all');
const searchQuery = ref('');

const categories = [
  { value: 'all', label: 'All' },
  { value: 'uav', label: 'UAV' },
  { value: 'multirotor', label: 'Multirotor' },
  { value: 'vtol', label: 'VTOL' },
  { value: 'experimental', label: 'Experimental' }
];

const filteredTemplates = computed(() => {
  let templates = PROPELLER_TEMPLATES;

  if (selectedCategory.value !== 'all') {
    templates = templates.filter(t => t.category === selectedCategory.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    templates = templates.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.nameZh.toLowerCase().includes(query)
    );
  }

  return templates;
});

function openDialog(): void {
  dialogVisible.value = true;
}

function applyTemplate(template: PropellerTemplate): void {
  const designName = t(`templates.${template.id}`) === `templates.${template.id}`
    ? `${template.name} (${template.nameZh})`
    : template.name;

  const newParams = applyTemplate(template, designName);
  store.currentDesign = newParams;
  store.performanceCurves = null;
  store.efficiencyMap = null;
  dialogVisible.value = false;

  store.saveCurrentDesign();
}

function formatNumber(num: number): string {
  if (num >= 0.1) return num.toFixed(3);
  return num.toFixed(2);
}
</script>

<template>
  <div class="template-selector">
    <el-button type="primary" plain @click="openDialog">
      {{ t('templates.select') }}
    </el-button>

    <el-dialog
      v-model="dialogVisible"
      :title="t('templates.title')"
      width="800px"
      class="template-dialog"
    >
      <div class="template-filters">
        <el-select v-model="selectedCategory" style="width: 150px">
          <el-option
            v-for="cat in categories"
            :key="cat.value"
            :label="cat.label"
            :value="cat.value"
          />
        </el-select>

        <el-input
          v-model="searchQuery"
          :placeholder="t('templates.search')"
          style="width: 200px"
          clearable
        />
      </div>

      <div class="template-grid" v-if="filteredTemplates.length > 0">
        <el-row :gutter="16">
          <el-col
            v-for="template in filteredTemplates"
            :key="template.id"
            :span="8"
          >
            <el-card
              class="template-card"
              shadow="hover"
              @click="applyTemplate(template)"
            >
              <template #header>
                <div class="template-header">
                  <span class="template-name">{{ template.name }}</span>
                  <el-tag size="small" :type="template.category === 'experimental' ? 'warning' : 'primary'">
                    {{ template.category }}
                  </el-tag>
                </div>
              </template>

              <div class="template-info">
                <div class="template-name-zh">{{ template.nameZh }}</div>
                <div class="template-specs">
                  <div class="spec">
                    <span class="spec-label">{{ t('basic.diameter') }}:</span>
                    <span class="spec-value">{{ formatNumber(template.params.diameter * 1000) }}mm</span>
                  </div>
                  <div class="spec">
                    <span class="spec-label">{{ t('basic.numBlades') }}:</span>
                    <span class="spec-value">{{ template.params.numBlades }}</span>
                  </div>
                  <div class="spec">
                    <span class="spec-label">{{ t('tabs.chord') }}:</span>
                    <span class="spec-value">{{ formatNumber(template.params.chordDistribution[0] * 1000) }}mm</span>
                  </div>
                  <div class="spec">
                    <span class="spec-label">{{ t('tabs.pitch') }}:</span>
                    <span class="spec-value">{{ formatNumber(template.params.pitchDistribution[0] * 1000) }}mm</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <el-empty v-else :description="t('templates.empty')" />
    </el-dialog>
  </div>
</template>

<style scoped>
.template-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.template-grid {
  max-height: 500px;
  overflow-y: auto;
}

.template-card {
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.3s;
  background: #16213e;
  border-color: #0f3460;
}

.template-card:hover {
  border-color: #e94560;
  transform: translateY(-2px);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-name {
  font-weight: 600;
  color: #eee;
  font-size: 13px;
}

.template-name-zh {
  color: #888;
  font-size: 12px;
  margin-bottom: 10px;
}

.template-specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.spec {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.spec-label {
  color: #888;
}

.spec-value {
  color: #4ade80;
  font-weight: 500;
}

:deep(.el-card__header) {
  padding: 12px 15px;
  background: rgba(15, 52, 96, 0.5);
  border-bottom: 1px solid #0f3460;
}

:deep(.el-card__body) {
  padding: 12px 15px;
}

:deep(.el-dialog) {
  background: #16213e;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #0f3460;
}

:deep(.el-dialog__title) {
  color: #eee;
}
</style>
