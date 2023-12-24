export type Mremainder = "1800" | "3600" | "86400" | "600";
export interface Mweekdays {
    short: [ "Sun" & string, "Mon" & string, "Tue" & string, "Wed" & string, "Thur" & string, "Fri" & string, "Sat" & string];
    long: ["Sunday" & string, "Monday" & string, "Tuesday" & string, "Wednesday" & string, "Thursday" & string, "Friday" & string, "Saturday" & string];
} 

export type MViews  = "monthly" | "daily";

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
  view?: MViews,
  currentDateTime?: string,
  onSelectDate?: (currentDate: string, selectedEvents?:MEvents[]) => void,
  onSelectTime?: (currentDate: string, selectedEvents?:MEvents[]) => void,
}