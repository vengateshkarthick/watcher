import React from "react";
import Event from "../../../assests/event.svg";
import { motion } from "framer-motion";
import { Hresponse, MEvents } from "../calendar.type";

interface Popup {
  height: string;
  width: string;
  public_holidays: Hresponse[];
  grouped_events: MEvents[];
  canShow: boolean;
}
function Popup({ height = "450px", width = "450px", public_holidays, canShow }: Popup) {
  return (
    <motion.div className="popup card border-rounded" style={{ height, width }}>
      <motion.article className="card-img-top">
        <img src={Event} alt="img-event" />
      </motion.article>
      <motion.article className="card-body">
        <motion.section className="row row-cols-12 justify-content-between align-items-center">
          {public_holidays.map(({ type, name }) => (
            <motion.div className="col col-4 d-flex gap-1 justify-content-between align-items-basline">
              <motion.p className="box m-0"></motion.p>
              <motion.p className="name m-0">{name?.trim()}</motion.p>
              <motion.p className="type m-0">{type.join(" ")}</motion.p>
            </motion.div>
          ))}
        </motion.section>
      </motion.article>
    </motion.div>
  );
}

export default Popup;
