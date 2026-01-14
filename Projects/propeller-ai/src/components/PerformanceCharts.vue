<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import * as echarts from 'echarts';
import { usePropellerStore } from '../stores/propeller';
import { Refresh } from '@element-plus/icons-vue';

const { t } = useI18n();

const thrustChartRef = ref<HTMLDivElement>();
const efficiencyChartRef = ref<HTMLDivElement>();
const mapChartRef = ref<HTMLDivElement>();

let thrustChart: echarts.ECharts | null = null;
let efficiencyChart: echarts.ECharts | null = null;
let mapChart: echarts.ECharts | null = null;

const activeChart = ref('thrust');
const isCalculating = ref(false);
const results = computed(() => store.lastCalculationResult);

const store = usePropellerStore();

function initCharts(): void {
  if (thrustChartRef.value) {
    thrustChart = echarts.init(thrustChartRef.value);
  }
  if (efficiencyChartRef.value) {
    efficiencyChart = echarts.init(efficiencyChartRef.value);
  }
  if (mapChartRef.value) {
    mapChart = echarts.init(mapChartRef.value);
  }
}

function updateThrustChart(): void {
  if (!thrustChart || !store.performanceCurves) return;

  const curves = store.performanceCurves;

  thrustChart.setOption({
    title: { text: `${t('performance.charts.thrust')} vs RPM`, textStyle: { color: '#eee', fontSize: 12 } },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: curves.rpm.map(r => r.toFixed(0)),
      axisLabel: { color: '#888' },
      axisLine: { lineStyle: { color: '#444' } }
    },
    yAxis: {
      type: 'value',
      name: `${t('performance.results.thrust')} (N)`,
      nameTextStyle: { color: '#888' },
      axisLabel: { color: '#888' },
      axisLine: { lineStyle: { color: '#444' } },
      splitLine: { lineStyle: { color: '#333' } }
    },
    series: [{
      type: 'line',
      data: curves.thrust,
      smooth: true,
      lineStyle: { color: '#e94560', width: 2 },
      itemStyle: { color: '#e94560' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(233, 69, 96, 0.3)' },
          { offset: 1, color: 'rgba(233, 69, 96, 0)' }
        ])
      }
    }],
    backgroundColor: 'transparent'
  });
}

function updateEfficiencyChart(): void {
  if (!efficiencyChart || !store.performanceCurves) return;

  const curves = store.performanceCurves;

  const option = {
    title: { text: t('performance.charts.curves'), textStyle: { color: '#eee', fontSize: 12 } },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: [`${t('performance.results.efficiency')} (%)`, `${t('performance.results.power')} (W)`],
      textStyle: { color: '#888', fontSize: 10 },
      top: 25
    },
    grid: { left: 50, right: 20, top: 55, bottom: 30 },
    xAxis: {
      type: 'category',
      data: curves.rpm.map(r => r.toFixed(0)),
      axisLabel: { color: '#888' },
      axisLine: { lineStyle: { color: '#444' } }
    },
    yAxis: [
      {
        type: 'value',
        name: `${t('performance.results.efficiency')} (%)`,
        position: 'left',
        nameTextStyle: { color: '#4ade80' },
        axisLabel: { color: '#4ade80' },
        axisLine: { lineStyle: { color: '#4ade80' } },
        splitLine: { lineStyle: { color: '#333' } }
      },
      {
        type: 'value',
        name: `${t('performance.results.power')} (W)`,
        position: 'right',
        nameTextStyle: { color: '#f59e0b' },
        axisLabel: { color: '#f59e0b' },
        axisLine: { lineStyle: { color: '#f59e0b' } },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: `${t('performance.results.efficiency')} (%)`,
        type: 'line',
        data: curves.efficiency,
        smooth: true,
        yAxisIndex: 0,
        lineStyle: { color: '#4ade80', width: 2 },
        itemStyle: { color: '#4ade80' }
      },
      {
        name: `${t('performance.results.power')} (W)`,
        type: 'line',
        data: curves.power,
        smooth: true,
        yAxisIndex: 1,
        lineStyle: { color: '#f59e0b', width: 2 },
        itemStyle: { color: '#f59e0b' }
      }
    ],
    backgroundColor: 'transparent'
  };

  efficiencyChart.setOption(option);
}

function updateMapChart(): void {
  if (!mapChart || !store.efficiencyMap) return;

  const data: number[][] = [];
  const xLabels: string[] = [];
  const yLabels: string[] = [];

  const effMap = store.efficiencyMap;

  for (let i = 0; i < effMap.advanceRatio.length; i++) {
    xLabels.push(effMap.advanceRatio[i].toFixed(2));
  }

  for (let j = 0; j < 10; j++) {
    const rpmFactor = 0.5 + j * 0.1;
    yLabels.push(`${(rpmFactor * 100).toFixed(0)}%`);
  }

  for (let i = 0; i < effMap.efficiency.length; i++) {
    for (let j = 0; j < effMap.efficiency[i].length; j++) {
      data.push([j, i, effMap.efficiency[i][j]]);
    }
  }

  const option = {
    title: { text: `${t('performance.charts.map')} (J-T)`, textStyle: { color: '#eee', fontSize: 12 } },
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        return `J: ${xLabels[params.data[1]]}<br/>RPM: ${yLabels[params.data[0]]}<br/>η: ${params.data[2].toFixed(1)}%`;
      }
    },
    grid: { left: 50, right: 30, top: 40, bottom: 40 },
    xAxis: {
      type: 'category',
      data: xLabels,
      name: 'Advance Ratio (J)',
      nameLocation: 'middle',
      nameGap: 25,
      nameTextStyle: { color: '#888' },
      axisLabel: { color: '#888', interval: 3 },
      axisLine: { lineStyle: { color: '#444' } }
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      name: 'RPM Factor',
      nameTextStyle: { color: '#888' },
      axisLabel: { color: '#888' },
      axisLine: { lineStyle: { color: '#444' } }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'vertical',
      right: 0,
      top: 'center',
      itemHeight: 150,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      },
      textStyle: { color: '#888' }
    },
    series: [{
      type: 'heatmap',
      data: data,
      emphasis: {
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        }
      }
    }],
    backgroundColor: 'transparent'
  };

  mapChart.setOption(option);
}

async function calculate(): Promise<void> {
  isCalculating.value = true;

  try {
    await store.calculatePerformance();
    await nextTick();

    setTimeout(() => {
      updateThrustChart();
      updateEfficiencyChart();
      updateMapChart();
    }, 100);
  } finally {
    isCalculating.value = false;
  }
}

function resizeCharts(): void {
  thrustChart?.resize();
  efficiencyChart?.resize();
  mapChart?.resize();
}

watch(() => store.performanceCurves, () => {
  if (store.performanceCurves) {
    updateThrustChart();
    updateEfficiencyChart();
  }
});

watch(() => store.efficiencyMap, () => {
  if (store.efficiencyMap) {
    updateMapChart();
  }
});

watch(activeChart, () => {
  setTimeout(resizeCharts, 50);
});

onMounted(async () => {
  await nextTick();
  initCharts();

  window.addEventListener('resize', resizeCharts);

  setTimeout(calculate, 500);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCharts);
  thrustChart?.dispose();
  efficiencyChart?.dispose();
  mapChart?.dispose();
});
</script>

<template>
  <div class="charts-container">
    <div class="charts-header">
      <h3>{{ t('performance.title') }}</h3>
      <el-button
        type="primary"
        size="small"
        :loading="isCalculating"
        @click="calculate"
        :icon="Refresh"
      >
        {{ t('performance.calculate') }}
      </el-button>
    </div>

    <div v-if="results" class="results-summary">
      <div class="result-item">
        <span class="label">{{ t('performance.results.thrust') }}</span>
        <span class="value">{{ results.thrust.toFixed(2) }} N</span>
      </div>
      <div class="result-item">
        <span class="label">{{ t('performance.results.power') }}</span>
        <span class="value">{{ results.power.toFixed(2) }} W</span>
      </div>
      <div class="result-item">
        <span class="label">{{ t('performance.results.efficiency') }}</span>
        <span class="value">{{ results.efficiency.toFixed(1) }}%</span>
      </div>
      <div class="result-item">
        <span class="label">{{ t('performance.results.ct') }}</span>
        <span class="value">{{ results.ct.toFixed(4) }}</span>
      </div>
      <div class="result-item">
        <span class="label">{{ t('performance.results.cq') }}</span>
        <span class="value">{{ results.cq.toFixed(5) }}</span>
      </div>
    </div>

    <div class="chart-tabs">
      <el-radio-group v-model="activeChart" size="small">
        <el-radio-button label="thrust">{{ t('performance.charts.thrust') }}</el-radio-button>
        <el-radio-button label="efficiency">{{ t('performance.charts.curves') }}</el-radio-button>
        <el-radio-button label="map">{{ t('performance.charts.map') }}</el-radio-button>
      </el-radio-group>
    </div>

    <div class="chart-container" v-show="activeChart === 'thrust'">
      <div ref="thrustChartRef" class="chart"></div>
    </div>

    <div class="chart-container" v-show="activeChart === 'efficiency'">
      <div ref="efficiencyChartRef" class="chart"></div>
    </div>

    <div class="chart-container" v-show="activeChart === 'map'">
      <div ref="mapChartRef" class="chart"></div>
    </div>
  </div>
</template>

<style scoped>
.charts-container {
  padding: 15px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.charts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.charts-header h3 {
  margin: 0;
  font-size: 14px;
  color: #aaa;
  text-transform: uppercase;
}

.results-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.result-item {
  text-align: center;
}

.result-item .label {
  display: block;
  font-size: 10px;
  color: #888;
  margin-bottom: 4px;
}

.result-item .value {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #4ade80;
}

.chart-tabs {
  margin-bottom: 10px;
}

.chart-container {
  flex: 1;
  min-height: 200px;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style>
