import axios from 'axios';

const env = import.meta.env;

const TestApiSite = `http://${env.VITE_API}/`;

export async function searchCarbon(Year, Month, City)
{
  const apiUrl = TestApiSite + "data";
  return new Promise((resolve, reject) => {
    axios.get(apiUrl, {
      params: {
        year: Year,
        month: Month,
        city: City.trim()
      }
    })
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      console.error(error);
      reject(error);
    });
  });
}

export async function searchCarbonYear(Year, City)
{ 
  console.log(City);
  const apiUrl = TestApiSite + "dataInterval";
  return new Promise((resolve, reject) => {
    axios.get(apiUrl, {
      params: {
        yearStart: Year,
        yearEnd: Year,
        monthStart: 1,
        monthEnd: 12,
        city: City.trim()
      }
    })
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      console.error(error);
      reject(error);
    });
  });
}
