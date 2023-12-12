import * as _dateutils from 'date-fns';
class MCalendarHelper {
   static getPreviousMonth(date: Date) {
     return _dateutils.getMonth(date) - 1;
   }

   static getLastDateOfPreviousMonth(prevMonth: number, date: Date) {
     return _dateutils.getDaysInMonth(
        prevMonth !== -1
          ? new Date(_dateutils.getYear(date), prevMonth)
          : new Date(new Date(_dateutils.getYear(date), 11))
      );
   }
   
   static getDay(date: Date) {
     return _dateutils.getDay(date);
   }

   static getFormattedDate(date:Date, format:string) {
    return _dateutils.format(date, format);
   }

   static isSameDate(date:Date, currentDate: Date) {
    return _dateutils.isSameDay(date, currentDate);
   }




}

export default MCalendarHelper;