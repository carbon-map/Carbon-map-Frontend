<template>

<div ref = "chinaMap" class="w-full h-full">

</div>

</template>

<script setup>
import * as echarts from "echarts";
import Taiwan from "@/assets/map/Taiwan.json"
import { onMounted, ref } from "vue";
const chinaMap = ref(null);

onMounted(() => {
  drawChina();
})

function drawChina() {
 var myChart = echarts.init(chinaMap.value)
 echarts.registerMap('Taiwan', Taiwan) //注册可用的地图
 var option = {
  geo: {
   show: true,
   //设置中心点
   center: [121.194115019531, 23.582111640625],
   map: 'china',
   roam: true, //是否允许缩放，拖拽
   zoom: 1, //初始化大小
   //缩放大小限制
   scaleLimit: {
    min: 0.1, //最小
    max: 12, //最大
   },
   //各个省份模块样式设置
   itemStyle: {
    normal: {
     areaColor: '#3352c7',//背景色
     color: 'red',//字体颜色
     borderColor: '#5e84fd',
     borderWidth: 2,
    },
   },
   //高亮状态
   emphasis: {
    itemStyle: {
     areaColor: '#ffc601',
    },
    label: {
     show: true,
     color: '#fff',
    },
   },
   // 显示层级
   z: 10,
  },
 }
 myChart.setOption(option)
}

</script>