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
import { Header as MHeader } from "./calendar.type";
import Popup from "./Popup/Popup";

function Header({ showInfoIcon, eventDate }: MHeader) {
  const iconRef = React.useRef<HTMLElement>();
  const [position, setPosition] = React.useState<{
    x: number;
    y: number;
    canShow: boolean;
  }>({ x: 0, y: 0, canShow: false });
  const { currentDate, moveNextMonth, movePreviousMonth, public_holidays } =
    useCalendarState((state) => state);

  React.useEffect(() => {
    if (iconRef.current) {
      let { left, top } = iconRef.current.getBoundingClientRect();
      if (top + 340 >= document.body.clientHeight) top = top - 170;
      if (left + 350 >= document.body.clientWidth) left = left - 200;
      setPosition(() => ({ x: left + 50, y: top + 50, canShow: true }));
    }
  }, [iconRef.current]);

  const setIconRef = React.useCallback((node: HTMLDivElement) => {
    if (node) {
      iconRef.current = node;
    }
  }, []);

  const handlePrevious = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    movePreviousMonth();
    e.stopPropagation();
  };

  const handleNext = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    moveNextMonth();
    e.stopPropagation();
  };

  const showOrHideHandler = (flag: boolean) => {
    setPosition((pos) => ({ ...pos, canShow: flag }));
  };

  const formattedDate = MCalendarHelper.getFormattedDate(
    eventDate || currentDate,
    "yyyy-MM-dd"
  );
  const gpholidays = React.useMemo(() => {
    const { response } = public_holidays ?? { response: [] };
    return _.groupBy(response, ({ date }) => date);
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
        {showInfoIcon && (
          <p>
            <div ref={setIconRef}>
              <motion.img
                src={info}
                alt="right-arrow"
                height={30}
                width={20}
                onHoverStart={() => showOrHideHandler(true)}
                onHoverEnd={() => showOrHideHandler(false)}
              />
            </div>
          </p>
        )}
      </motion.article>
      <Popup
        top={`${position.y}px`}
        left={`${position.x}px`}
        canShow={position.canShow}
        public_holidays={gpholidays[formattedDate] || []}
        onClose={() => showOrHideHandler(false)}
      />
    </React.Fragment>
  );
}

export default Header;
