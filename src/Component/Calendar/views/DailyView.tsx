import React from "react";
import { MCalendar, MEvents } from "../calendar.type";
import * as _ from "lodash";
import { AnimatePresence, motion } from "framer-motion";
import { useCalendarState } from "../../../store/bucket";
import * as _dutlis from "date-fns";
import MCalendarHelper from "../helper";
import backward from "../../../assests/backward.svg";
import forward from "../../../assests/forward.svg";
import "../calendar.scss";

function DailyView({ events, onSelectTime, setEventDate }: MCalendar & { setEventDate?: (p: Date) => void }) {
  const [selectedDate, setSelectedDate] = React.useState<{
    slcdate: string;
    events?: [] | MEvents[];
  }>({ slcdate: "" });

  const { currentDate, timeFormat, timings, daysInCurrentMonth } =
    useCalendarState((state) => state);

  const [day, setDay] = React.useState(() => new Date(currentDate));
  const [isDisable, setIsDisabled] = React.useState({
    forward: false,
    backward: false,
  });


  const [current_time, setCurrentTime] = React.useState<string>(
    MCalendarHelper.getFormattedDate(day, "HH : mm z")
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
      mod.scldate = day;
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

  React.useEffect(() => {
    if (day) {
      setEventDate?.(day);
    }

  }, [day]);

  const movePrev = (e: any) => {
    e?.stopPropagation();
    const newDate = MCalendarHelper.moveToPrevDay(day);
    if (daysInCurrentMonth.find((item) => MCalendarHelper.getFormattedDate(item, "yyyy-MM-dd") === MCalendarHelper.getFormattedDate(newDate, "yyyy-MM-dd") )) {
      setDay(() => newDate);
      if (isDisable.backward)
        setIsDisabled((prev) => ({ ...prev, backward: false }));
    } else setIsDisabled((prev) => ({ ...prev, backward: true }));
  };

  const moveNext = (e:any) => {
    e?.stopPropagation();
    const newDate = MCalendarHelper.moveToNextDay(day);
    if (daysInCurrentMonth.find((item) => MCalendarHelper.getFormattedDate(item, "yyyy-MM-dd") === MCalendarHelper.getFormattedDate(newDate, "yyyy-MM-dd") )) {
      setDay(() => newDate);
      if (isDisable.forward)
        setIsDisabled((prev) => ({ ...prev, forward: false }));
    } else setIsDisabled((prev) => ({ ...prev, forward: true }));
  };

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
        <div className="my-1 mx-1 row row-cols-12 gap-3 justify-content-evenly align-items-center info-container">
          <div className="col-5 today selected text-center">
            <div className="d-flex justify-content-between align-items-center">
              <article
                onClick={movePrev}
                tabIndex={-1}
                className={`${isDisable.backward ? "disabled" : " "}`}
              >
                <motion.img
                  animate={{ scale: 1 }}
                  whileTap={{  x: `${isDisable.backward ? '0' : '10px'}` }}
                  transition={{ duration: 0.2 }}
                  src={backward}
                  className="mx-1"
                  alt="right-arrow"
                  height={20}
                  width={18}
                />
              </article>
              <article>
                {`${MCalendarHelper.getFormattedDate(
                  day,
                  "d"
                )} - ${MCalendarHelper.getFormattedDate(day, "eeee")}`}
              </article>
              <article
                onClick={moveNext}
                tabIndex={-1}
                className={`${isDisable.forward ? "disabled" : " "}`}
              >
                <motion.img
                  animate={{ scale: 1 }}
                  whileTap={{  x: `${isDisable.forward ? '0' : '10px'}` }}
                  transition={{ duration: 0.2 }}
                  src={forward}
                  className="mx-1"
                  alt="right-arrow"
                  height={20}
                  width={18}
                />
              </article>
            </div>
          </div>
          <div
            className="col-4 current-time text-center "
            key="current_time_interval"
          >
            {current_time}
          </div>
        </div>
        {renderTimeScale()}
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
