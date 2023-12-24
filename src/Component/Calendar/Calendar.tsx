import React from "react";
import { MCalendar } from "./calendar.type";
import * as _ from "lodash";
import { motion } from "framer-motion";
import * as _dutlis from "date-fns";
import "./calendar.scss";
import MonthlyView from "./views/Monthly";
import DailyView from "./views/DailyView";
import Header from "./Header";

function Calendar({ view = "monthly", ...rest }: MCalendar) {
 
  const renderElement = {
    "monthly" : MonthlyView,
    "daily": DailyView,
  };
  const CalendarComponent = renderElement[view];
  return (
    <motion.div className="mcalendar-wrapper">
      <Header />
      <CalendarComponent {...rest}/>
    </motion.div>
  );
}

export default Calendar;
