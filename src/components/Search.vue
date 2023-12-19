<template>
  <div>
    <div class="text-center text-3xl text-emerald-500">{{ ShowText }}</div>
  </div>
  
  <div v-show="!Data">
    <div class="flex">
      <div class="w-1/2">
        <a-select
          ref="select"
          v-model:value="DefaultYear"
          :options="optionsYear"
          @change="handleChange"
          class="w-1/3 mx-auto"
        ></a-select>
      </div>
      <div class="w-1/2">
        <a-select
          ref="select"
          v-model:value="DefaultMonth"
          :options="optionsMonth"
          @change="handleChange"
          class="w-1/3 mx-auto"
        ></a-select>
      </div>
    </div>
    <div>
      <div class="w-1/6 mx-auto text-center bg-blue-300" @click="Search()">
        送出
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref } from "vue";
import Date from "@/assets/data.json"
const DefaultYear = ref('請選擇年份');
const optionsYear = ref(Date['Year']);
const DefaultMonth = ref('請選擇月份');
const optionsMonth = ref(Date['Month']);

const handleChange = value => {
  console.log(`selected ${value}`);
};
// True 代表在顯示資料的地方，反之在查詢的地方
const Data = ref(false);
const ShowText = ref("請選擇欲查詢的時間");

function Search(){
  Data.value = true;
  ShowText.value = "查詢結果"
}
</script>