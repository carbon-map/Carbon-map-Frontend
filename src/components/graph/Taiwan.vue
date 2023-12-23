<template>
  <ArrowLeftOutlined class="text-red-400 text-8xl hover:bg-zinc-100" v-show="!TaiwanShow" @click="previous()"/>
  <div class="text-center text-4xl text-emerald-500">{{ ShowText }}</div>
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
  <div v-if="ShowSearch">
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

// 整個台灣的地圖資料，區域是一塊一塊的
const TaiwanData = ref(Taiwan);
const CityData = ref(City);
const TaiwanShow = ref(true);
const ShowText = ref("請選擇區域");
const ShowSearch = ref(false);
let SelectCity = ref();

// 紀錄現在選了哪個區域，全台灣時設為 -1 
let RegionalIndex = -1;
const RegionalShow = ref(new Array(5).fill(false));
const CityShow = ref(new Array(22).fill(true));
const CityInform = (new Array(22)).fill().map(() => ref(null));

// 要 RegionalShow 跟 CityShow 都為 true 才能跑
// 因此二級區域選單為選定區域 true 其餘 false
// 三級城市預設全開啟

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
  let Shift = { x: WindowCenter.x - DomCenter.x, y: WindowCenter.y - DomCenter.y};
  
  for(let i = 0; i < CityData.value.length; i++){
    if(CityData.value[i].regional == id){
      let obj = CityInform[CityData.value[i].id].value;
      console.log(obj.style);

      
      obj.style.transform = `translate(${Shift.x}px, ${Shift.y}px)`;
    }
  }

}

function setCityRef(el, id){
  CityInform[id].value = el;
}

// onmounted(() => {
//  
// })

function toCity(id, name) {
  ShowText.value = "";
  ShowSearch.value = true;
  for(let i = 0; i < CityShow.value.length; i++){
    if(i != id) CityShow.value[i] = false;
  }
  SelectCity.value = name;
  console.log(SelectCity.value)
}

onMounted(() => {
  window.previous = previous;
})

function previous() {
  let flag = false;

  for(let i = 0; i < CityShow.value.length; i++){
    if(CityShow.value[i] == false) flag = true;
    CityShow.value[i] = true;
  }
  
  //  CityShow 都為 True ， 代表現在在二級選單
  if(!flag){
    TaiwanShow.value = true;
    RegionalShow.value[RegionalIndex] = false;
    RegionalIndex = -1;
    ShowText.value = "請選擇區域";
  }

  else{
    ShowText.value = "請選擇縣市";
    ShowSearch.value = false;
  }

}

</script>