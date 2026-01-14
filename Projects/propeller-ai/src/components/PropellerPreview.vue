<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { usePropellerStore } from '../stores/propeller';
import { VideoPlay, Refresh, Picture } from '@element-plus/icons-vue';

const { t } = useI18n();

const containerRef = ref<HTMLDivElement>();
const isRotating = ref(true);
const rotationSpeed = ref(1);
const showAxes = ref(true);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let propellerGroup: THREE.Group;
let animationId: number;

const store = usePropellerStore();

function initScene(): void {
  if (!containerRef.value) return;

  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);

  camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 10);
  camera.position.set(0.5, 0.5, 0.8);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  containerRef.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
  directionalLight2.position.set(-5, -5, -5);
  scene.add(directionalLight2);

  const axesHelper = new THREE.AxesHelper(0.3);
  scene.add(axesHelper);

  propellerGroup = new THREE.Group();
  scene.add(propellerGroup);

  window.addEventListener('resize', onWindowResize);
}

function updatePropeller(): void {
  while (propellerGroup.children.length > 0) {
    const child = propellerGroup.children[0];
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      (child.material as THREE.Material).dispose();
    }
    propellerGroup.remove(child);
  }

  try {
    const geometry = store.getGeometry();
    const mesh = geometry.getPreviewMesh();
    propellerGroup.add(mesh);
  } catch (err) {
    console.error('Failed to generate propeller geometry:', err);
  }
}

function animate(): void {
  animationId = requestAnimationFrame(animate);

  if (isRotating.value && propellerGroup) {
    propellerGroup.rotation.z -= rotationSpeed.value * 0.02;
  }

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize(): void {
  if (!containerRef.value || !camera || !renderer) return;

  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function toggleRotation(): void {
  isRotating.value = !isRotating.value;
}

function resetCamera(): void {
  camera.position.set(0.5, 0.5, 0.8);
  controls.target.set(0, 0, 0);
  controls.update();
}

function exportScreenshot(): void {
  renderer.render(scene, camera);
  const dataUrl = renderer.domElement.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `propeller_${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}

watch(() => store.currentDesign, () => {
  updatePropeller();
}, { deep: true });

watch(showAxes, (val) => {
  const axes = scene.getObjectByProperty('type', 'AxesHelper');
  if (axes) {
    axes.visible = val;
  }
});

onMounted(() => {
  initScene();
  updatePropeller();
  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', onWindowResize);

  if (renderer) {
    renderer.dispose();
  }
});
</script>

<template>
  <div class="preview-container">
    <div ref="containerRef" class="three-container"></div>

    <div class="preview-toolbar">
      <el-button-group>
        <el-button
          :type="isRotating ? 'primary' : 'default'"
          @click="toggleRotation"
          :icon="isRotating ? VideoPlay : VideoPlay"
        >
          {{ isRotating ? t('preview.pause') : t('preview.play') }}
        </el-button>
        <el-button @click="resetCamera" :icon="Refresh">{{ t('preview.reset') }}</el-button>
        <el-button @click="exportScreenshot" :icon="Picture">{{ t('preview.screenshot') }}</el-button>
      </el-button-group>

      <div class="speed-control">
        <span>{{ t('preview.screenshot') }}</span>
        <el-slider
          v-model="rotationSpeed"
          :min="0.1"
          :max="5"
          :step="0.1"
          style="width: 100px;"
        />
      </div>

      <el-checkbox v-model="showAxes">{{ t('preview.axes') }}</el-checkbox>
    </div>

    <div class="preview-info">
      <span>{{ t('preview.info.diameter') }}: {{ store.currentDesign.diameter.toFixed(3) }}{{ t('operating.unit.m') }}</span>
      <span>{{ t('preview.info.blades') }}: {{ store.currentDesign.numBlades }}</span>
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.three-container {
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.preview-toolbar {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 8px 15px;
  background: rgba(22, 33, 62, 0.9);
  border-radius: 8px;
  z-index: 10;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.preview-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  gap: 15px;
  padding: 8px 12px;
  background: rgba(22, 33, 62, 0.9);
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
}
</style>
