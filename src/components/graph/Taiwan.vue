<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 619 855" xml:space="preserve">
    <path
      v-for="pathData in TaiwanData"
      :key="pathData.id"
      :d="pathData.d"
      :fill="pathData.fill"
      class="regional"
      v-show="TaiwanShow"
      @click="toRegional(pathData.id)"
    />
    <path
      v-for="pathData in CityData"
      :key="pathData.id"
      :d="pathData.d"
      :fill="pathData.fill"
      class="regional"
      v-show="RegionalShow[pathData.regional] && CityShow[pathData.id]"
      @click="toCity(pathData.id)"
    />
  </svg>
</template>

<script setup>

import Taiwan from "@/assets/map/Taiwan.json"
import City from "@/assets/map/City.json"
import { ref } from "vue"

// 整個台灣的地圖資料，區域是一塊一塊的
const TaiwanData = ref(Taiwan);

const CityData = ref(City);

const TaiwanShow = ref(true);
const RegionalShow = ref(new Array(5).fill(false));
const CityShow = ref(new Array(22).fill(true));


function toRegional(id) {
  TaiwanShow.value = false;
  RegionalShow.value[id] = true;
}

function toCity(id) {
  console.log(id);
  for(let i = 0; i < CityShow.value.length; i++){
    if(i != id) CityShow.value[i] = false;
  }
}
</script>