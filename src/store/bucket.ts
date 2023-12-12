import { create } from "zustand";
import * as _ from "lodash";
import * as _dutlis from "date-fns";
import { MEvents, Mweekdays } from "../Component/Calendar/calendar.type";

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
      const date = _dutlis.getDate(currentDate);
      const _currentDate = new Date(year, month, date);
      return _currentDate;
    }

    static getCurrentMonthStartDate(currentDate: Date) {
      return  _dutlis.startOfMonth(currentDate);
    }

    static getCurrentMonthEndDate(currentDate: Date) {
      return  _dutlis.startOfMonth(currentDate);
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
      const date = _dutlis.getDate(currentDate);
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
    timeFormat: "HH:mm" | "hh:mm aaaa"
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
    timeFormat: "HH:mm",

}));
