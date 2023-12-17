<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 619 855" xml:space="preserve">
    <path
      v-for="pathData in TaiwanData"
      :key="pathData.id"
      :d="pathData.d"
      :fill="pathData.fill"
      class="regional"
      v-show="true"
      @click="toRegional(pathData.name)"
    />
  </svg>
</template>

<script setup>

import Taiwan from "@/assets/map/Taiwan.json"
import { ref } from "vue"

// 整個台灣的地圖資料，區域是一塊一塊的
const TaiwanData = ref(Taiwan)

function toRegional(area) {
  console.log(area)
}

</script>