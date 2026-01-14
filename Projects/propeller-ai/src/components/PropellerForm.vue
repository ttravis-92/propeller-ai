<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePropellerStore } from '../stores/propeller';
import { NACA_4_DIGIT_AIRFOILS, NACA_5_DIGIT_AIRFOILS } from '../types';
import TemplateSelector from './TemplateSelector.vue';
import { ElMessage, ElDialog } from 'element-plus';
import { Download } from '@element-plus/icons-vue';

const { t } = useI18n();
const store = usePropellerStore();
const designName = ref(store.currentDesign.name);
const useCustomAirfoil = ref(store.currentDesign.airfoil.type === 'custom');
const importDialogVisible = ref(false);
const importText = ref('');

const activeSection = ref('basic');
const chordPoints = ref<{r: number, c: number}[]>([]);
const pitchPoints = ref<{r: number, p: number}[]>([]);
const skewPoints = ref<{r: number, s: number}[]>([]);
const rakePoints = ref<{r: number, rk: number}[]>([]);

watch(designName, (val) => {
  store.currentDesign.name = val;
});

watch(() => store.currentDesign.diameter, () => {
  store.generateDefaultDistributions();
  initDistributionPoints();
});

watch(useCustomAirfoil, (val) => {
  if (val) {
    store.currentDesign.airfoil.type = 'custom';
    store.currentDesign.airfoil.code = undefined;
  } else {
    store.currentDesign.airfoil.type = 'naca4';
    store.currentDesign.airfoil.code = '2412';
  }
});

function initDistributionPoints(): void {
  const r = store.currentDesign.diameter / 2;
  const hubR = store.currentDesign.hubRadius;
  const n = store.currentDesign.chordDistribution.length;

  chordPoints.value = store.currentDesign.chordDistribution.map((c, i) => ({
    r: hubR + (r - hubR) * i / (n - 1),
    c
  }));

  pitchPoints.value = store.currentDesign.pitchDistribution.map((p, i) => ({
    r: hubR + (r - hubR) * i / (n - 1),
    p
  }));

  skewPoints.value = store.currentDesign.skewDistribution.map((s, i) => ({
    r: hubR + (r - hubR) * i / (n - 1),
    s
  }));

  rakePoints.value = store.currentDesign.rakeDistribution.map((rk, i) => ({
    r: hubR + (r - hubR) * i / (n - 1),
    rk
  }));
}

function updateChordDistribution(): void {
  chordPoints.value.forEach((p, i) => {
    store.currentDesign.chordDistribution[i] = p.c;
  });
}

function updatePitchDistribution(): void {
  pitchPoints.value.forEach((p, i) => {
    store.currentDesign.pitchDistribution[i] = p.p;
  });
}

function updateSkewDistribution(): void {
  skewPoints.value.forEach((p, i) => {
    store.currentDesign.skewDistribution[i] = p.s;
  });
}

function updateRakeDistribution(): void {
  rakePoints.value.forEach((p, i) => {
    store.currentDesign.rakeDistribution[i] = p.rk;
  });
}

function handleCustomAirfoilUpload(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.trim().split('\n');
      const coords: { x: number; y: number }[] = [];

      for (const line of lines) {
        const parts = line.trim().split(/\s+/).map(Number);
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          coords.push({ x: parts[0], y: parts[1] });
        }
      }

      if (coords.length >= 3) {
        store.currentDesign.airfoil.type = 'custom';
        store.currentDesign.airfoil.coordinates = coords;
        store.currentDesign.airfoil.name = file.name.replace(/\.[^/.]+$/, '');
        ElMessage.success(`Airfoil "${store.currentDesign.airfoil.name}" loaded`);
      } else {
        ElMessage.error('Invalid airfoil data');
      }
    };

    reader.readAsText(file);
  }
}

function parseAndImportAirfoil(): void {
  try {
    const coords: { x: number; y: number }[] = [];
    const lines = importText.value.trim().split('\n');

    for (const line of lines) {
      const parts = line.trim().split(/\s+/).map(Number);
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        coords.push({ x: parts[0], y: parts[1] });
      }
    }

    if (coords.length >= 3) {
      store.currentDesign.airfoil.type = 'custom';
      store.currentDesign.airfoil.coordinates = coords;
      store.currentDesign.airfoil.name = 'Custom Airfoil';
      importDialogVisible.value = false;
      importText.value = '';
      ElMessage.success('Airfoil imported successfully');
    } else {
      ElMessage.error('Invalid airfoil data format');
    }
  } catch (err) {
    ElMessage.error('Failed to parse airfoil data');
  }
}

initDistributionPoints();
</script>

<template>
  <div class="propeller-form">
    <el-tabs v-model="activeSection" class="form-tabs">
      <el-tab-pane :label="t('tabs.basic')" name="basic">
        <div class="form-section">
          <h3>{{ t('basic.name') }}</h3>
          <el-input v-model="designName" :placeholder="t('basic.name')" />
        </div>

        <div class="form-section">
          <h3>{{ t('tabs.templates') }}</h3>
          <TemplateSelector />
        </div>

        <div class="form-section">
          <h3>{{ t('basic.title') }}</h3>
          <el-form label-position="top" size="small">
            <el-form-item :label="`${t('basic.diameter')} (${t('operating.unit.m')})`">
              <el-input-number
                v-model="store.currentDesign.diameter"
                :min="0.1"
                :max="5"
                :step="0.01"
                :precision="3"
              />
            </el-form-item>
            <el-form-item :label="t('basic.numBlades')">
              <el-input-number
                v-model="store.currentDesign.numBlades"
                :min="2"
                :max="20"
                :step="1"
              />
            </el-form-item>
            <el-form-item :label="`${t('basic.hubRadius')} (${t('operating.unit.m')})`">
              <el-input-number
                v-model="store.currentDesign.hubRadius"
                :min="0.005"
                :max="0.5"
                :step="0.001"
                :precision="4"
              />
            </el-form-item>
          </el-form>
        </div>

        <div class="form-section">
          <h3>{{ t('operating.title') }}</h3>
          <el-form label-position="top" size="small">
            <el-form-item :label="`${t('operating.velocity')} (${t('operating.unit.mps')})`">
              <el-input-number
                v-model="store.operatingConditions.velocity"
                :min="0"
                :max="100"
                :step="0.5"
                :precision="2"
              />
            </el-form-item>
            <el-form-item :label="t('operating.rpm')">
              <el-input-number
                v-model="store.operatingConditions.rpm"
                :min="100"
                :max="10000"
                :step="50"
              />
            </el-form-item>
            <el-form-item :label="`${t('operating.airDensity')} (${t('operating.unit.kgm3')})`">
              <el-input-number
                v-model="store.operatingConditions.airDensity"
                :min="0.5"
                :max="2"
                :step="0.001"
                :precision="3"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="t('tabs.airfoil')" name="airfoil">
        <div class="form-section">
          <h3>{{ t('airfoil.title') }}</h3>
          <el-radio-group v-model="useCustomAirfoil" style="margin-bottom: 15px;">
            <el-radio-button :label="false">{{ t('airfoil.standard') }}</el-radio-button>
            <el-radio-button :label="true">{{ t('airfoil.custom') }}</el-radio-button>
          </el-radio-group>

          <div v-if="!useCustomAirfoil">
            <el-form label-position="top" size="small">
              <el-form-item :label="t('airfoil.title')">
                <el-select
                  v-model="store.currentDesign.airfoil.type"
                  style="width: 100%"
                >
                  <el-option label="NACA 4-digit" value="naca4" />
                  <el-option label="NACA 5-digit" value="naca5" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="store.currentDesign.airfoil.type === 'naca4'" label="NACA 4-digit">
                <el-select
                  v-model="store.currentDesign.airfoil.code"
                  filterable
                  style="width: 100%"
                  placeholder="e.g., 2412"
                >
                  <el-option
                    v-for="code in NACA_4_DIGIT_AIRFOILS"
                    :key="code"
                    :label="code"
                    :value="code"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="store.currentDesign.airfoil.type === 'naca5'" label="NACA 5-digit">
                <el-select
                  v-model="store.currentDesign.airfoil.code"
                  filterable
                  style="width: 100%"
                  placeholder="e.g., 23012"
                >
                  <el-option
                    v-for="code in NACA_5_DIGIT_AIRFOILS"
                    :key="code"
                    :label="code"
                    :value="code"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <div v-else>
            <el-form label-position="top" size="small">
              <el-form-item :label="t('airfoil.custom')">
                <el-upload
                  :show-file-list="false"
                  :auto-upload="false"
                  accept=".txt,.dat,.csv"
                  @change="handleCustomAirfoilUpload"
                >
                  <el-button size="small" type="primary">{{ t('airfoil.upload') }}</el-button>
                  <template #tip>
                    <div class="el-upload__tip">{{ t('airfoil.tip') }}</div>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item :label="t('airfoil.paste')">
                <el-button size="small" @click="importDialogVisible = true">
                  {{ t('airfoil.paste') }}
                </el-button>
              </el-form-item>
              <el-form-item v-if="store.currentDesign.airfoil.name" :label="t('airfoil.loaded')">
                <el-tag>{{ store.currentDesign.airfoil.name }}</el-tag>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="t('tabs.chord')" name="chord">
        <div class="form-section">
          <h3>{{ t('distribution.chord') }}</h3>
          <div class="distribution-points">
            <div class="point-row header">
              <span>{{ t('distribution.header.r') }}</span>
              <span>{{ t('distribution.header.c') }}</span>
            </div>
            <div class="point-row" v-for="(p, i) in chordPoints" :key="i">
              <span>{{ p.r.toFixed(3) }}</span>
              <el-input-number
                v-model="p.c"
                :min="0.001"
                :max="1"
                :step="0.001"
                :precision="4"
                size="small"
                @change="updateChordDistribution"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="t('tabs.pitch')" name="pitch">
        <div class="form-section">
          <h3>{{ t('distribution.pitch') }}</h3>
          <div class="distribution-points">
            <div class="point-row header">
              <span>{{ t('distribution.header.r') }}</span>
              <span>{{ t('distribution.header.p') }}</span>
            </div>
            <div class="point-row" v-for="(p, i) in pitchPoints" :key="i">
              <span>{{ p.r.toFixed(3) }}</span>
              <el-input-number
                v-model="p.p"
                :min="0.01"
                :max="2"
                :step="0.01"
                :precision="4"
                size="small"
                @change="updatePitchDistribution"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="t('tabs.skew')" name="skew">
        <div class="form-section">
          <h3>{{ t('distribution.skew') }}</h3>
          <div class="distribution-points">
            <div class="point-row header">
              <span>{{ t('distribution.header.r') }}</span>
              <span>{{ t('distribution.header.s') }}</span>
            </div>
            <div class="point-row" v-for="(p, i) in skewPoints" :key="i">
              <span>{{ p.r.toFixed(3) }}</span>
              <el-input-number
                v-model="p.s"
                :min="-0.5"
                :max="0.5"
                :step="0.001"
                :precision="4"
                size="small"
                @change="updateSkewDistribution"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="t('tabs.rake')" name="rake">
        <div class="form-section">
          <h3>{{ t('distribution.rake') }}</h3>
          <div class="distribution-points">
            <div class="point-row header">
              <span>{{ t('distribution.header.r') }}</span>
              <span>{{ t('distribution.header.rk') }}</span>
            </div>
            <div class="point-row" v-for="(p, i) in rakePoints" :key="i">
              <span>{{ p.r.toFixed(3) }}</span>
              <el-input-number
                v-model="p.rk"
                :min="-0.3"
                :max="0.3"
                :step="0.001"
                :precision="4"
                size="small"
                @change="updateRakeDistribution"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="t('tabs.export')" name="export">
        <div class="form-section">
          <h3>{{ t('export.title') }}</h3>
          <div class="export-buttons">
            <el-button @click="store.exportSTL()" :icon="Download" type="primary">
              {{ t('export.stl') }}
            </el-button>
            <el-button @click="store.exportOBJ()" :icon="Download">
              {{ t('export.obj') }}
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-model="importDialogVisible"
      :title="t('airfoil.paste')"
      width="500px"
    >
      <el-input
        v-model="importText"
        type="textarea"
        :rows="15"
        placeholder="Paste airfoil coordinates (x y format, one point per line)&#10;Example:&#10;1.000000 0.000000&#10;0.950000 0.005420&#10;..."
      />
      <template #footer>
        <el-button @click="importDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="parseAndImportAirfoil">Import</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.propeller-form {
  padding: 15px;
}

.form-tabs {
  height: 100%;
}

.form-section {
  margin-bottom: 20px;
}

.form-section h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: #aaa;
  text-transform: uppercase;
}

.distribution-points {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #333;
  border-radius: 4px;
}

.point-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 1px solid #333;
}

.point-row:last-child {
  border-bottom: none;
}

.point-row.header {
  background: #222;
  font-weight: 600;
  font-size: 12px;
}

.point-row span {
  width: 70px;
  font-size: 12px;
}

.export-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
