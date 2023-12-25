import axios from 'axios';

const env = import.meta.env;

const TestApiSite = `http://${env.VITE_API}:${env.VITE_BACKEND_PORT}/`;

export async function searchCarbon(YearStart, MonthStart, YearEnd, MonthEnd, City)
{
  const apiUrl = TestApiSite + "dataInterval";
  console.log(apiUrl)

  return new Promise((resolve, reject) => {
    axios.get(apiUrl, {
      params: {
        yearStart: YearStart,
        monthEnd: MonthStart,
        yearEnd: YearEnd,
        monthEnd: MonthEnd,
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
