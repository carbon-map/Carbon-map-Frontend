<template>
  <div>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script setup>

import { ref, defineProps, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables);
const chart = ref();

const props = defineProps({
  Data: Array
});

onMounted(() => {
  console.log(props.Data)
  if(chart.value){
    const ctx = chart.value.getContext('2d'); // 获取图表的 Canvas 元素
    const chartData = {
      labels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      datasets: [{
        label: '年碳排放量',
        data: props.Data,
        backgroundColor: 'rgba(0, 123, 255, 0.3)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1
      }]
    };

    new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      },
    });
  }
})
</script>