import React from "react";
import * as _ from "lodash";
import { motion } from "framer-motion";
import { useCalendarState } from "../../store/bucket";
import * as _dutlis from "date-fns";
import rightarrow from "../../assests/right.svg";
import leftarrow from "../../assests/left.svg";
import info from "../../assests/info.svg";
import MCalendarHelper from "./helper";
import "./calendar.scss";
import EventPopperBox from "./EventPopperBox";
import { Header as MHeader } from './calendar.type';


function Header({ showInfoIcon, eventDate }: MHeader ) {
  const { currentDate, moveNextMonth, movePreviousMonth, public_holidays } = useCalendarState(
    (state) => state
  );

  const handlePrevious = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    movePreviousMonth();
    e.stopPropagation();
  };

  const handleNext = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    moveNextMonth();
    e.stopPropagation();
  };

  const formattedDate = MCalendarHelper.getFormattedDate(eventDate || currentDate, 'yyyy-MM-dd')
  const gpholidays = React.useMemo(() => {
    const { response } = public_holidays ?? { response: []};
    return _.groupBy(response, ({ date }) => date );
  }, [public_holidays]);


  return (
    <React.Fragment>
      <motion.article className="mcalendar-full-month d-flex align-items-center justify-content-center m-1 p-1">
        <p>
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
        {
          showInfoIcon && 
          <p>
            <div data-tooltip-id={`${formattedDate}-info`}>
               <motion.img
                src={info}
                alt="right-arrow"
                height={30}
                width={20}
               />
            </div>
            <EventPopperBox id={`${formattedDate}-info`} place="bottom" public_events={gpholidays[formattedDate]} />
          </p>
          
        }
      </motion.article>
    </React.Fragment>
  );
}

export default Header;
