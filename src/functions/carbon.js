import axios, { all } from 'axios';

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
  const apiUrl = TestApiSite + "data";
  return new Promise((resolve, reject) => {
    axios.get(apiUrl, {
      params: {
        year: Year,
        month: "all",
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
