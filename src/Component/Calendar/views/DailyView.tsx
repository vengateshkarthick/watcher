import React from "react";
import { MCalendar, MEvents } from "../calendar.type";
import * as _ from "lodash";
import { AnimatePresence, motion } from "framer-motion";
import { useCalendarState } from "../../../store/bucket";
import * as _dutlis from "date-fns";
import MCalendarHelper from "../helper";
import "../calendar.scss";

function DailyView({ events, onSelectTime }: MCalendar) {
  const [selectedDate, setSelectedDate] = React.useState<{
    slcdate: string;
    events?: [] | MEvents[];
  }>({ slcdate: "" });

  const { currentDate, timeFormat, timings, public_holidays } = useCalendarState(
    (state) => state
  );

  const [current_time, setCurrentTime] = React.useState<string>(
    MCalendarHelper.getFormattedDate(currentDate, "HH : mm z")
  );
  const [currentHrIndex, setCurrentHrIndex] = React.useState<string>("0");

  const timelyGroupedEvents = React.useMemo(
    () =>
      _.groupBy(events, ({ startDate, startTime }) =>
        MCalendarHelper.getFormattedDate(
          new Date(`${startDate} ${startTime}`),
          "HH:mm"
        )
      ),
    [events]
  );
  const handleSelect = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    time: string
  ) => {
    let mod: any = { slcdate: "", events: [] };
    if (time && timelyGroupedEvents[time]) {
      mod.events = timelyGroupedEvents[time];
      mod.scldate = currentDate;
    }
    setSelectedDate(() => mod);
    e.stopPropagation();
  };
  React.useEffect(() => {
    if (selectedDate.slcdate.length) {
      onSelectTime?.(selectedDate.slcdate, selectedDate.events);
    }
  }, [selectedDate]);
  const lengend = React.useMemo(() => {
    return [
      {
        color: "events",
        label: "Events",
      },
      {
        color: "now",
        label: "Now",
      },
    ];
  }, []);

  const intrId = setInterval(() => {
    setCurrentTime(() =>
      MCalendarHelper.getFormattedDate(new Date(), "HH : mm z")
    );
  }, 1000);

  React.useEffect(() => {
    return () => {
      if (intrId) clearInterval(intrId);
    };
  }, []);

  React.useEffect(() => {
    if (current_time) {
      const [hr] = current_time.split(" ");
      setCurrentHrIndex(() => hr);
    }
  }, [current_time]);

  const renderTimeScale = () => (
    <motion.article className="mcalender-timings">
      {timings[timeFormat].map((time, idx) => {
        const hasEventAtMoment = timelyGroupedEvents[time];

        return (
          <>
            <div
              className="each-time d-flex h-100 w-100 justify-content-start gap-1  align-items-center"
              key={`each-time-${idx}`}
            >
              {
                <div
                  className={`${
                    time.includes(currentHrIndex) ? "now" : "not-now"
                  }`}
                >
                  &nbsp;
                </div>
              }
              <div>{time}</div>
            </div>
            <div className="events">&nbsp;</div>
          </>
        );
      })}
    </motion.article>
  );
  return (
    <>
      <motion.article className="mcalendar-daily-view text-center">
        <div className="my-1 mx-auto row row-cols-12 justify-content-center align-items-center">
          <div className="col-5 today selected text-center mx-auto">{`${MCalendarHelper.getFormattedDate(
            currentDate,
            "d"
          )} - ${MCalendarHelper.getFormattedDate(currentDate, "eeee")}`}</div>
          <div
            className="col-5 current-time text-center "
            key="current_time_interval"
          >
            {current_time}
          </div>
        </div>
        <AnimatePresence>{renderTimeScale()}</AnimatePresence>
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
}

export default DailyView;
