import React from "react";
import ReactDOM from "react-dom";
import Event from "../../../assests/event.svg";
import Close from "../../../assests/close.svg";
import { AnimatePresence, motion } from "framer-motion";
import { Hresponse, MEvents } from "../calendar.type";
import "./Popup.scss";
interface Popup {
  top: string;
  left: string;
  public_holidays: Hresponse[];
  grouped_events?: MEvents[];
  canShow: boolean;
  onClose: () => void;
}
function Popup({
  top,
  left,
  public_holidays,
  onClose,
  canShow,
  grouped_events,
}: Popup) {
  return ReactDOM.createPortal(
    canShow && (
      <AnimatePresence>
        <motion.div
          className="popup card"
          style={{ top, left }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.075 }}
        >
          <motion.article
            className="close m-1 me-3"
            whileTap={{ scale: 1.5 }}
            whileHover={{ scale: 1.5 }}
            transition={{ duration: 0.4 }}
            onClick={() => onClose()}
          >
            <img src={Close} height="21" width="21" />
          </motion.article>
          <motion.article className="card-img-top">
            <img src={Event} alt="img-event" width="100%" />
          </motion.article>
          <motion.div className="card-body">
            {public_holidays.length === 0 && (
              <span className="fs-5 no-event">No Events</span>
            )}
            <div className="my-grid">
              {public_holidays?.map(({ name }) => (
                <React.Fragment key={name.toLowerCase()}>
                  <motion.p className="box m-0 col-2">&nbsp;</motion.p>
                  <motion.p className="name m-0 col-auto mx-1">
                    {name?.trim()}
                  </motion.p>
                </React.Fragment>
              ))}
              {grouped_events?.map(({ title, tags, startTime, endTime }) => (
                <React.Fragment key={title.toLowerCase()}>
                  <motion.p className="box m-0 col-2">&nbsp;</motion.p>
                  <motion.p className="name m-0 col-auto mx-1">
                    <div className="event-title">{title}</div> &nbsp;
                    {startTime}&nbsp;-&nbsp;{endTime}
                    <motion.section className="tags">
                      {tags?.map(({ label, color }) => (
                        <div style={{ color }}>{label}</div>
                      ))}
                    </motion.section>
                  </motion.p>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    ),
    document.body
  );
}

export default Popup;
