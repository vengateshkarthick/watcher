import { create } from "zustand";
import * as _ from "lodash";
import * as _dutlis from "date-fns";
import { MEvents, Mweekdays } from "../Component/Calendar/calendar.type";

enum endate {
  'm0' = 31,
  'm1' = 28,
  'm2' = 31,
  'm3' = 30,
  'm4' = 31,
  'm5' = 30,
  'm6' = 31,
  'm7' = 31,
  'm8' = 30,
  'm9' = 31,
  'm10' = 30,
  'm11' = 31,
}

const timeSlots = {
  "24hr": ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
  "12hr" : ['12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM']

} 
class UseCalendarHelper {
    static movePreviousMonth(currentDate: Date) {
      let month = _dutlis.getMonth(currentDate);
      let year = _dutlis.getYear(currentDate);
      if (month === 0) {
       year -= 1; 
       month = 11;
      }
      else {
        month -= 1;
      }
     let date = _dutlis.getDate(currentDate);
     if (date === 30 || date === 31) date = Number(endate[`m${month}` as any]);
      const _currentDate = new Date(year, month, date);
      return _currentDate;
    }

    static getCurrentMonthStartDate(currentDate: Date) {
      return  _dutlis.startOfMonth(currentDate);
    }

    static getCurrentMonthEndDate(currentDate: Date) {
      return  _dutlis.endOfMonth(currentDate);
    }

    static generateDaysIntheMonth(startDate:Date, endDate:Date) {
      return  _dutlis.eachDayOfInterval({
        start: _dutlis.startOfMonth(startDate),
        end: _dutlis.endOfMonth(endDate),
      });
    }

    static moveNextMonth(currentDate: Date) {
      let month = _dutlis.getMonth(currentDate);
      let year = _dutlis.getYear(currentDate);
      if (month === 11) {
       year += 1; 
       month = 0;
      }
      else {
        month += 1;
      }
      let date = _dutlis.getDate(currentDate);
      if (date === 30 || date === 31) date = Number(endate[`m${month}` as any]);
      const _currentDate = new Date(year, month, date);
      return _currentDate;
    }

    static switchToToday() {
      const month = _dutlis.getMonth(new Date());
      const year = _dutlis.getYear(new Date());
      const date = _dutlis.getDate(new Date());
      const _currentDate = new Date(year, month, date);
      return _currentDate;
    }
}

interface MCalendarState {
    currentDate: Date,
    currentMonthStartDate: Date,
    currentMonthEndDate: Date,
    daysInCurrentMonth: Array<Date>,
    movePreviousMonth: () => void,
    moveNextMonth: () => void,
    currentView: 'monthly' | 'daily',
    weekDaysInShort: Mweekdays['short'],
    switchView: () => void,
    events?: MEvents[],
    timeFormat: "24hr" | "12hr",
    switchToToday: () => void;
    timings: typeof timeSlots;
}

export const useCalendarState = create<MCalendarState>((set) => ({
    currentDate: new Date(),
    currentMonthStartDate: _dutlis.startOfMonth(new Date()),
    currentMonthEndDate: _dutlis.endOfMonth(new Date()),
    daysInCurrentMonth: _dutlis.eachDayOfInterval({
      start: _dutlis.startOfMonth(new Date()),
      end: _dutlis.endOfMonth(new Date()),
    }),
    weekDaysInShort: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
    currentView: 'monthly',
    movePreviousMonth: () => {
      set((state) => {
        const ncurrentMonth = UseCalendarHelper.movePreviousMonth(state.currentDate);
        const nStartDate = UseCalendarHelper.getCurrentMonthStartDate(ncurrentMonth);
        const nEndDate = UseCalendarHelper.getCurrentMonthEndDate(ncurrentMonth);
        const nDays = UseCalendarHelper.generateDaysIntheMonth(nStartDate, nEndDate);
        return {
          currentDate: ncurrentMonth,
          currentMonthStartDate: nStartDate,
          currentMonthEndDate: nEndDate,
          daysInCurrentMonth: nDays,
        }
      });
    },
    switchView: () => {
      set((state) => ({ currentView: state.currentView.includes('monthly') ? 'daily' : 'monthly' }))
    },
    timings: timeSlots,
    moveNextMonth: () => {
      set((state) => {
        const ncurrentMonth = UseCalendarHelper.moveNextMonth(state.currentDate);
        const nStartDate = UseCalendarHelper.getCurrentMonthStartDate(ncurrentMonth);
        const nEndDate = UseCalendarHelper.getCurrentMonthEndDate(ncurrentMonth);
        const nDays = UseCalendarHelper.generateDaysIntheMonth(nStartDate, nEndDate);
        return {
          currentDate: ncurrentMonth,
          currentMonthStartDate: nStartDate,
          currentMonthEndDate: nEndDate,
          daysInCurrentMonth: nDays,
        }
      });
    },
    timeFormat: "24hr",
    switchToToday: () => {
      set(() => {
        const ncurrentMonth = UseCalendarHelper.switchToToday();
        const nStartDate = UseCalendarHelper.getCurrentMonthStartDate(ncurrentMonth);
        const nEndDate = UseCalendarHelper.getCurrentMonthEndDate(ncurrentMonth);
        const nDays = UseCalendarHelper.generateDaysIntheMonth(nStartDate, nEndDate);
        return {
          currentDate: ncurrentMonth,
          currentMonthStartDate: nStartDate,
          currentMonthEndDate: nEndDate,
          daysInCurrentMonth: nDays,
        }
      });
    }

}));
