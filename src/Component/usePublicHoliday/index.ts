/**
 * @params country -  country code supported in
 * @url https://calendarific.com/supported-countries
 * @returns Array of holidays [{ name: "name of the holiday", date: "date in iso standard YYYY-MM-DD", type: ["observarance"] }]
 *
 */

import { Hresponse } from "../Calendar/calendar.type";



const error = {
  401: "Unauthorized Missing or incorrect API token in header",
  429: "Max api limit reached",
  500: "Internal server error",
};
export async function usePublicHoldiday(country = "in", year = "2023") {
  const queryParams = new URLSearchParams({
    api_key: import.meta.env.VITE_HOLIDAY_KEY,
    country,
    year,
  });
  const response = await fetch(
    `https://calendarific.com/api/v2?${queryParams}`,
    { method: "GET" }
  );
  const {
    response: {
      holidays,
      meta: { code },
    },
  }: {
    response: { holidays: Hresponse[]; meta: { code: 200 | 429 | 500 | 401 } };
  } = await response.json();
  if (code === 200) {
    const public_holidays = holidays?.map(({ name, date, type }) => {
      const { iso } = date as { iso : string}
      return ({
        name,
        date: iso,
        type,
    });
    });
    return ({ response: public_holidays, isError: false, code, message: "Success" })
  }
  return { code, message: error[`${code}`] || error[500], isError: true };
}
