<template>
  <div>
    <div class="text-center text-3xl text-emerald-500 my-4">{{ ShowText }}</div>
  </div>
  
  <div v-show="!Data">
    <div class="flex">
      <div class="w-1/2 flex justify-center">
        <a-select
          v-model:value="DefaultYearStart"
          :options="optionsYearStart"
          @change="handleChangeYearStart"
          class="w-2/3 mx-auto"
        ></a-select>
      </div>
      <div class="w-1/2 flex justify-center">
        <a-select
          ref="select"
          v-model:value="DefaultMonthStart"
          :options="optionsMonthStart"
          @change="handleChangeMonthStart"
          class="w-2/3 mx-auto"
        ></a-select>
      </div>
    </div>
    <div class="flex">
      <div class="w-1/2 flex justify-center">
        <a-select
          v-model:value="DefaultYearEnd"
          :options="optionsYearEnd"
          @change="handleChangeYearEnd"
          class="w-2/3 mx-auto"
        ></a-select>
      </div>
      <div class="w-1/2 flex justify-center">
        <a-select
          ref="select"
          v-model:value="DefaultMonthEnd"
          :options="optionsMonthEnd"
          @change="handleChangeMonthEnd"
          class="w-2/3 mx-auto"
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
    <!-- <div class="flex w-2/3 mx-auto">
      <div class="border-solid border-2 w-1/4 text-center" v-for="Schema in ShowSchema"> {{ Schema }} </div>
    </div> -->
    <loading 
      :active="IsLoading" 
      :is-full-page="true"
      :color="'#26852aff'">
    </loading>
    <div v-show="!IsLoading" class="flex w-2/3 mx-auto">
      <!-- <div class="border-solid border-2 w-1/4 text-center" v-for="Schema in ShowData"> {{ Schema }} </div> -->
      
    </div>
    
    <div 
      class="text-center mx-auto my-4 p-2 rounded-lg border-2 text-xl text-white bg-blue-700 w-max"
      @click="Return()">
      重新查詢
    </div>
    <div>
      <CChart ref="chart" id="chart" type="line" :wrapper="true" :data="CarbonData" :redraw="Boolean(true)"/>
    </div>
  </div>


  
  
</template>

<script setup>
import { ref, defineProps, onMounted, watch, nextTick } from "vue";
import Date from "@/assets/data.json"
import { searchCarbon } from "@/functions/carbon.js"
import Loading from 'vue3-loading-overlay';
// Import stylesheet
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import { CChart } from '@coreui/vue-chartjs'

const SelectYearStart = ref();
const SelectMonthStart = ref();
const DefaultYearStart = ref('開始年份');
const optionsYearStart = ref(Date['Year']);
const DefaultMonthStart = ref('開始月份');
const optionsMonthStart = ref(Date['Month']);

const SelectYearEnd = ref();
const SelectMonthEnd = ref();
const DefaultYearEnd = ref('結束年份');
const optionsYearEnd = ref(Date['Year']);
const DefaultMonthEnd = ref('結束月份');
const optionsMonthEnd = ref(Date['Month']);

const chart = ref();

onMounted(() => {
  console.dir(chart);
})


const CarbonData = ref({
    labels: [],
    datasets: [
      {
        label: 'Carbon Emission',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: []
      }
    ]
  });


const ShowSchema = ["年份", "月份", "城市", "碳排放量(kg)"];
const props = defineProps({
  City: String
});
const City = ref();
// const CarbonData = ref();
// const ShowData = ref([SelectYearStart, SelectMonthStart, City, CarbonData]);
const IsLoading = ref(true);

const handleChangeYearStart = value => {
  SelectYearStart.value = value;
};

const handleChangeMonthStart = value => {
  SelectMonthStart.value = value;
};
const handleChangeYearEnd = value => {
  SelectYearEnd.value = value;
};

const handleChangeMonthEnd = value => {
  SelectMonthEnd.value = value;
};



const Data = ref(false);
const ShowText = ref("請選擇欲查詢的時間");

async function Search(){
  if(SelectMonthStart.value === undefined || SelectYearStart.value === undefined ||
  SelectMonthEnd.value === undefined || SelectYearEnd.value === undefined) return;
  IsLoading.value = true;
  Data.value = true;
  ShowText.value = "查詢結果";
  City.value = props.City;
  let rows = await searchCarbon(SelectYearStart.value, SelectMonthStart.value, SelectYearEnd.value, SelectMonthEnd.value, City.value);
  console.log(rows);

  let year_temp = SelectYearStart.value
  let month_temp = SelectMonthStart.value


  CarbonData.value.labels.splice(0)
  CarbonData.value.datasets[0].data.splice(0)
  while((year_temp < SelectYearEnd.value) || (year_temp == SelectYearEnd.value && month_temp < SelectMonthEnd.value)){
    CarbonData.value.labels.push(`${year_temp}/${month_temp}`);
    month_temp ++;
    if(month_temp == 13){
      year_temp++;
      month_temp = 1;
    }
  }
  
 
  for(let i = 0; i < rows.length;i++){
    
    CarbonData.value.datasets[0].data.push(rows[i].amount);
  }
  console.log(CarbonData.value);
  

  // CarbonData.value = Number(data['amount']);

  //這邊動不了 我不知道為啥
  renderChart();
  IsLoading.value = false;
}
function renderChart(){
  
  console.log(chart.value.$props.data);
  chart.value.$props.data = CarbonData.value;
  
}

function Return(){
  Data.value = false;
  ShowText.value = "請選擇欲查詢的時間";
}
</script>