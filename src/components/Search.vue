<template>
  <div>
    <div class="text-center text-3xl text-emerald-500 my-4">{{ ShowText }}</div>
  </div>
  
  <div v-show="!Data">
    <div class="flex">
      <div class="w-1/2 flex justify-center">
        <a-select
          v-model:value="DefaultYear"
          :options="optionsYear"
          @change="handleChangeYear"
          class="w-3/4 mx-auto"
        ></a-select>
      </div>
      <div class="w-1/2 flex justify-center">
        <a-select
          ref="select"
          v-model:value="DefaultMonth"
          :options="optionsMonth"
          @change="handleChangeMonth"
          class="w-3/4 mx-auto"
        ></a-select>
      </div>
    </div>
    <div>
      <div class="text-center mx-auto my-2 px-2 rounded-lg border-2 text-xl text-white bg-blue-700 w-max" @click="Search()">
        送出
      </div>
    </div>
  </div>
  <div v-show="Data">
    <div v-show="SelectOneMonth">
      <div class="flex w-full mx-auto">
        <div class="border-solid border-2 w-1/4 text-center" v-for="Schema in ShowSchema"> {{ Schema }} </div>
      </div>
      <div v-show="!IsLoading" class="flex w-full mx-auto">
        <div class="border-solid border-2 w-1/4 text-center" v-for="Schema in ShowData"> {{ Schema }} </div>
      </div>
    </div>
    <div v-if="SelectOneYear">
      <Table :Data="YearData"></Table>
    </div>
    <loading 
      :active="IsLoading" 
      :is-full-page="true"
      :color="'#26852aff'">
    </loading>
    <div 
      class="text-center mx-auto my-4 p-2 rounded-lg border-2 text-l text-white bg-blue-700 w-max"
      @click="Return()"
    >
      重新查詢
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, nextTick } from "vue";
import Date from "@/assets/data.json"
import { searchCarbon, searchCarbonYear } from "@/functions/carbon.js"
import Loading from 'vue3-loading-overlay';
// Import stylesheet
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import Table from "@/components/Table.vue"
const SelectYear = ref();
const SelectMonth = ref();
const DefaultYear = ref('請選擇年份');
const optionsYear = ref(Date['Year']);
const DefaultMonth = ref('請選擇月份');
const optionsMonth = ref(Date['Month']);
const ShowSchema = ["年份", "月份", "城市", "碳排放量"];
const props = defineProps({
  City: String
});
const City = ref();
const CarbonData = ref();
const ShowData = ref([SelectYear, SelectMonth, City, CarbonData]);
const IsLoading = ref(true);
const chart = ref();

// 選擇以年查詢
const SelectOneYear = ref(false);
const SelectOneMonth = ref(false);
let YearData = ref([]);



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
  if(SelectMonth.value === undefined && SelectYear.value === undefined) return;
  IsLoading.value = true;
  Data.value = true;
  ShowText.value = "查詢結果";
  City.value = props.City;
  if(SelectMonth.value === undefined || SelectMonth.value == 13){
    YearData.value = [];
    SelectOneMonth.value = false;
    
    let temp = await searchCarbonYear(SelectYear.value, City.value);

    for(let i = 0; i < temp['amount'].length; i++){
      YearData.value.push(Math.floor(Number(temp['amount'][i]) / 1000));
    }
    
    SelectOneYear.value = true;
    console.log(YearData.value);
    IsLoading.value = false;
  }
  else{
    SelectOneMonth.value = true;
    let data = await searchCarbon(SelectYear.value, SelectMonth.value, City.value);
    CarbonData.value = Math.floor(Number(data['amount'][0]) / 1000);
    IsLoading.value = false;
  }
}

function Return(){
  SelectOneYear.value = false;
  Data.value = false;
  ShowText.value = "請選擇欲查詢的時間";
}
</script>