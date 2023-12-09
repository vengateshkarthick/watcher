export type Mremainder = "1800" | "3600" | "86400" | "600";
export interface Mweekdays {
    short: ["Mon" & string, "Tue" & string, "Wed" & string, "Thur" & string, "Fri" & string, "Sat" & string, "Sun" & string];
    long: ["Monday" & string, "Tuesday" & string, "Wednesday" & string, "Thursday" & string, "Friday" & string, "Saturday" & string, "Sunday" & string];
} 
export interface MEvents {
  title: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  remindBefore?: Mremainder[],
  tags?:Array<{label: string, color: React.CSSProperties['color']}>,
  attendes?: Array<{name: string, email: string, shouldSentRemainder?: boolean}>,
  isRecurringEvent?: boolean,
  location?: string,
  isMeeting?: boolean, 
}
export interface MCalendar {
  events?: Array<MEvents>,
  onSelectDate?: (currentDate: string, selectedEvents?:MEvents[]) => void,
}