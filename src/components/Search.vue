<template>
  <div>
    <div class="text-center text-3xl text-emerald-500 my-4">{{ ShowText }}</div>
  </div>
  
  <div v-show="!Data">
    <div class="flex">
      <div class="w-1/2">
        <a-select
          v-model:value="DefaultYear"
          :options="optionsYear"
          @change="handleChangeYear"
          class="w-1/3 mx-auto"
        ></a-select>
      </div>
      <div class="w-1/2">
        <a-select
          ref="select"
          v-model:value="DefaultMonth"
          :options="optionsMonth"
          @change="handleChangeMonth"
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
  <div v-show="Data">
    <div class="flex w-2/3 mx-auto">
      <div class="border-solid border-2 w-1/4 text-center" v-for="Schema in ShowSchema"> {{ Schema }} </div>
    </div>
    <loading 
      :active="IsLoading" 
      :is-full-page="true"
      :color="'#26852aff'">
    </loading>
    <div v-show="!IsLoading" class="flex w-2/3 mx-auto">
      <div class="border-solid border-2 w-1/4 text-center" v-for="Schema in ShowData"> {{ Schema }} </div>
    </div>
    <div 
      class="text-center mx-auto my-4 p-2 rounded-lg border-2 text-xl text-white bg-blue-700 w-max"
      @click="Return()"
    >
      重新查詢
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import Date from "@/assets/data.json"
import { searchCarbon } from "@/functions/carbon.js"
import Loading from 'vue3-loading-overlay';
// Import stylesheet
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
const SelectYear = ref();
const SelectMonth = ref();
const DefaultYear = ref('請選擇年份');
const optionsYear = ref(Date['Year']);
const DefaultMonth = ref('請選擇月份');
const optionsMonth = ref(Date['Month']);
const ShowSchema = ["年份", "月份", "城市", "碳排放量(kg)"];
const props = defineProps({
  City: String
});
const City = ref();
const CarbonData = ref();
const ShowData = ref([SelectYear, SelectMonth, City, CarbonData]);
const IsLoading = ref(true);

const handleChangeYear = value => {
  SelectYear.value = value;
};

const handleChangeMonth = value => {
  SelectMonth.value = value;
};
// True 代表在顯示資料的地方，反之在查詢的地方
const Data = ref(false);
const ShowText = ref("請選擇欲查詢的時間");

async function Search(){
  if(SelectMonth.value === undefined || SelectYear.value === undefined) return;
  IsLoading.value = true;
  Data.value = true;
  ShowText.value = "查詢結果";
  City.value = props.City;
  let data = await searchCarbon(SelectYear.value, SelectMonth.value, City.value);
  CarbonData.value = Number(data['amount']);
  IsLoading.value = false;
}

function Return(){
  Data.value = false;
  ShowText.value = "請選擇欲查詢的時間";
}
</script>