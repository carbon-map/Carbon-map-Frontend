<template>
  <!-- <ArrowLeftOutlined class="text-red-400 text-8xl hover:bg-zinc-100" v-show="!TaiwanShow" @click="previous()"/> -->
  <div class="text-center text-4xl text-emerald-500 mt-4">{{ ShowText }}</div>
  <div ref="main" class="relative m-8 mt-24 h-1/2">
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
        @click="toCity(pathData.id, pathData.name)"
        :ref="el => setCityRef(el, pathData.id)"
      />
    </svg>
    <loading 
      :active="IsLoading" 
      :is-full-page="true"
      :color="'#26852aff'"
      :opacity="1">
    </loading>
  </div>
  <div v-if="ShowSearch" class="h-auto">
    <Search :City="SelectCity"></Search>
  </div>
</template>

<script setup>

import Taiwan from "@/assets/map/Taiwan.json"
import City from "@/assets/map/City.json"
import Search from "@/components/Search.vue"
import { CalCenter,  GetCenterPoint} from "@/functions/Calculate"
import { ref, nextTick, onMounted } from "vue"
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import Loading from 'vue3-loading-overlay';
// Import stylesheet
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
// 整個台灣的地圖資料，區域是一塊一塊的
const TaiwanData = ref(Taiwan);
const CityData = ref(City);
const TaiwanShow = ref(true);
const ShowText = ref("請選擇區域");
const ShowSearch = ref(false);
const IsLoading = ref(false);
let SelectCity = ref();
let ShiftRegional = {};
let ShiftRegionalIndex = [];
let ShiftCity = {};
let main = ref()
// 紀錄現在選了哪個區域，全台灣時設為 -1 
let RegionalIndex = -1;
const RegionalShow = ref(new Array(5).fill(false));
const CityShow = ref(new Array(22).fill(true));
const CityInform = (new Array(22)).fill().map(() => ref(null));

// 要 RegionalShow 跟 CityShow 都為 true 才能跑
// 因此二級區域選單為選定區域 true 其餘 false
// 三級城市預設全開啟

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function toRegional(id) {
  TaiwanShow.value = false;
  RegionalShow.value[id] = true;
  RegionalIndex = id;
  ShowText.value = "請選擇縣市";


  // 等待 v-show 改變渲染完
  await nextTick();

  let pointSet = [];

  for(let i = 0; i < CityData.value.length; i++){
    if(CityData.value[i].regional == id){
      let bound = CityInform[CityData.value[i].id].value.getBoundingClientRect();
      let x = bound.x;
      let y = bound.y;
      pointSet.push([x, y, x + bound.width, y + bound.height]);
    }
  }

  
  let WindowCenter = GetCenterPoint();
  let DomCenter = CalCenter(pointSet);

  ShiftRegional.x = WindowCenter.x - DomCenter.x;
  ShiftRegional.y = WindowCenter.y - DomCenter.y;
  
  for(let i = 0; i < CityData.value.length; i++){
    if(CityData.value[i].regional == id){
      let obj = CityInform[CityData.value[i].id].value;
      ShiftRegionalIndex.push(i);
      obj.style.transform = `translate(${ShiftRegional.x}px, ${ShiftRegional.y}px)`;
    }
  }

}

function setCityRef(el, id){
  CityInform[id].value = el;
}


async function toCity(id, name) {
  let flag = false;
  for(let i = 0; i < CityShow.value.length; i++){
    if(CityShow.value[i] == false) flag = true;
  }

  if(flag) return;
  
  main.value.style = "height:35%;  margin-top: 1rem;"
  console.log(main.value);

  ShowSearch.value = true;
  for(let i = 0; i < CityShow.value.length; i++){
    if(i != id) CityShow.value[i] = false;
  }
  for(let i = 0; i < CityData.value.length; i++){
    if(CityData.value[i].id == id){
      let obj = CityInform[CityData.value[i].id].value;
      obj.style.transform = "";
      IsLoading.value = true;
      await sleep(300);
      IsLoading.value = false;
      let bound = obj.getBoundingClientRect();
      let x = bound.x;
      let y = bound.y;
      let DomCenter = CalCenter([[x, y, x + bound.width, y + bound.height]]);
      let WindowCenter = GetCenterPoint();
      ShiftCity.x = WindowCenter.x - DomCenter.x;
      ShiftCity.y = WindowCenter.y - DomCenter.y;
      obj.style.transform += ` translate(${ShiftCity.x * 2 }px, ${ShiftCity.y * 2}px)`;
      obj.style += " margin-top: 1rem; height:200%;"
      break;
    }
  }
  SelectCity.value = name;
  ShowText.value = name;
}

onMounted(() => {
  window.previous = previous;
})

async function previous() {
  let flag = false;

  for(let i = 0; i < CityShow.value.length; i++){
    if(CityShow.value[i] == false) flag = true;
    CityShow.value[i] = true;
  }
  
  //  CityShow 都為 True ， 代表現在在二級選單
  if(!flag){
    
    for(let i = 0; i < ShiftRegionalIndex.length; i++){
      let idx = ShiftRegionalIndex[i];
      let obj = CityInform[CityData.value[idx].id].value;
      obj.style.transform = ``;
    }
    ShowText.value = "請選擇區域";
    RegionalShow.value[RegionalIndex] = false;
    RegionalIndex = -1;
    TaiwanShow.value = true;
    ShiftRegionalIndex = [];
  }

  else{
    main.value.style = "";
    for(let i = 0; i < ShiftRegionalIndex.length; i++){
      let idx = ShiftRegionalIndex[i];
      let obj = CityInform[CityData.value[idx].id].value;
      obj.style.transform = ``;
    }
    for(let i = 0; i < ShiftRegionalIndex.length; i++){
      let idx = ShiftRegionalIndex[i];
      let obj = CityInform[CityData.value[idx].id].value;
      obj.style.transform = `translate(${ShiftRegional.x}px, ${ShiftRegional.y}px)`;
    }
    ShowText.value = "請選擇縣市";
    ShowSearch.value = false;
  }

}

</script>