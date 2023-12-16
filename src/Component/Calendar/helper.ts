import * as _dateutils from 'date-fns';
class MCalendarHelper {
   static getPreviousMonth(date: Date) {
     return _dateutils.getMonth(date) - 1;
   }

   static getLastDateOfPreviousMonth(prevMonth: number, date: Date) {
     return _dateutils.getDaysInMonth(
        prevMonth !== -1
          ? new Date(_dateutils.getYear(date), prevMonth, 1)
          : 11
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

   static isSameMoth(c1:Date, c2: Date) {
     return _dateutils.getMonth(c1) === _dateutils.getMonth(c2);
   }




}

export default MCalendarHelper;