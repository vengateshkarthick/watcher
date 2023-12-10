import React from "react";
import { Mweekdays, MCalendar, MEvents } from "./calendar.type";
import * as _ from "lodash";
import { motion } from "framer-motion";
import * as _dutlis from "date-fns";
import rightarrow from "../../assests/right.svg";
import leftarrow from "../../assests/left.svg";

import "./calendar.scss";

const weekdays: Mweekdays["short"] = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thur",
  "Fri",
  "Sat",
];

function Calendar({ events, onSelectDate }: MCalendar) {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = React.useState<{
    slcdate: string;
    events?: [] | MEvents[];
  }>({ slcdate: "" });
  const startDate = _dutlis.startOfMonth(currentDate);
  const endDate = _dutlis.endOfMonth(currentDate);
  /**
   * get arrays of days from start date to ending date of the month
   */
  const daysInTheMonth = _dutlis.eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
  /**
   *  for filling the space left at starting of month in that week -
   *  get last date of previous month
   *  get the buffer days - the number of days in a week left till the starting of the month
   *  iterate from (last date - buffer days length) to the length of buffer days
   */
  const previousMonth = _dutlis.getMonth(currentDate) - 1;
  const lastDateOfPreviousMonth = _dutlis.getDaysInMonth(
    previousMonth !== -1
      ? new Date(_dutlis.getYear(currentDate), previousMonth)
      : new Date(new Date(_dutlis.getYear(currentDate), 11))
  );
  const bufferDaysFromStart = _.range(0, _dutlis.getDay(startDate) - 1);

  const previousMonthRemainigDays = _.range(
    lastDateOfPreviousMonth - bufferDaysFromStart.length,
    lastDateOfPreviousMonth + 1,
    1
  );
  /**
   *  for filling the space left at ending of the month in that week -
   *  get buffer days from the end of the month to 7
   *  iterate till buffer days.length from 1
   */
  const bufferDaysFromEnd = _.range(_dutlis.getDay(endDate) + 1, 7);
  const nextMonthStartingDays = _.range(1, bufferDaysFromEnd.length + 1);
  const groupedEvents = _.groupBy(events, ({ startDate, startTime }) =>
    _dutlis.format(new Date(`${startDate}T${startTime}`), "dd/MM/yyyy")
  );
  const handleSelect = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    formattedDate: string
  ) => {
    let mod: any = { slcdate: "", events: [] };
    if (formattedDate) {
      mod.slcdate = formattedDate;
      if (groupedEvents[formattedDate])
        mod.events = groupedEvents[formattedDate];
    }
    setSelectedDate(() => mod);
    e.stopPropagation();
  };
  React.useEffect(() => {
    if (selectedDate.slcdate.length) {
      onSelectDate?.(selectedDate.slcdate, selectedDate.events);
    }
  }, [selectedDate]);
  const lengend = React.useMemo(() => {
    return [
      {
        color: "events",
        label: "Events",
      },
      {
        color: "today",
        label: "Today",
      },
    ];
  }, []);
  return (
    <motion.div className="mcalendar-wrapper">
      <motion.article className="mcalendar-full-month d-flex align-items-center justify-content-center m-1 p-1">
        <p>
          <motion.img
            animate={{ scale: 1 }}
            whileHover={{ x: "-10px" }}
            whileTap={{ x: "-10px" }}
            transition={{ duration: 0.3 }}
            src={leftarrow}
            alt="left-arrow"
            height={30}
            width={20}
          />
        </p>
        <p>
          {_dutlis.format(currentDate, "MMMM")}&nbsp;(
          {_dutlis.format(currentDate, "yyyy")})
        </p>
        <p>
          <motion.img
            animate={{ scale: 1 }}
            whileTap={{ x: "10px" }}
            whileHover={{ x: "10px" }}
            transition={{ duration: 0.3 }}
            src={rightarrow}
            alt="right-arrow"
            height={30}
            width={20}
          />
        </p>
      </motion.article>
      <motion.div
        className="mcalendar text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {weekdays.map((day, index) => (
          <motion.article
            className="mx-1 py-1 mcalendar-day"
            key={`mcalendar-day${index}`}
          >
            {day}
          </motion.article>
        ))}

        {previousMonthRemainigDays.map((bfd) => (
          <motion.article
            key={bfd + "_empty"}
            className="mcalendar-date empty d-flex flex-column m-1"
          >
            {bfd}
          </motion.article>
        ))}
        {daysInTheMonth.map((date) => {
          const formattedDate = _dutlis.format(date, "dd/MM/yyyy");
          const displayDate = _dutlis.format(date, "d");
          const eventsLength = groupedEvents[formattedDate]?.length;
          const isSelectedDate = selectedDate.slcdate.includes(formattedDate);
          const isCurrentDate = _dutlis.isSameDay(date, currentDate);
          return (
            <motion.article
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: isSelectedDate ? 1 : 1.5 }}
              whileHover={{ scale: isSelectedDate ? 1 : 1.5 }}
              transition={{ duration: 0.2, type: "spring" }}
              className={`mcalendar-date ${
                isCurrentDate ? "current-date" : ""
              } ${isSelectedDate ? "selected" : ""}  d-flex flex-column m-1 `}
              key={`mcalendar-date-${displayDate}`}
              data-date={formattedDate}
              onClick={(e) => handleSelect(e, formattedDate)}
            >
              <motion.div className="display-date">{displayDate}</motion.div>
              <motion.div className="display-events">
                {eventsLength && <p className="rounded">+{eventsLength}</p>}
              </motion.div>
            </motion.article>
          );
        })}
        {nextMonthStartingDays.map((bfd) => (
          <motion.article
            key={bfd + "_empty"}
            className="mcalendar-date empty d-flex flex-column m-1"
          >
            {bfd}
          </motion.article>
        ))}
      </motion.div>
      <motion.article className="d-flex align-items-baseline justify-content-center gap-3">
        {lengend.map(({ color, label }) => (
          <div className={`lengend ${color} d-flex justify-content-between align-items-center`}>
            <section className={`${color}`}>&nbsp;</section>
            <section>{label}</section>
          </div>
        ))}
      </motion.article>
    </motion.div>
  );
}

export default Calendar;
