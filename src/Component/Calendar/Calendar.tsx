import React from "react";
import { MCalendar, MEvents } from "./calendar.type";
import * as _ from "lodash";
import { AnimatePresence, motion } from "framer-motion";
import * as _dutlis from "date-fns";
import rightarrow from "../../assests/right.svg";
import leftarrow from "../../assests/left.svg";

import "./calendar.scss";
import { useCalendarState } from "../../store/bucket";
import MCalendarHelper from "./helper";

function Calendar({ events, onSelectDate, view = "monthly" }: MCalendar) {
  const [selectedDate, setSelectedDate] = React.useState<{
    slcdate: string;
    events?: [] | MEvents[];
  }>({ slcdate: "" });

  
  const {
    currentDate,
    currentMonthStartDate,
    currentMonthEndDate,
    daysInCurrentMonth,
    weekDaysInShort,
    moveNextMonth,
    movePreviousMonth,
    switchToToday,
    timeFormat,
    timings,
  } = useCalendarState((state) => state);
  
  const [current_time, setCurrentTime] = React.useState<string>(MCalendarHelper.getFormattedDate(currentDate, "HH : mm z"));
  const [currentHrIndex, setCurrentHrIndex] = React.useState<string>('0');
  /**
   *  for filling the space left at starting of month in that week -
   *  get last date of previous month
   *  get the buffer days - the number of days in a week left till the starting of the month
   *  iterate from (last date - buffer days length) to the length of buffer days
   */
  const previousMonth = MCalendarHelper.getPreviousMonth(currentDate);
  const lastDateOfPreviousMonth = MCalendarHelper.getLastDateOfPreviousMonth(
    previousMonth,
    currentDate
  );
  const startingWeekDay = MCalendarHelper.getDay(currentMonthStartDate);
  const bufferDaysFromStart = _.range(
    0,
    startingWeekDay === 1 ? startingWeekDay : startingWeekDay - 1,
    1
  );

  let previousMonthRemainigDays: Array<number> = [];
  if (startingWeekDay) {
    if (startingWeekDay === 1)
      previousMonthRemainigDays.push(lastDateOfPreviousMonth);
    else {
      previousMonthRemainigDays = _.range(
        lastDateOfPreviousMonth - bufferDaysFromStart.length,
        lastDateOfPreviousMonth + 1,
        1
      );
    }
  }
  /**
   *  for filling the space left at ending of the month in that week -
   *  get buffer days from the end of the month to 7
   *  iterate till buffer days.length from 1
   */
  const bufferDaysFromEnd = _.range(
    MCalendarHelper.getDay(currentMonthEndDate) + 1,
    7
  );
  const nextMonthStartingDays = _.range(1, bufferDaysFromEnd.length + 1);
  const groupedEvents = _.groupBy(events, ({ startDate, startTime }) =>
    MCalendarHelper.getFormattedDate(
      new Date(`${startDate} ${startTime}`),
      "dd/MM/yyyy"
    )
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
        color: view === "monthly" ? "today" : "now",
        label: view === "monthly" ? "Today" : "Now",
      },
    ];
  }, []);

  const handlePrevious = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setSelectedDate((prev) => ({ ...prev, slcdate: "" }));
    movePreviousMonth();
    e.stopPropagation();
  };

  const handleNext = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setSelectedDate((prev) => ({ ...prev, slcdate: "" }));
    moveNextMonth();
    e.stopPropagation();
  };

  const Header = () => {
    return (
      <React.Fragment>
        <motion.article className="mcalendar-full-month d-flex align-items-center justify-content-center m-1 p-1">
          <p>
            {/* need to remove this div a wrap an button with all:unset */}
            <div onClick={handlePrevious} tabIndex={-1}>
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
            </div>
          </p>
          <p>
            {MCalendarHelper.getFormattedDate(currentDate, "MMMM")}&nbsp;(
            {MCalendarHelper.getFormattedDate(currentDate, "yyyy")})
          </p>
          <p>
            <div onClick={handleNext} tabIndex={-1}>
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
            </div>
          </p>
        </motion.article>
      </React.Fragment>
    );
  };

  const MonthlyView = (
    <>
     <motion.div
        className="mcalendar text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {weekDaysInShort.map((day, index) => (
          <motion.article
            className="mx-1 py-1 mcalendar-day"
            key={`mcalendar-day${index}`}
          >
            {day}
          </motion.article>
        ))}

        <AnimatePresence>
          {previousMonthRemainigDays.map((bfd) => (
            <motion.article
              key={bfd + "_empty_prev_remanining_days"}
              className="mcalendar-date empty d-flex m-1"
            >
              {bfd}
            </motion.article>
          ))}
          {daysInCurrentMonth.map((date, idx) => {
            const formattedDate = MCalendarHelper.getFormattedDate(
              date,
              "dd/MM/yyyy"
            );
            const displayDate = MCalendarHelper.getFormattedDate(date, "d");
            const isNewYearFest = formattedDate.includes("01/01");
            const eventsLength = groupedEvents[formattedDate]?.length;
            const isSelectedDate = selectedDate.slcdate.includes(formattedDate);
            const isCurrentDate = MCalendarHelper.isSameDay(date, currentDate);
            return (
              <motion.article
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: (isSelectedDate || eventsLength)  ? 1 : 1.5 }}
                whileHover={{ scale: (isSelectedDate || eventsLength) ? 1 : 1.5 }}
                transition={{ duration: 0.2, type: "spring" }}
                className={`mcalendar-date ${eventsLength ? "has-events" : ""} ${
                  isCurrentDate ? "current-date" : ""
                } ${isSelectedDate ? "selected" : ""}  d-flex m-1 `}
                key={`mcalendar-date-${displayDate}_${idx}`}
                data-date={formattedDate}
                onClick={(e) => handleSelect(e, formattedDate)}
              >
                <motion.div className="display-date">{displayDate} {isNewYearFest ? <sup>🥳</sup> : ''}</motion.div>
              </motion.article>
            );
          })}
          {nextMonthStartingDays.map((bfd) => (
            <motion.article
              key={bfd + "_empty_next_month_remaining_days"}
              className="mcalendar-date empty d-flex m-1"
            >
              {bfd}
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      <motion.article className="d-flex w-100 m-1 align-items-baseline justify-content-center gap-3">
        <motion.button
          className={`set-today-btn ${
            MCalendarHelper.isSameMoth(new Date(), currentDate) &&
            MCalendarHelper.isSameYear(new Date(), currentDate)
              ? "disabled"
              : ""
          }`}
          initial={{ scale: 1 }}
          whileTap={{ scale: 1.2 }}
          transition={{ duration: 0.5, type: "spring" }}
          onClick={(e) => {
            switchToToday();
            e.stopPropagation();
          }}
          disabled={MCalendarHelper.isSameDate(new Date(), currentDate)}
        >
          Today
        </motion.button>
      </motion.article>
      <motion.article className="d-flex align-items-baseline justify-content-center gap-3">
        {lengend.map(({ color, label }) => (
          <div
            key={label}
            className={`lengend ${color} d-flex justify-content-between align-items-center`}
          >
            <section className={`${color}`}>&nbsp;</section>
            <section>{label}</section>
          </div>
        ))}
      </motion.article>
    </>
  );

  const intrId = setInterval(() => {
    setCurrentTime(() => MCalendarHelper.getFormattedDate(new Date(), "HH : mm z"));
  }, 1000);
  
  React.useEffect(() => {
   return (() =>  {
    if (intrId) clearInterval(intrId);
   });
  }, [])

  React.useEffect(() => {
    if (current_time) {
      const [hr] = current_time.split(" ");
      setCurrentHrIndex(() => hr);
    }
  }, [current_time])

  const DailyView = (
   <>
    <motion.article className="mcalendar-daily-view text-center">
      <div className="my-1 mx-auto row row-cols-12 justify-content-center align-items-center">
        <div className="col-5 today selected text-center mx-auto">{`${MCalendarHelper.getFormattedDate(currentDate, "d")} - ${MCalendarHelper.getFormattedDate(currentDate, "eeee")}`}</div>
        <div className="col-5 current-time text-center " key="current_time_interval">{current_time}</div>
      </div>
      <AnimatePresence>
        
        <motion.article className="mcalender-timings">
            {
              timings[timeFormat].map((time, idx) => {
                return (
                  <>
                  <div className="each-time d-flex h-100 w-100 justify-content-start gap-1  align-items-center" key={`each-time-${idx}`}>
                    {<div className={`${time.includes(currentHrIndex) ? "now":  'not-now'}`}>&nbsp;</div>}
                    <div>{time}</div>
                  </div>
                  <div className="events">&nbsp;</div>
                  </>
                  

                );
              })
            }
        </motion.article>
        
      </AnimatePresence>
      <motion.article className="d-flex align-items-baseline justify-content-center gap-3">
        {lengend.map(({ color, label }) => (
          <div
            key={label}
            className={`lengend ${color} d-flex justify-content-between align-items-center`}
          >
            <section className={`${color}`}>&nbsp;</section>
            <section>{label}</section>
          </div>
        ))}
      </motion.article>
    </motion.article>
   </>
  );
  const renderElement = {
    "monthly" : MonthlyView,
    "daily": DailyView,
  };
  return (
    <motion.div className="mcalendar-wrapper">
      <Header />
      {renderElement[view]}
    </motion.div>
  );
}

export default Calendar;
