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
import MCalendarHelper from "./helper";

const renderElement = {
  "monthly" : MonthlyView,
  "daily": DailyView,
}; 

function Calendar({ view = "monthly", ...rest }: MCalendar) {
  const [currentEventDate, setEventDate] = React.useState<Date>();
  const { setPublicHolidays, currentYear } = useCalendarState((state) => {
    return {
      setPublicHolidays: state.setPublicHolidays,
      currentYear: MCalendarHelper.getFormattedDate(state.currentDate, "yyyy"),
    }
  });
  React.useEffect(() => {
   if (setPublicHolidays) {
    usePublicHoldiday("in", currentYear)
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
  }, [currentYear]);

  const eventDateRef = React.useRef<Date>();

 
  
  const CalendarComponent = renderElement[view];
  return (
    <motion.div className="mcalendar-wrapper">
      <Header showInfoIcon={view === "daily"} eventDate={currentEventDate} />
      <CalendarComponent {...rest} key={currentYear} setEventDate={setEventDate}/>
      <ToastContainer />
    </motion.div>
  );
}

export default Calendar;
