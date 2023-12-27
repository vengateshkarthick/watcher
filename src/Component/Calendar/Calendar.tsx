import React from "react";
import { Hresponse, MCalendar } from "./calendar.type";
import * as _ from "lodash";
import { motion } from "framer-motion";
import * as _dutlis from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
import MonthlyView from "./views/Monthly";
import DailyView from "./views/DailyView";
import Header from "./Header";
import { useCalendarState } from "../../store/bucket";
import { usePublicHoldiday } from "../usePublicHoliday";
import 'react-toastify/dist/ReactToastify.css';
import "./calendar.scss";

function Calendar({ view = "monthly", ...rest }: MCalendar) {
  const setPublicHolidays = useCalendarState((state) => state.setPublicHolidays)
  React.useEffect(() => {
   if (setPublicHolidays) {
    usePublicHoldiday()
    .then(res => {
      setPublicHolidays(res)
      if (res.isError) {
        toast(res.message, {
          position: 'top-right',
          type: 'error',
          autoClose: 3000,
          closeOnClick: true,
          theme: 'colored',
        });
      }
    })
   }
  }, []);
  const renderElement = {
    "monthly" : MonthlyView,
    "daily": DailyView,
  };
  const CalendarComponent = renderElement[view];
  return (
    <motion.div className="mcalendar-wrapper">
      <Header />
      <CalendarComponent {...rest} />
      <ToastContainer />
    </motion.div>
  );
}

export default Calendar;
