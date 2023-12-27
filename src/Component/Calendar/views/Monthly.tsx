import React from "react";
import { MCalendar, MEvents } from "../calendar.type";
import * as _ from "lodash";
import { AnimatePresence, motion } from "framer-motion";
import * as _dutlis from "date-fns";
import { useCalendarState } from "../../../store/bucket";
import MCalendarHelper from "../helper";
import "../calendar.scss";
import EventPopperBox from "../EventPopperBox";

function MonthlyView({ events, onSelectDate }: MCalendar) {
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
    switchToToday,
    public_holidays,
  } = useCalendarState((state) => state);

  const gpholidays = React.useMemo(() => {
    const { response } = public_holidays ?? { response: []};
    return _.groupBy(response, ({ date }) => date )
  }, [public_holidays]);

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
  const groupedEvents = React.useMemo(
    () =>
      _.groupBy(events, ({ startDate, startTime }) =>
        MCalendarHelper.getFormattedDate(
          new Date(`${startDate} ${startTime}`),
          "yyyy-MM-dd"
        )
      ),
    [events]
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

  const renderExactDays = () =>
    daysInCurrentMonth.map((date, idx) => {
      const formattedDate = MCalendarHelper.getFormattedDate(
        date,
        "yyyy-MM-dd"
      );
      const displayDate = MCalendarHelper.getFormattedDate(date, "d");
      const isNewYearFest = formattedDate.includes("01-01");
      const pbEvent = gpholidays[formattedDate];
      const eventsLength = groupedEvents[formattedDate]?.length;
      const isSelectedDate = selectedDate.slcdate.includes(formattedDate);
      const isCurrentDate = MCalendarHelper.isSameDay(date, currentDate);
      return (
        <>
        <motion.article
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: isSelectedDate || eventsLength ? 1 : 1.5 }}
          whileHover={{ scale: isSelectedDate || eventsLength ? 1 : 1.5 }}
          transition={{ duration: 0.2, type: "spring" }}
          className={`mcalendar-date ${(eventsLength || pbEvent?.length) ? "has-events" : ""} ${
            isCurrentDate ? "current-date" : ""
          } ${isSelectedDate ? "selected" : ""}  d-flex m-1 `}
          key={`mcalendar-date-${displayDate}_${idx}`}
          data-date={formattedDate}
          onClick={(e) => handleSelect(e, formattedDate)}
          data-tooltip-id={`popper-${formattedDate}`}
        >
          <motion.div className="display-date">
            {displayDate} {isNewYearFest ? <sup>🥳</sup> : ""}
          </motion.div>
        </motion.article>
        {
          pbEvent?.length &&  <EventPopperBox id={`popper-${formattedDate}`} public_events={pbEvent} custom_events={groupedEvents[formattedDate]} />
        }
        
         </>
      );
    });

  return (
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
        {renderExactDays()}
        <AnimatePresence>
          {previousMonthRemainigDays.map((bfd) => (
            <motion.article
              key={bfd + "_empty_prev_remanining_days"}
              className="mcalendar-date empty d-flex m-1"
            >
              {bfd}
            </motion.article>
          ))}

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
}

export default MonthlyView;
