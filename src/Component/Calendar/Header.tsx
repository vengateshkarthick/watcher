import React from "react";
import * as _ from "lodash";
import { motion } from "framer-motion";
import { useCalendarState } from "../../store/bucket";
import * as _dutlis from "date-fns";
import rightarrow from "../../assests/right.svg";
import leftarrow from "../../assests/left.svg";
import MCalendarHelper from "./helper";
import "./calendar.scss";

function Header() {
  const { currentDate, moveNextMonth, movePreviousMonth } = useCalendarState(
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
      </motion.article>
    </React.Fragment>
  );
}

export default Header;
