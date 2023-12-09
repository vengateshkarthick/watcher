import React from 'react';
import { Mweekdays, MCalendar, MEvents } from './calendar.type'
import * as _ from 'lodash';
import { motion } from 'framer-motion';
import * as _dutlis from 'date-fns';
import './calendar.scss'

const weekdays: Mweekdays['short'] = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

function Calendar({ events, onSelectDate }:MCalendar) {
    const currentDate = new Date();
    const [selectedDate, setSelectedDate] = React.useState<{slcdate: string, events?:[] | MEvents[]}>({slcdate: ''});
    const startDate = _dutlis.startOfMonth(currentDate);
    const endDate = _dutlis.endOfMonth(currentDate);
    const daysInTheMonth = _dutlis.eachDayOfInterval({
        start: startDate,
        end: endDate,
    });
    const bufferDays = _.range(0, _dutlis.getDay(startDate));
    const groupedEvents = _.groupBy(events, ({ startDate, startTime }) => _dutlis.format(new Date(`${startDate}T${startTime}`), "DD/MM/YYYY"));
    const handleSelect = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        const date = e.currentTarget.dataset['date'];
        let mod:any = { slcdate: '', events: [] };
        if (date) {
            mod.slcdate = date;
            if (groupedEvents[date]) mod.events = groupedEvents[date];
        }
        setSelectedDate(mod);
        
    }
    React.useEffect(() => {
      if (selectedDate.slcdate.length) {
        onSelectDate?.(selectedDate.slcdate, selectedDate.events)
      }
    }, [selectedDate])
    return (
        <motion.div
          className='mcalendar text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}

        >
          {weekdays.map((day, index) => (<motion.article className='mx-1 py-1' key={`mcalendar-day${index}`}>{day}</motion.article>))}
          {bufferDays.map((bfd) => <motion.article key={bfd + '_empty'} className='mcalendar-date'>&nbsp;</motion.article>)}
          {daysInTheMonth.map((date) => {
            const formattedDate = _dutlis.format(date, "dd/mm/yyyy");
            const displayDate = _dutlis.format(date, "d");
            const eventsLength = groupedEvents[formattedDate]?.length;

            return (
                <motion.article
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 1.5 }}
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.2, type: 'spring' }}
                className={`mcalendar-date d-flex flex-column mx-1 py-1 ${selectedDate.slcdate === formattedDate ? 'selected' : ''}`}
                key={`mcalendar-date-${displayDate}`}
                data-date={formattedDate}
                onClick={handleSelect}
               >
                <motion.div className='display-date'>
                {displayDate}
                </motion.div>
                <motion.div className='display-events'>
                  {eventsLength && <p className='rounded'>+{eventsLength}</p>}
                </motion.div>
               </motion.article>
            )
          })}
        </motion.div>
    )

}

export default Calendar;