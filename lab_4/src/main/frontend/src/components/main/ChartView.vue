<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  width: { type: Number, default: 300 },
  height: { type: Number, default: 300 },
  minX: { type: Number, default: -5 },
  maxX: { type: Number, default: 5 },
  minY: { type: Number, default: -5 },
  maxY: { type: Number, default: 5 },
  radius: { type: Number, default: 0 },
  items: { type: Array, default: () => [] }
});

const emit = defineEmits(['onClickChart']);

const canvasRef = ref(null);

const getScaleFactorX = () => props.width / (props.maxX - props.minX);
const getScaleFactorY = () => props.height / (props.maxY - props.minY);

const positionToCoordinate = (position) => ({
  x: props.minX + position.x / getScaleFactorX(),
  y: props.maxY - position.y / getScaleFactorY()
});

const coordinateToPosition = (coordinate) => ({
  x: (coordinate.x - props.minX) * getScaleFactorX(),
  y: (props.maxY - coordinate.y) * getScaleFactorY()
});

const getCursorPosition = (event) => {
  const rect = canvasRef.value.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, props.width, props.height);

  context.strokeStyle = '#00000033';
  context.lineWidth = 0.5;
  context.beginPath();
  for (let x = getScaleFactorX(); x < props.width; x += getScaleFactorX()) {
    context.moveTo(x, 0); context.lineTo(x, props.height);
  }
  for (let y = getScaleFactorY(); y < props.height; y += getScaleFactorY()) {
    context.moveTo(0, y); context.lineTo(props.width, y);
  }
  context.stroke();

  context.lineWidth = 2;
  context.strokeStyle = 'black';
  context.beginPath();
  context.moveTo(props.width / 2, 0); context.lineTo(props.width / 2, props.height);
  context.moveTo(0, props.height / 2); context.lineTo(props.width, props.height / 2);
  context.stroke();

  if (props.radius !== 0) {
    const r = props.radius;
    const hr = r / 2;
    const isPositive = r > 0;

    context.beginPath();
    context.fillStyle = '#236BF155';
    context.strokeStyle = '#3E23F1';

    let center = coordinateToPosition({ x: 0, y: 0 });
    context.moveTo(center.x, center.y);

    if (isPositive) {
      let tStart = coordinateToPosition({ x: -hr, y: 0 });
      let tEnd = coordinateToPosition({ x: 0, y: hr });
      context.lineTo(tStart.x, tStart.y);
      context.lineTo(tEnd.x, tEnd.y);
      context.lineTo(center.x, center.y);

      let rTopRight = coordinateToPosition({ x: r, y: hr });
      context.lineTo(center.x, rTopRight.y);
      context.lineTo(rTopRight.x, rTopRight.y);
      context.lineTo(rTopRight.x, center.y);
      context.lineTo(center.x, center.y);

      context.arc(center.x, center.y, Math.abs(hr) * getScaleFactorX(), 0, Math.PI / 2, false);
    } else {
      let rBottomLeft = coordinateToPosition({ x: r, y: hr });
      context.lineTo(center.x, rBottomLeft.y);
      context.lineTo(rBottomLeft.x, rBottomLeft.y);
      context.lineTo(rBottomLeft.x, center.y);
      context.lineTo(center.x, center.y);

      let tStart = coordinateToPosition({ x: -hr, y: 0 });
      let tEnd = coordinateToPosition({ x: 0, y: hr });
      context.lineTo(tStart.x, tStart.y);
      context.lineTo(tEnd.x, tEnd.y);
      context.lineTo(center.x, center.y);

      context.arc(center.x, center.y, Math.abs(hr) * getScaleFactorX(), Math.PI, 1.5 * Math.PI, false);
    }

    context.closePath();
    context.fill();
    context.stroke();
  }

  props.items.forEach(item => {
    const pos = coordinateToPosition(item);
    context.fillStyle = item.hit ? 'green' : 'red';
    context.beginPath();
    context.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
    context.fill();
  });
};

watch(() => [props.radius, props.items, props.width, props.height], draw, { deep: true });

onMounted(draw);

const handleOnClick = (event) => {
  const position = getCursorPosition(event);
  const coordinate = positionToCoordinate(position);
  emit('onClickChart', coordinate);
};
</script>

<template>
  <canvas
      ref="canvasRef"
      :width="width"
      :height="height"
      @click="handleOnClick"
      class="chart-canvas"
  />
</template>

<style scoped>
.chart-canvas {
  cursor: crosshair;
  background: white;
  border-radius: 4px;
}
</style>