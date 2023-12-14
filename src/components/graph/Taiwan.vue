<template>

  <div ref = "TaiwanMap" class="w-full h-full">

  </div>

</template>

<script setup>
import * as echarts from "echarts";
import Taiwan from "@/assets/map/Taiwan.json"
import { onMounted, ref } from "vue";
const TaiwanMap = ref(null);

onMounted(() => {
  drawChina();
})

function drawChina() {
  var myChart = echarts.init(TaiwanMap.value)
  echarts.registerMap('Taiwan', Taiwan) //注册可用的地图
  var option = {
    series: [
      {
        name: "台灣地圖",
        type: "map",
        map: "Taiwan",
        label: {
          show: true
        },
        data: [
          { name: "台北市", value: 12001 },
        ]
      },
    ]
  }
  myChart.setOption(option)
}

</script>