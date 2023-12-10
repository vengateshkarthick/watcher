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
      end: _dutlis.startOfMonth(new Date()),
    }),
    weekDaysInShort: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
    currentView: 'monthly',
    movePreviousMonth: () => {
      set((state) => ({ currentDate: UseCalendarHelper.movePreviousMonth(state.currentDate) }) )
    },
    switchView: () => {},
    moveNextMonth: () => {},
    timeFormat: "HH:mm",

}));
